import React, { useState, useEffect, useMemo } from "react";
import { InputDemo, TextareaDemo, ComboboxDemo } from "@/components/index";
import UploadImages from "../../UploadImages";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORIES } from "@/constants";
import type { BasicInfoType, MediaItemType } from "@/modules/products/types";
// import type { GalleryImageWithMedia } from "@/modules/gallery-images/types";
import { LOCAL_DATA } from "@/constants";
import { Label } from "@/components/ui/label";
import MediaImagesDialog from "../../dialogs/media-images-dialog/MediaImagesDialog";
import { Plus } from "lucide-react";
import { useAuthStore } from "@/modules/auth/store";
import { useGalleryImagesStore } from "@/modules/gallery-images/store";

const { productImage } = LOCAL_DATA.images;

const BasicInfoSection = ({
  basicInfo,
  setBasicInfo = () => {},
  media,
  setMedia = () => {},
  errorMessages,
}: {
  basicInfo: BasicInfoType;
  setBasicInfo: React.Dispatch<React.SetStateAction<BasicInfoType>>;
  media: MediaItemType[];
  setMedia: React.Dispatch<React.SetStateAction<MediaItemType[]>>;
  errorMessages: { [key: string]: any };
}) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setBasicInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const authUser = useAuthStore((s) => s.authUser);
  const getGalleryImagesAsync = useGalleryImagesStore((s) => s.getGalleryImagesAsync);
  const isGalleryImagesCreating = useGalleryImagesStore((s) => s.isGalleryImagesCreating);
  const isGalleryImagesLoading = useGalleryImagesStore((s) => s.isGalleryImagesLoading);

  useEffect(() => {
    // auth still loading
    if (authUser === undefined) return;

    getGalleryImagesAsync();
  }, [authUser]);



  return (
    <Card className="mb-5">
      <CardContent>
        <section className="basic-info-section">
          <InputDemo
            label="Title"
            name="title"
            placeholder="Short sleeve t-shirt"
            type="text"
            onChange={onChange}
            className="mb-5"
            labelClassName="text-xs text-black/70"
            value={basicInfo.title}
            errorMessage={errorMessages.title}
            inputClassName={errorMessages.title ? "is-invalid" : "is-valid"}
          />

          <TextareaDemo
            label="Description"
            name="description"
            placeholder="Describe your product"
            type="text"
            value={basicInfo.description}
            onChange={onChange}
            className="mb-5"
            labelClassName="text-xs text-black/70"
            errorMessage={errorMessages.description}
            inputClassName={errorMessages.description ? "is-invalid" : "is-valid"}
          />

          <div className="grid items-center gap-1.5 mb-5">
            <Label className="text-xs text-black/70">Media</Label>
            {!media.length ? (
              <div
                className={`${isGalleryImagesCreating || isGalleryImagesLoading ? "animate-pulse opacity-30 pointer-events-none" : ""}`}
              >
                <UploadImages
                  {...{
                    media,
                    setMedia,
                    successCB: (data: any) => {
                      const uploadedImages = data.data.images.map((item: MediaItemType) => ({ id: item.id, url: item.url }))
                      setMedia(uploadedImages);
                    },
                  }}
                />
              </div>
            ) : (
              <Media {...{ media, setMedia }} />
            )}
          </div>

          <ComboboxDemo
            items={CATEGORIES}
            value={basicInfo.category}
            label="Category"
            placeholder="Choose a product category"
            onChange={(item) => {
              setBasicInfo((prev) => ({
                ...prev,
                category: item.value.toString(),
              }));
            }}
            className=""
            labelClassName="text-xs text-black/70"
            triggerClassName={`custom-trigger`}
            contentClassName={`custom-content`}
            errorMessage={errorMessages.category}
          />
        </section>
      </CardContent>
    </Card>
  );
};

const Media = ({
  media,
  setMedia = () => {},
}: {
  media: MediaItemType[];
  setMedia: React.Dispatch<React.SetStateAction<MediaItemType[]>>;
}) => {
  return (
    <div className="media grid grid-cols-3 sm:grid-cols-6 gap-1.5">
      {media.map((mediaItem, index) => {
        return (
          <div
            key={mediaItem.id}
            className={` ${index === 0 ? "col-span-2 row-span-2" : ""} relative border dark-border-field rounded-md overflow-hidden`}
          >
            <div className=" w-full pt-[100%]">
              <img
                className="absolute top-0 left-0 w-full h-full object-contain"
                src={mediaItem.url || productImage}
                alt={""}
              />
            </div>
          </div>
        );
      })}
      <MediaImagesDialog
        {...{ media, setMedia }}
        trigger={
          <div className=" w-full pt-[100%] border border-dashed rounded-md relative bg-black/3 hover:bg-black/5 cursor-pointer dark-border-field">
            <Plus className="w-4 absolute top-[50%] left-[50%] transform-[translate(-50%,-50%)]" />
          </div>
        }
      />
    </div>
  );
};

export default BasicInfoSection;
