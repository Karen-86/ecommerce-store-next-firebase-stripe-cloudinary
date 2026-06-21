import React, { useEffect, useState } from "react";
import { InputDemo, TextareaDemo, ComboboxDemo, ButtonDemo } from "@/components/index";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORIES } from "@/constants";
import type { SeoType, BasicInfoType } from "@/modules/products/types";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/utils/formatters";
import { Pencil } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const SeoSection = ({
  setSeo = () => {},
  slug,
  setSlug = () => {},
  basicInfo,
}: {
  setSeo: React.Dispatch<React.SetStateAction<SeoType>>;
  slug: string;
  setSlug: React.Dispatch<React.SetStateAction<string>>;
  basicInfo: BasicInfoType;
}) => {
  const [isFormHidden, setIsFormHidden] = useState(true);

  const [localSeoTitle, setLocalSeoTitle] = useState("");
  const [localSeoDescription, setLocalSeoDescription] = useState("");

  const [localSlug, setLocalSlug] = useState("");

  const safeBasicTitle = basicInfo.title?.slice(0, 70);
  const safeBasicDescription = basicInfo.description?.slice(0, 160);
  const safeSlug = basicInfo.title?.slice(0, 80);

  const previewTitle = localSeoTitle.trim() || safeBasicTitle;
  const previewDescription = localSeoDescription?.trim() || safeBasicDescription;
  const previewSlug = localSlug.trim() || safeSlug;

  useEffect(() => {
    setSeo({
      title: localSeoTitle.trim() || safeBasicTitle,
      description: localSeoDescription.trim() || safeBasicDescription,
    });
  }, [localSeoTitle, localSeoDescription, basicInfo.title, basicInfo.description, setSeo]);

  useEffect(() => {
    setSlug(slugify(localSlug || basicInfo.title?.slice(0, 80) || ""));
  }, [localSlug, basicInfo.title, setSlug]);

  return (
    <Card className="mb-5 p-0">
      <CardContent className="p-0">
        <section className="seo-section">
          <div className="px-4 py-5 ">
            <div className="flex gap-2 justify-between">
              <h4 className={`text-[13px] tracking-wide text-black/80 mb-6`}>Search engine listing</h4>
              {isFormHidden && (
                <ButtonDemo
                  size="icon-sm"
                  icon={<Pencil />}
                  variant="ghostSecondary"
                  onClick={() => setIsFormHidden(false)}
                />
              )}
            </div>

            {!previewTitle && !previewDescription && !previewSlug ? (
              <p className="text-secondary-v4">Add a title and description to preview search appearance.</p>
            ) : (
              <>
                <p className="text-xs text-secondary-v4 mb-1 break-all">{` ${siteUrl}  › products › ${previewSlug}`}</p>
                <h4 className="text-primary text-lg font-medium! mb-1 break-all">{previewTitle}</h4>
                <p className="text-xs text-secondary-v4 break-all">{previewDescription}</p>
              </>
            )}
          </div>

          {!isFormHidden && (
            <div className="px-4 py-5 border-t">
              <InputDemo
                label="Page title"
                name="title"
                maxLength={70}
                type="text"
                onChange={(e) => setLocalSeoTitle(e.target.value)}
                className="mb-5"
                labelClassName="text-xs text-black/70"
                value={localSeoTitle}
                placeholder={safeBasicTitle}
                successMessage={`${localSeoTitle.length} of 70 characters used`}
              />

              <TextareaDemo
                label="Meta description"
                name="description"
                maxLength={160}
                type="text"
                value={localSeoDescription}
                placeholder={safeBasicDescription}
                onChange={(e) => setLocalSeoDescription(e.target.value)}
                className="mb-5"
                labelClassName="text-xs text-black/70"
                successMessage={`${localSeoDescription?.length} of 160 characters used`}
              />
              <InputDemo
                label="URL handle"
                name="localSlug"
                maxLength={80}
                type="text"
                onChange={(e) => setLocalSlug(e.target.value)}
                className="mb-5"
                labelClassName="text-xs text-black/70"
                placeholder={safeSlug}
                value={localSlug}
                successMessage={`${siteUrl}/products/${previewSlug}`}
              />
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  );
};

export default SeoSection;
