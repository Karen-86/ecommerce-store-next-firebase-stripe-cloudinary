"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { DialogDemo, ButtonDemo, InputDemo, CheckboxDemo } from "@/components/index";
import { useGalleryImagesStore } from "@/modules/gallery-images/store";
import { alert, errorAlert, warningAlert } from "@/lib/utils/alert";
import { FileJson } from "lucide-react";
import * as productsApi from "@/modules/products/api";
import UploadImages from "../../UploadImages";
import { LOCAL_DATA } from "@/constants";
import type { MediaItemType } from "@/modules/products/types";
import type { VariantType } from "@/modules/products/types";
import type { GalleryImage } from "@/modules/gallery-images/types";

type GalleryImageWithCheckmark = GalleryImage & {
  isInVariant: boolean;
};

const { placeholderImage, productImage } = LOCAL_DATA.images;

export default function VariantImagesDialog({ trigger, media, variant, setVariants = () => {} }: any) {
  return (
    <DialogDemo
      title="Select file"
      contentClassName="sm:max-w-[980px]! "
      trigger={trigger || <ButtonDemo text="Open dialog" />}
    >
      {(closeDialog) => <VariantImagesDialogContent {...{ media, variant, setVariants }} closeDialog={closeDialog} />}
    </DialogDemo>
  );
}

const VariantImagesDialogContent = ({ closeDialog = () => {}, media, variant, setVariants = () => {} }: any) => {
  const galleryImages = useGalleryImagesStore((s) => s.galleryImages);
  const isGalleryImagesCreating = useGalleryImagesStore((s) => s.isGalleryImagesCreating);
  const isGalleryImagesLoading = useGalleryImagesStore((s) => s.isGalleryImagesLoading);

  const [galleryImagesWithCheckmark, setGalleryImagesWithCheckmark] = useState<GalleryImageWithCheckmark[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [primaryImage, setPrimaryImage] = useState(variant.primaryImage);

  useEffect(() => {
    const images = galleryImages
      .filter((galleryItem) => media.some((mediaItem: MediaItemType) => galleryItem.id === mediaItem.id))
      .map((galleryImage) => {
        const isChecked = selectedIds.includes(galleryImage.id);
        const isInVariant = variant.images.some((value: string) => value === galleryImage.id);

        return {
          ...galleryImage,
          isInVariant: isChecked || isInVariant,
        };
      });
    setGalleryImagesWithCheckmark(images);
  }, [galleryImages, media]);

  const handleSubmit = () => {
    let updatedVariantImages = galleryImagesWithCheckmark
      .filter((item) => item.isInVariant && item.id !== primaryImage)
      .map((item) => {
        return item.id;
      });
    
    updatedVariantImages = [primaryImage, ...updatedVariantImages]

    setVariants((prevVariants: VariantType[]) => {
      return prevVariants.map((prevVariant) => {
        if (prevVariant.id !== variant.id) return prevVariant;

        return {
          ...prevVariant,
          images: updatedVariantImages,
          // primaryImage: updatedVariantImages[0]
          primaryImage: primaryImage,
        };
      });
    });
  };

  return (
    <div className="upload-products-dialog h-full flex flex-col">
      <div className="flex-1  overflow-auto max-h-[80vh] min-h-[80vh]">
        {/* {media.length && ( */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
          {galleryImagesWithCheckmark.map((image) => {
            return (
              <label
                onClick={(e) => e.stopPropagation()}
                key={image.id}
                className={`p-3 hover:bg-black/4 ${image.isInVariant ? "bg-black/4" : ""} rounded-md ${isGalleryImagesCreating || isGalleryImagesLoading ? "animate-pulse bg-black/5 opacity-70 pointer-events-none" : ""}`}
              >
                <div className=" m-2 border p-1 shadow-sm rounded-md bg-white relative">
                  <div className="absolute z-1 top-2 left-2 flex gap-1">
                    <CheckboxDemo
                      variant="dark"
                      onClick={(e) => image.id === primaryImage && e.preventDefault()}
                      title="select"
                      className={`${image.id === primaryImage ? "opacity-0 pointer-events-none!" : ""}`}
                      id={image.id}
                      checked={image.isInVariant}
                      onCheckedChange={(checked) => {
                        let tempImages: GalleryImageWithCheckmark[] = [...galleryImagesWithCheckmark];

                        tempImages = tempImages.map((item) => {
                          if (item.id !== image.id) return item;
                          return {
                            ...item,
                            isInVariant: checked ? true : false,
                          };
                        });

                        setGalleryImagesWithCheckmark(tempImages);

                        setSelectedIds((prev) => {
                          if (checked) {
                            return [...prev, image.id];
                          }
                          return prev.filter((id) => id !== image.id);
                        });
                      }}
                    />
                    <CheckboxDemo
                      variant="primary"
                      onClick={(e) => e.stopPropagation()}
                      title="set as primary"
                      className={`${!image.isInVariant ? "opacity-0 pointer-events-none!" : ""}`}
                      id={image.id}
                      checked={image.id === primaryImage}
                      onCheckedChange={(checked) => {
                        setPrimaryImage(image.id);
                      }}
                    />
                  </div>

                  <div className="relative pt-[100%] bg-black/5 rounded-sm">
                    <img src={image.url} alt="" className="absolute top-0 left-0 w-full h-full object-contain" />
                  </div>
                </div>
                <div className="text-black/80 truncate text-xs text-center">{image.name}</div>
                <div className="text-black/70 truncate text-xs text-center uppercase">{image.extension}</div>
              </label>
            );
          })}
        </div>
        {/* )} */}
      </div>

      <div className="button-group flex justify-end gap-2">
        <ButtonDemo
          className=""
          text="Cancel"
          variant="outline"
          type="button"
          onClick={() => {
            closeDialog();
          }}
        />

        <ButtonDemo
          className=" hover:bg-black/80"
          variant="dark"
          text={`Done`}
          disabled={!galleryImages.length}
          onClick={() => {
            handleSubmit();
            closeDialog();
          }}
        />
      </div>
    </div>
  );
};
