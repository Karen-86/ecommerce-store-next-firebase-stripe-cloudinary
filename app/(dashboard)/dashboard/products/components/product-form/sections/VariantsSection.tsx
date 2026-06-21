"use client";

import React, { useEffect, useState, useMemo } from "react";
import { InputDemo, TextareaDemo, ComboboxDemo, ButtonDemo, ComboboxMultiple } from "@/components/index";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORIES } from "@/constants";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import type { SelectItemMultipleType } from "@/components/comboboxes/ComboboxMultiple";
import Joi, { ValidationResult } from "joi";
import { errorAlert } from "@/lib/utils/alert";
import type { OptionType, VariantType, MediaItemType } from "@/modules/products/types";
import { valueSlugify } from "@/components/comboboxes/ComboboxMultiple";
import { VariantsTable } from "../../variants-table/VariantsTable";
import { getColumns } from "../../variants-table/columns";
import { generateVariants } from "../../../utils/formatters";
import { formatNumberWithCurrency } from "@/lib/utils/formatters";

const DEFAULT_VARIANT = {
  id: `variant-${crypto.randomUUID()}`,
  sku: "",
  stock: 0,
  price: "",
  compareAtPrice: "",
  images: [],
  primaryImage: "",
  attributes: {},
};

const VariantsSection = ({
  options,
  setOptions,
  variants,
  setVariants,
  media,
}: {
  options: OptionType[];
  setOptions: React.Dispatch<React.SetStateAction<OptionType[]>>;
  variants: VariantType[];
  setVariants: React.Dispatch<React.SetStateAction<VariantType[]>>;
  media: MediaItemType[];
}) => {
  const onBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVariants((prevVariants) => {
      return prevVariants.map((variant) => {
        if (variant.id !== e.target.id) return variant;
        return {
          ...variant,
          [e.target.name]:
            e.target.name === "stock"
              ? String(Math.round(Number(e.target.value)))
              : e.target.value
                ? formatNumberWithCurrency(e.target.value)
                : "",
        };
      });
    });
  };

  // set media images for default variant
  useEffect(() => {
    if (options.length) return;
    if (!media.length) return;
    setVariants((prev: VariantType[]) => {
      return [{ ...prev[0], images: media.map((mediaItem) => mediaItem.id), primaryImage: media[0].id }];
    });

    // options depencency checks if variants removed and sets media images for default variant
  }, [media, options]);

  return (
    <Card className="mb-5 p-0">
      <CardContent className="p-0">
        <section className="variants-section" onClick={(e) => e.preventDefault()}>
          <div className="px-4 py-5">
            <h4 className={`text-[13px] tracking-wide text-black/80 mb-6`}>Variants</h4>

            {!!(options && options.length) && (
              <div className="border rounded-md mb-3 overflow-hidden">
                {options.map((option, index) => {
                  if (option.isSaved) return <SavedOption key={index} {...{ option, options, setOptions }} />;
                  return (
                    <UnsavedOption key={index} {...{ option, options, setOptions, variants, setVariants, media }} />
                  );
                })}
              </div>
            )}

            {options.length < 3 && (
              <ButtonDemo
                onClick={(e) => {
                  e.preventDefault();
                  setOptions((prev) => {
                    return [
                      ...prev,
                      {
                        id: crypto.randomUUID(),
                        name: "",
                        values: [],
                        isSaved: false,
                      },
                    ];
                  });
                }}
                size="xs"
                startIcon={<PlusCircle />}
                variant="ghostStrong"
                text={` ${options.length ? "Add another option" : "Add options like size or color"}`}
              />
            )}
          </div>

          <VariantsTable data={variants} columns={getColumns({ variants, setVariants, media, onBlur })} />
        </section>
      </CardContent>
    </Card>
  );
};

