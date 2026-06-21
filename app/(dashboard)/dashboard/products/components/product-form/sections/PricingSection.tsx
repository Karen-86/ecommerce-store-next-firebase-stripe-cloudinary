import React from "react";
import { InputDemo, TextareaDemo, ComboboxDemo } from "@/components/index";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORIES } from "@/constants";
import { formatNumberWithCurrency } from "@/lib/utils/formatters";
import type { OptionType, VariantType } from "@/modules/products/types";

const BasicInfoSection = ({
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
          [e.target.name]: e.target.value,
        },
      ];
    });
  };

  const onBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVariants((prev) => {
      return [
        {
          ...prev[0],
          [e.target.name]: e.target.value ? formatNumberWithCurrency(e.target.value) : '',
        },
      ];
    });
  };

  return (
    <Card className="mb-5">
      <CardContent>
        <section className="basic-info-section">
          <InputDemo
            label="Price"
            name="price"
            placeholder="0.00"
            type="text"
            onChange={onChange}
            className="mb-5"
            labelClassName="text-xs text-black/70"
            value={variants[0].price || ''}
            onBlur={onBlur}
          />
          <InputDemo
            label="Compare-at price"
            name="compareAtPrice"
            placeholder="0.00"
            type="text"
            onChange={onChange}
            className="mb-5"
            labelClassName="text-xs text-black/70"
            value={variants[0].compareAtPrice || ''}
            onBlur={onBlur}
          />
        </section>
      </CardContent>
    </Card>
  );
};

export default BasicInfoSection;
