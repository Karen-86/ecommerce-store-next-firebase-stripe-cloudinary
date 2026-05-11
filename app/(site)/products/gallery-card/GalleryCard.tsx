import React from "react";
import type { ProductWithCart } from "@/modules/products/types";
import LOCAL_DATA from "@/constants/localData";

const { productImage } = LOCAL_DATA.images;

const GalleryCard = ({ image, active }: { image: string; active: boolean }) => {
  return (
    <div
      className={`
        rounded-lg border border-primary/20 transition-all duration-200 cursor-pointer overflow-hidden
        ${active ? " border-primary/50 shadow-[0_0_10px_rgba(0,0,0,0.05)] " : "  opacity-70 hover:opacity-100 "}
      `}
    >
      <img
        src={image}
        alt=""
        onError={(e) => (e.currentTarget.src = productImage)}
        className="w-25 h-27  object-cover "
      />
    </div>
  );
};

export default GalleryCard;
