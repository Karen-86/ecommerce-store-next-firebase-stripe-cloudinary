import React from "react";
import { InputDemo, TextareaDemo, ComboboxDemo } from "@/components/index";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORIES } from "@/constants";
import { formatNumberWithCurrency } from "@/lib/utils/formatters";
import type { OptionType, VariantType } from "@/modules/products/types";

const InventorySection = ({
  variants,
  setVariants,
}: {
  variants: VariantType[];
  setVariants: React.Dispatch<React.SetStateAction<VariantType[]>>;
}) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVariants((prev) => {
      return [
        {
          ...prev[0],
          [e.target.name]: e.target.name === "stock" ? String(Number(e.target.value)) : e.target.value,
        },
      ];
    });
  };

  const onBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVariants((prev) => {
      return [
        {
          ...prev[0],
          [e.target.name]:
            e.target.name === "stock"
              ? String(Math.round(Number(e.target.value))) // String() to prevent 0 prefix, Math.round() to prevent decimals
              : e.target.value
                ? formatNumberWithCurrency(e.target.value)
                : "",
        },
      ];
    });
  };

  return (
    <Card className="mb-5">
      <CardContent>
        <section className="inventory-section">
          <InputDemo
            label="Stock"
            name="stock"
            // placeholder="0"
            type="number"
            onChange={onChange}
            className="mb-5"
            labelClassName="text-xs text-black/70"
            value={variants[0].stock ?? 0}
            onBlur={onBlur}
          />
          <InputDemo
            label="SKU (Stock Keeping Unit)"
            name="sku"
            placeholder="SKU-001"
            type="text"
            onChange={onChange}
            labelClassName="text-xs text-black/70"
            value={variants[0].sku}
          />
        </section>
      </CardContent>
    </Card>
  );
};

export default InventorySection;
