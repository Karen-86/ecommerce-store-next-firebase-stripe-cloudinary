"use client";

import React, { useState, useRef } from "react";
import { compressImage, convertToBase64 } from "@/lib/utils/imageUtils";
import { ButtonDemo } from "@/components/index";
import { useGalleryImagesStore } from "@/modules/gallery-images/store";
import { alert, errorAlert } from "@/lib/utils/alert";
import MediaImagesDialog from "./dialogs/media-images-dialog/MediaImagesDialog";

export default function UploadImages({
  passedInputRef,
  media,
  setMedia = () => {},
  isLinkHidden = true,
  successCB = () => {},
}: any) {
  const createGalleryImagesAsync = useGalleryImagesStore((s) => s.createGalleryImagesAsync);
  const isGalleryImagesCreating = useGalleryImagesStore((s) => s.isGalleryImagesCreating);
  const isGalleryImagesLoading = useGalleryImagesStore((s) => s.isGalleryImagesLoading);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const formData = new FormData();

    Array.from(e.target.files).forEach((file) => {
      formData.append("files", file);
    });

    const data = await createGalleryImagesAsync({ body: formData });
    if (!data.success) return errorAlert(data.message);

    successCB(data);
    alert(data.message || "gallery image(s) uploaded");
    e.target.value = "";
  };

  const localRef = useRef<HTMLInputElement>(null);
  const inputRef = passedInputRef ?? localRef;

  return (
    <div className="flex justify-center flex-col items-center border border-dashed border-black/40 px-4 py-7  rounded-md mb-3">
      <div className="flex gap-1 items-center mb-2">
        <ButtonDemo
          onClick={() => inputRef.current?.click()}
          className=""
          text="Upload new"
          size="xs"
          variant="light"
          type="button"
        />
        {isLinkHidden && (
          <MediaImagesDialog
            {...{ media, setMedia }}
            trigger={
              <ButtonDemo className="text-black/80" size="xs" variant="link" text="Select existing" type="button" />
            }
          />
        )}
      </div>
      <p className="text-xs text-secondary-v4">Accept images JPG, PNG, WEBP</p>

      <input multiple ref={inputRef} type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
    </div>
  );
}
