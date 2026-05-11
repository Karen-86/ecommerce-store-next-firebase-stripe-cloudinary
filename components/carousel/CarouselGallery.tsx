"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import GalleryCard from "@/app/(site)/products/gallery-card/GalleryCard";
import LOCAL_DATA from "@/constants/localData";

const { exampleImage, productImage } = LOCAL_DATA.images;

const CarouselGallery = ({ items = [] }: { items: any[] }) => {
  const [mainApi, setMainApi] = useState<CarouselApi | null>(null);
  const [thumbApi, setThumbApi] = useState<CarouselApi | null>(null);

  // Sync main → thumbs
  useEffect(() => {
    if (!mainApi || !thumbApi) return;

    const onSelect = () => {
      const index = mainApi.selectedScrollSnap();
      thumbApi.scrollTo(index);
    };

    mainApi.on("select", onSelect);

    return () => {
      mainApi.off("select", onSelect);
    };
  }, [mainApi, thumbApi]);

  // Sync thumbs → main (click support)
  const handleThumbClick = (index: number) => {
    if (!mainApi) return;
    mainApi.scrollTo(index);
  };

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!mainApi) return;

    const onSelect = () => {
      setActiveIndex(mainApi.selectedScrollSnap());
    };

    mainApi.on("select", onSelect);
    onSelect();

    return () => {
      mainApi.off("select", onSelect);
    };
  }, [mainApi]);

  return (
    <div className="">
      {/* MAIN CAROUSEL */}
      <Carousel
        setApi={setMainApi}
        className={`hover:[&_.carousel-angles]:opacity-100 mb-[20px] border border-primary/10 rounded-xl duration-300 overflow-hidden  hover:[&_img]:scale-105 hover:border-primary/20 hover:shadow-[0_0_10px_rgba(0,0,0,0.05)]`}
        opts={{
          align: "start",
          loop: true,
        }}
        orientation={"horizontal"}
        //   plugins={ [Autoplay({ delay: 2000 })]}
      >
        <CarouselContent className={` `}>
          {items.map((item: any, index: number) => (
            <CarouselItem key={index} className={` `}>
              <div className="details-image relative pt-[100%] h-0 w-full">
                <img
                  src={item.url || exampleImage}
                  alt=""
                  onError={(e)=>e.currentTarget.src = productImage}
                  className="rounded-xl block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] object-cover  duration-600"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <div className="opacity-0 duration-300 carousel-angles absolute md:static left-[50%] md:left-[none] translate-x-[-50%] md:translate-x-[none] bottom-[-30px] md:bottom-[none]">
          <CarouselPrevious
            className="cursor-pointer disabled:hidden md:left-0 md:translate-x-[15px] bg-white/70"
            size="icon-lg"
          />
          <CarouselNext
            className="cursor-pointer disabled:hidden md:right-0 md:translate-x-[-15px] bg-white/70"
            size="icon-lg"
          />
        </div>
      </Carousel>

      {/* THUMBNAIL CAROUSEL */}
      <Carousel
        setApi={setThumbApi}
        className={``}
        opts={{
          align: "start",
          loop: false,
        }}
        orientation={"horizontal"}
        //   plugins={ [Autoplay({ delay: 2000 })]}
      >
        <CarouselContent className={`-ml-1 `}>
          {items.map((item: any, index: number) => (
            <CarouselItem key={index} className={`-pl-4 basis-auto shrink-0 `} onClick={() => handleThumbClick(index)}>
              <div className="p-1">
                <GalleryCard key={index} image={item.url} active={index === activeIndex} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <div className="carousel-angles absolute md:static left-[50%] md:left-[none] translate-x-[-50%] md:translate-x-[none] bottom-[-30px] md:bottom-[none]">
          <CarouselPrevious
            className="cursor-pointer disabled:hidden md:left-0 md:translate-x-[5px] bg-white/70"
            size="icon"
          />
          <CarouselNext
            className="cursor-pointer disabled:hidden md:right-0 md:translate-x-[-5px] bg-white/70"
            size="icon"
          />
        </div>
      </Carousel>
    </div>
  );
};

export default CarouselGallery;
