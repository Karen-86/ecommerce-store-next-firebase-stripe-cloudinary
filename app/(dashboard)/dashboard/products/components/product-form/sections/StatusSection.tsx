import React, { useEffect, useState } from "react";
import { SelectDemo } from "@/components/index";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORIES } from "@/constants";
import type { SeoType, BasicInfoType } from "@/modules/products/types";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/utils/formatters";
import { Pencil } from "lucide-react";

const StatusSection = ({
  status,
  setStatus = () => {},
  basicInfo,
}: {
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  basicInfo: BasicInfoType;
}) => {
  const options = [
    { label: "Active", value: "active" },
    { label: "Draft", value: "draft" },
    { label: "Unlisted", value: "ulisted" },
  ];

  return (
    <Card className="mb-5">
      <CardContent className="">
        <section className="status-section">
          <h4 className={`text-[13px] tracking-wide text-black/80 mb-1`}>Status</h4>

          <SelectDemo
            triggerClassName=""
            contentClassName=""
            value={status}
            items={options}
            onChange={(item: any) => {
              setStatus(item.value.toString());
            }}
          />
        </section>
      </CardContent>
    </Card>
  );
};

export default StatusSection;
