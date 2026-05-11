"use client";

import React, { useEffect, useState } from "react";
import { ButtonDemo } from "@/components/index";
import Link from "next/link";
import LOCAL_DATA from "@/constants/localData";
import { ChevronLeft } from "lucide-react";

const { successImage } = LOCAL_DATA.images;

const Template = () => {
  return (
    <main className="home-page">
      <HeroSection />
    </main>
  );
};

const HeroSection = () => {
  return (
    <section className="min-h-screen pt-40!">
      <div className="container text-center">
          <img src={successImage} className="w-full h-full max-w-20 mx-auto mb-7" />
        <h2 className="text-3xl sm:text-4xl mb-5">SUCCESS</h2>
      </div>
    </section>
  );
};

export default Template;
