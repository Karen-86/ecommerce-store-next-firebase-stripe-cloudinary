"use client";

import React, { useEffect, useState, useRef } from "react";
import {  ButtonDemo, GuideBanner, SubscribeBanner } from "@/components/index.js";
import Image from "next/image";
import LOCAL_DATA from "@/constants/localData";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import FeaturesSection from "./sections/FeaturesSection";
import TrendingsSection from "./sections/TrendingsSection";

const { exampleSVGImage } = LOCAL_DATA.images;

const Template = () => {
  return (
    <main className="home-page">
      <HeroSection />
      <FeaturesSection />
      {/* <div className="container">
        <hr className="border-primary/10 my-10" />
      </div> */}
      <div className="container">
        <GuideBanner/>
      </div>
      <TrendingsSection />
      <div className="container">
        <hr className="border-primary/10" />
      </div>
      <div className="container">
        <SubscribeBanner/>
      </div>
    </main>
  );
};

const HeroSection = () => {
  const [inView, setIsInView] = useState(false);

  return (
    <section className="hero pt-30! md:pt-19! flex md:min-h-screen bg-primary/5">
      <motion.div
        onViewportEnter={() => setIsInView(true)}
        viewport={{ amount: 0.7 }}
        className={`${inView ? "lazy-animate" : ""}  overflow-hidden container flex flex-1 flex-col md:flex-row gap-10 items-center justify-between`}
        data-lazy="fade"
      >
        <div className="hero-content max-w-[500px] text-center md:text-left">
          <h5 className="hero-sup mb-1 md:mb-4 text-secondary-v2 font-normal! text-xs uppercase">Explore top deals</h5>
          <h1 className="hero-title text-2xl md:text-6xl  mb-4 md:mb-8 md:leading-14">A Catalog of New Collections</h1>
          <h2 className="hero-description font-normal! font-poppins! text-secondary mb-6 md:mb-8">
            Browse our curated catalog featuring the latest arrivals in modern fashion. From everyday essentials to
            statement pieces.
          </h2>
          <Link href="/shop">
            <ButtonDemo className="rounded-full" variant="dark" size="xl" text="Shop Now" endIcon={<ArrowRight />} />
          </Link>
        </div>
        <div className="w-full max-w-[450px]">
          <div className="pt-[100%] w-full h-0 ml-auto relative">
            <Image
              src={exampleSVGImage}
              fill
              alt="image"
              priority
              sizes="100vw, (min-width: 768px) 50vw"
              className="object-contain"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Template;
