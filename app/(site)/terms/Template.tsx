"use client";

import React from "react";
import { BreadcrumbDemo } from "@/components/index";
import { Card, CardContent } from "@/components/ui/card";

const Template = () => {
  const breadcrumbItems = [{ href: "/", label: "Home" }, { label: "Terms & Conditions" }];

  return (
    <main className="terms-page pt-25  min-h-screen">
      <div className="container ">
        <BreadcrumbDemo items={breadcrumbItems} />
      </div>
      <ShowcaseSection />
    </main>
  );
};

const ShowcaseSection = () => {
  return (
    <section className="">
      <div className="container max-w-[900px]!">
        <h2 className="text-3xl mb-7 text-center">Terms & Conditions</h2>
        <Card className="">
          <CardContent className="px-8 py-8">
            <h2 className="text-xl mb-4 text-primary">Introduction</h2>
            <p className="text-secondary-v4 leading-[1.7] text-[15px] font-light mb-6">
              These Terms and Conditions govern your use of our website and services. By accessing or using our website,
              you agree to be bound by these terms.
            </p>

            <h2 className="text-xl mb-4 text-primary">Use of Our Services</h2>
            <ul className="text-secondary-v4 leading-[1.7] text-[15px] font-light mb-6 list-disc pl-6">
              <li>You must be at least 13 years old to use our services</li>
              <li>You agree not to use our services for any illegal or unauthorized purpose</li>
              <li>You agree not to interfere with or disrupt our website or systems</li>
            </ul>

            <h2 className="text-xl mb-4 text-primary">Accounts</h2>
            <p className="text-secondary-v4 leading-[1.7] text-[15px] font-light mb-6">
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept
              responsibility for all activities that occur under your account.
            </p>

            <h2 className="text-xl mb-4 text-primary">Orders and Payments</h2>
            <p className="text-secondary-v4 leading-[1.7] text-[15px] font-light mb-6">
              We reserve the right to refuse or cancel any order. Prices and availability of products are subject to
              change without notice. Payments are processed securely through third-party providers.
            </p>

            <h2 className="text-xl mb-4 text-primary">Shipping and Delivery</h2>
            <p className="text-secondary-v4 leading-[1.7] text-[15px] font-light mb-6">
              Delivery times are estimates and may vary depending on location and external factors. We are not
              responsible for delays caused by shipping carriers.
            </p>

            <h2 className="text-xl mb-4 text-primary">Returns and Refunds</h2>
            <p className="text-secondary-v4 leading-[1.7] text-[15px] font-light mb-6">
              Refunds and returns are subject to our return policy. Certain items may not be eligible for return due to
              hygiene or customization reasons.
            </p>

            <h2 className="text-xl mb-4 text-primary">Intellectual Property</h2>
            <p className="text-secondary-v4 leading-[1.7] text-[15px] font-light mb-6">
              All content, logos, and materials on this website are owned by or licensed to us and may not be used
              without permission.
            </p>

            <h2 className="text-xl mb-4 text-primary">Limitation of Liability</h2>
            <p className="text-secondary-v4 leading-[1.7] text-[15px] font-light mb-6">
              We are not liable for any indirect, incidental, or consequential damages arising from your use of our
              services.
            </p>

            <h2 className="text-xl mb-4 text-primary">Third-Party Services</h2>
            <p className="text-secondary-v4 leading-[1.7] text-[15px] font-light mb-6">
              We may use third-party services such as payment processors and analytics tools. We are not responsible for
              their actions or policies.
            </p>

            <h2 className="text-xl mb-4 text-primary">Termination</h2>
            <p className="text-secondary-v4 leading-[1.7] text-[15px] font-light mb-6">
              We reserve the right to suspend or terminate access to our services if you violate these Terms and
              Conditions.
            </p>

            <h2 className="text-xl mb-4 text-primary">Changes to Terms</h2>
            <p className="text-secondary-v4 leading-[1.7] text-[15px] font-light mb-6">
              We may update these Terms at any time. Continued use of the website means you accept the updated terms.
            </p>

            <h2 className="text-xl mb-4 text-primary">Contact Us</h2>
            <p className="text-secondary-v4 leading-[1.7] text-[15px] font-light mb-6">
              If you have any questions about these Terms, contact us at support@yourdomain.com.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Template;
