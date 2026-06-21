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
import type { GalleryImage} from "@/modules/gallery-images/types";

type GalleryImageWithCheckmark = GalleryImage & {
  isInMedia: boolean
}

const { placeholderImage, productImage } = LOCAL_DATA.images;

export default function MediaImagesDialog({ trigger, media, setMedia = () => {} }: any) {
  return (
    <DialogDemo
      title="Select file"
      contentClassName="sm:max-w-[980px]! "
      trigger={trigger || <ButtonDemo text="Open dialog" />}
    >
      {(closeDialog) => <MediaImagesDialogContent {...{ media, setMedia }} closeDialog={closeDialog} />}
    </DialogDemo>
  );
}

const MediaImagesDialogContent = ({ closeDialog = () => {}, media, setMedia = () => {} }: any) => {
  const galleryImages = useGalleryImagesStore((s) => s.galleryImages);
  const isGalleryImagesCreating = useGalleryImagesStore((s) => s.isGalleryImagesCreating);
  const isGalleryImagesLoading = useGalleryImagesStore((s) => s.isGalleryImagesLoading);

  const passedInputRef = useRef<HTMLInputElement>(null);

  const [galleryImagesWithCheckmark, setGalleryImagesWithCheckmark] = useState<GalleryImageWithCheckmark[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [newUploadedImages, setNewUploadedImages] = useState([]);

  useEffect(() => {
    const updatedImages = galleryImages.map((galleryImage) => {
      const isChecked = selectedIds.includes(galleryImage.id);
      const isInMedia = media.some((m: MediaItemType) => m.id === galleryImage.id);
      const isNewUploaded = newUploadedImages.some((img: GalleryImageWithCheckmark) => img.id === galleryImage.id);

      return {
        ...galleryImage,
        isInMedia: isChecked || isInMedia || isNewUploaded,
      };
    });

    setGalleryImagesWithCheckmark(updatedImages);
  }, [galleryImages, media, newUploadedImages]);

  // const galleryImagesWithCheckmark = useMemo(() => {
  //   return galleryImages.map((galleryImage) => {
  //     const isChecked = selectedIds.includes(galleryImage.id);
  //     const isInMedia = media.some((m: MediaItemType) => m.id === galleryImage.id);
  //     const isNewUploaded = newUploadedImages.some((img: GalleryImageWithCheckmark) => img.id === galleryImage.id);

  //     return {
  //       ...galleryImage,
  //       isInMedia: isChecked || isInMedia || isNewUploaded,
  //     };
  //   });
  // }, [galleryImages, media, newUploadedImages, selectedIds]);

  const handleSubmit = () => {
    const newMedia = galleryImagesWithCheckmark
      .filter((item) => item.isInMedia)
      .map((item) => ({ id: item.id, url: item.url }));

    setMedia(newMedia);
  };

  return (
    <div className="upload-products-dialog h-full flex flex-col">
      <div className="flex-1  overflow-auto max-h-[80vh] min-h-[80vh]">
        <div className={`${!galleryImages.length ? "hidden" : ""}`}>
          <UploadImages
            passedInputRef={passedInputRef}
            isLinkHidden={false}
            {...{
              successCB: (data: any) => {
                setNewUploadedImages(data.data.images);
              },
            }}
          />
        </div>
        {galleryImages.length || isGalleryImagesCreating || isGalleryImagesLoading ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
            {!galleryImages.length && isGalleryImagesCreating && (
              <div
                className={`p-3 hover:bg-black/4 rounded-md ${isGalleryImagesCreating ? "animate-pulse bg-black/5 opacity-70 pointer-events-none" : ""}`}
              >
                <div className=" m-2 border p-1 shadow-sm rounded-md bg-white">
                  <div className="relative pt-[100%] bg-black/5 rounded-sm">
                    <img src={productImage} alt="" className="absolute top-0 left-0 w-full h-full object-contain" />
                  </div>
                </div>
              </div>
            )}
            {galleryImagesWithCheckmark.map((image) => {
              return (
                <label
                  key={image.id}
                  className={`p-3 hover:bg-black/4 ${image.isInMedia ? "bg-black/4" : ""} rounded-md ${isGalleryImagesCreating || isGalleryImagesLoading ? "animate-pulse bg-black/5 opacity-70 pointer-events-none" : ""}`}
                >
                  <div className=" m-2 border p-1 shadow-sm rounded-md bg-white relative">
                    <CheckboxDemo
                      variant="dark"
                      className="absolute z-1 top-2 left-2"
                      id={image.id}
                      checked={image.isInMedia}
                      onCheckedChange={(checked) => {
                        let tempImages: GalleryImageWithCheckmark[] = [...galleryImagesWithCheckmark];

                        tempImages = tempImages.map((item) => {
                          if (item.id !== image.id) return item;
                          return {
                            ...item,
                            isInMedia: checked ? true : false,
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
        ) : (
          <div className="flex flex-col items-center pt-15">
            <img src={placeholderImage} alt="" className="w-40 h-40 object-cover mb-10 rounded-full" />
            <h4 className="mb-3 text-black/80">No files yet</h4>
            <div className="max-w-[380px] text-secondary-v4 mb-5">
              Upload files to get started. Any files you upload can be reused in other areas
            </div>
            <ButtonDemo
              className="hover:bg-black/80"
              variant="dark"
              size="xs"
              onClick={() => passedInputRef.current?.click()}
            >
              Upload image
            </ButtonDemo>
            {/* <div className="hidden">
              <UploadImages passedInputRef={passedInputRef} />
            </div> */}
          </div>
        )}
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
