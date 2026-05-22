"use client";

import React from "react";
import { BreadcrumbDemo } from "@/components/index";

const Template = () => {
  const breadcrumbItems = [{ href: "/", label: "Home" }, { label: "Contact Us" }];

  return (
    <main className="contact-page pt-25  min-h-screen">
      <div className="container ">
        <BreadcrumbDemo items={breadcrumbItems} />
      </div>
      <ShowcaseSection />
    </main>
  );
};

const ShowcaseSection = () => {
  return (
    <section className="pt-7!">
      <div className="container">
        <h2 className="text-3xl mb-[1rem]">Contact Us</h2>
        <p className="text-gray-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, provident delectus distinctio temporibus ut ab
          in fugit sint excepturi officia.
        </p>
      </div>
    </section>
  );
};

export default Template;
