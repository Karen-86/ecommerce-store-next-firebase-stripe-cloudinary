// import type { OptionType, VariantType } from "@/modules/products/types";

// export const generateVariants = (options: OptionType[], existingVariants: VariantType[] = []): VariantType[] => {
//   const validOptions = options.filter((o) => o.values.length);

//   if (!validOptions.length) return [];

//   const combinations = validOptions.reduce<any[]>(
//     (acc, option) => {
//       const result: any[] = [];

//       acc.forEach((combination) => {
//         option.values.forEach((value) => {
//           result.push({
//             ...combination,
//             [option.name]: value,
//           });
//         });
//       });

//       return result;
//     },
//     [{}],
//   );

//   return combinations.map((attributes) => {
//     // preserve existing variant data if possible
//     const existing = existingVariants.find((v) => JSON.stringify(v.attributes) === JSON.stringify(attributes));

//     return (
//       existing || {
//         sku: "",
//         stock: null,
//         price: null,
//         compareAtPrice: null,
//         images: [],
//         primaryImage: "",
//         attributes,
//       }
//     );
//   });
// };
import type { OptionType, VariantType, MediaItemType } from "@/modules/products/types";

function cartesian(values: string[][]): string[][] {
  return values.reduce<string[][]>(
    (acc, curr) => {
      const res: string[][] = [];

      for (const a of acc) {
        for (const c of curr) {
          res.push([...a, c]);
        }
      }

      return res;
    },
    [[]],
  );
}

function buildSku(base: string, attrs: Record<string, string>) {
  const suffix = Object.values(attrs)
    .map((v) => v.slice(0, 3).toUpperCase())
    .join("-");

  return `${base}-${suffix}`;
}

export function generateVariants(
  options: OptionType[],
  existing: VariantType[] = [],
  media: MediaItemType[],
): VariantType[] {
  const active = options.filter((o) => o.name && o.values.length);

  if (!active.length) return [];

  const names = active.map((o) => o.name);

  const valueMatrix = active.map((o) => o.values);

  const combos = cartesian(valueMatrix);

  return combos.map((combo) => {
    const attributes = combo.reduce<Record<string, string>>((acc, value, idx) => {
      acc[names[idx]] = value;
      return acc;
    }, {});

    const key = Object.values(attributes).join("|");

    // try to preserve existing variant if it exists
    const existingVariant = existing.find((v) =>
      Object.entries(attributes).every(([k, val]) => v.attributes?.[k] === val),
    );

    return {
      id: existingVariant?.id ?? `variant-${crypto.randomUUID()}`,
      sku: existingVariant?.sku ?? buildSku("TS", attributes),
      price: existingVariant?.price ?? 0,
      compareAtPrice: existingVariant?.compareAtPrice ?? 0,
      stock: existingVariant?.stock ?? 0,
      images: existingVariant?.images ?? media.map((mediaItem) => mediaItem.id),
      primaryImage: existingVariant?.primaryImage ?? media[0]?.id,
      attributes,
    };
  });
}
