"use client";

import React, { useEffect, useState } from "react";
import { ButtonDemo } from "@/components/index";
import Link from "next/link";
import LOCAL_DATA from "@/conststants/localData";
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
    <section className="min-h-screen flex items-center">
      <div className="container text-center">
        <h1 className="text-6xl mb-8 text-green-700 uppercase">SUCCESS</h1>
        <br />
        <img src={successImage} className="w-full max-w-30 mx-auto mb-12" />
      </div>
    </section>
  );
};

export default Template;