const UnsavedOption = ({
  option,
  options,
  setOptions,
  variants,
  setVariants,
  media,
}: {
  option: OptionType;
  options: OptionType[];
  setOptions: React.Dispatch<React.SetStateAction<OptionType[]>>;
  variants: any;
  setVariants: React.Dispatch<React.SetStateAction<VariantType[]>>;
  media: MediaItemType[];
}) => {
  const items = useMemo(
    () =>
      option.values.map((value) => ({
        label: value,
        value: valueSlugify(value),
      })),
    [option.values],
  );

  const selectedItemValues = useMemo(() => option.values.map((value) => valueSlugify(value)), [option.values]);

  const deleteOption = () => {
    // const formattedOptions = [...options];
    // const filteredOptions = formattedOptions.filter((filteredOption) => filteredOption.id !== option.id);
    // setOptions(filteredOptions);

    setOptions((prevOptions) => {
      const updatedOptions = prevOptions.filter((item) => {
        return item.id !== option.id;
      });
      setVariants((prevVariants) => {
        const nextVariants = generateVariants(updatedOptions, prevVariants, media);
        if (nextVariants.length) return nextVariants
        return [DEFAULT_VARIANT]
      });

      return updatedOptions;
    });
  };

  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [result, setResult] = useState<ValidationResult>();
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

  const getDuplicateNameError = () => {
    const duplicateName = options.some(
      (item) => item.id !== option.id && item.name.trim().toLowerCase() === option.name.trim().toLowerCase(),
    );

    if (!duplicateName) return null;
    return "An option with this name already exists";
  };

  const addOption = () => {
    const { isSaved, ...rest } = option;
    const { error } = validateAddOption(rest);
    if (error) {
      setWasSubmitted(true);
      return;
    }

    const duplicateName = getDuplicateNameError();
    if (duplicateName) {
      setErrorMessages({ name: duplicateName });
      return;
    }
    setOptions((prevOptions) => {
      const updatedOptions = prevOptions.map((item) => {
        return item.id === option.id ? { ...item, isSaved: true } : item;
      });
      setVariants((prevVariants) => generateVariants(updatedOptions, prevVariants, media));

      return updatedOptions;
    });
  };

  useEffect(() => {
    const { isSaved, ...rest } = option;
    setResult(validateAddOption(rest));
  }, [option]);

  useEffect(() => {
    if (!wasSubmitted) return;

    const errors: Record<string, string> = {};
    result?.error?.details.forEach((item) => {
      const key = String(item.path[0]);
      if (errors[key]) return;
      errors[key] = item.message;
    });

    const duplicateName = getDuplicateNameError();
    if (duplicateName) errors.name = duplicateName;

    setErrorMessages(errors);
  }, [result, wasSubmitted]);

  return (
    <div className="p-5 border-b">
      <InputDemo
        label="Option name"
        name="name"
        placeholder="Size"
        type="text"
        onChange={(e) => {
          setOptions((prev) => {
            return prev.map((item) => {
              return item.id === option.id ? { ...item, name: e.target.value } : item;
            });
          });
        }}
        className="mb-5"
        labelClassName="text-xs text-black/70"
        value={option.name}
        errorMessage={errorMessages.name}
        inputClassName={errorMessages.name ? "is-invalid" : "is-valid"}
      />

      <ComboboxMultiple
        items={items}
        value={selectedItemValues}
        label="Option values"
        placeholder="Add another value"
        className="mb-5"
        labelClassName="text-xs text-black/70"
        onChange={({ values, items }) => {
          setOptions((prevOptions) => {
            const updatedOptions = prevOptions.map((item) =>
              item.id === option.id
                ? {
                    ...item,
                    values: items.filter((i) => values.includes(i.value)).map((i) => i.label),
                  }
                : item,
            );

            return updatedOptions;
          });
        }}
        editable={true}
        // allowSearch={false}
        // side="right"
        // align="start"
        errorMessage={errorMessages.values}
      />
      <div className="flex gap-2 justify-between" onClick={(e) => e.preventDefault()}>
        <ButtonDemo text="Delete" variant="outlineDanger" size="xs" onClick={deleteOption} />
        <ButtonDemo text="Done" variant="dark" size="xs" className="hover:bg-black/80" onClick={addOption} />
      </div>
    </div>
  );
};

const SavedOption = ({
  option,
  options,
  setOptions,
}: {
  option: OptionType;
  options: OptionType[];
  setOptions: React.Dispatch<React.SetStateAction<OptionType[]>>;
}) => {
  const removeOption = () => {
    setOptions((prev) =>
      prev.map((item) =>
        item.id === option.id
          ? {
              ...item,
              // id: item.id,
              // name: "",
              // values: [],
              isSaved: false,
            }
          : item,
      ),
    );
  };

  return (
    <div className="p-5 border-b hover:bg-black/3 cursor-pointer" onClick={removeOption}>
      <div className="mb-1">{option.name}</div>
      <div className="flex flex-wrap gap-1">
        {option.values.map((value, index) => {
          return (
            <div className="bg-black/10 px-2 py-1 rounded text-xs" key={index}>
              {value}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VariantsSection;

export const validateAddOption = (obj: Omit<OptionType, "isSaved">): ValidationResult<Omit<OptionType, "isSaved">> => {
  const createProduct = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().trim().min(2).required(),
    values: Joi.array().items(Joi.string().trim().min(1)).unique().min(1).required(),
  }).options({ abortEarly: false });

  return createProduct.validate(obj);
};
