"use client";

import React from "react";

const Template = () => {
  return (
    <main className="home-page pt-[150px] min-h-[100vh]">
      <ShowcaseSection />
    </main>
  );
};


const ShowcaseSection = () => {
  return (
    <section>
      <div className="container">
        <h2 className="text-2xl mb-[1rem]">About Us</h2>
        <p className="text-gray-500">
          At [Your Company Name], we are committed to delivering innovative solutions that simplify your life and empower your
          business. With a focus on quality, reliability, and customer satisfaction, we strive to exceed expectations and build
          lasting relationships with our clients.
        </p>
      </div>
    </section>
  );
};

export default Template;
