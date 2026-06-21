import React, { useEffect, useState, useMemo } from "react";
import { SelectDemo, ComboboxPopup, ComboboxMultiple, InputDemo } from "@/components/index";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORIES } from "@/constants";
import type { SeoType, BasicInfoType } from "@/modules/products/types";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/utils/formatters";
import { Pencil } from "lucide-react";
import type { SelectItemPopupType } from "@/components/comboboxes/ComboboxPopup";
import { valueSlugify } from "@/components/comboboxes/ComboboxMultiple";

const OrganizationSection = ({
  organization,
  setOrganization = () => {},
}: {
  organization: { [key: string]: any };
  setOrganization: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
}) => {
  const [fetchedItems, setFetchedItems] = useState([
    { label: "fjkd", value: "fjkd" },
    { label: "ddd", value: "ddd" },
  ]);
  const [selectedItemPopup, setSelectedItemPopup] = useState<SelectItemPopupType | null>(null);

  const collections = useMemo(
    () =>
      ["Featured", "Trending", ...organization.collections]
        .filter((value, index, arr) => arr.findIndex((v) => valueSlugify(v) === valueSlugify(value)) === index)
        .map((value: string) => ({
          label: value,
          value: valueSlugify(value),
        })),
    [organization.collections],
  );

  const selectedCollectionValues = useMemo(
    () => organization.collections.map((value: string) => valueSlugify(value)),
    [organization.collections],
  );

  const tags = useMemo(
    () =>
      [...organization.tags]
        .filter((value, index, arr) => arr.findIndex((v) => valueSlugify(v) === valueSlugify(value)) === index)
        .map((value: string) => ({
          label: value,
          value: valueSlugify(value),
        })),
    [organization.tags],
  );

  const selectedTagValues = useMemo(
    () => organization.tags.map((value: string) => valueSlugify(value)),
    [organization.tags],
  );

  return (
    <Card className="mb-5">
      <CardContent className="">
        <section className="organization-section">
          <h4 className={`text-[13px] tracking-wide text-black/80 mb-3`}>Product Organization</h4>

          <InputDemo
            label="Brand"
            name="brand"
            placeholder="None"
            type="text"
            onChange={(e) => {
              setOrganization((prevOrg) => {
                return {
                  ...prevOrg,
                  brand: e.target.value,
                };
              });
            }}
            className="mb-5"
            labelClassName="text-xs text-black/70"
            value={organization.brand}
            // errorMessage={errorMessages.name}
            // inputClassName={errorMessages.name ? "is-invalid" : "is-valid"}
          />

          <ComboboxMultiple
            items={collections}
            value={selectedCollectionValues}
            label="Collections"
            placeholder="Add collections"
            className="mb-5"
            labelClassName="text-xs text-black/70"
            onChange={({ values, items }) => {
              setOrganization((prevOrg) => {
                return {
                  ...prevOrg,
                  collections: items.filter((i) => values.includes(i.value)).map((i) => i.label),
                };
              });
            }}
            editable={true}
            // allowSearch={false}
            // side="right"
            // align="start"
            // errorMessage={errorMessages.values}
          />

          <ComboboxMultiple
            items={tags}
            value={selectedTagValues}
            label="Tags"
            placeholder="Add tag"
            className="mb-5"
            labelClassName="text-xs text-black/70"
            onChange={({ values, items }) => {
              setOrganization((prevOrg) => {
                return {
                  ...prevOrg,
                  tags: items.filter((i) => values.includes(i.value)).map((i) => i.label),
                };
              });
            }}
            editable={true}
            // allowSearch={false}
            // side="right"
            // align="start"
            // errorMessage={errorMessages.values}
          />
        </section>
      </CardContent>
    </Card>
  );
};

export default OrganizationSection;
