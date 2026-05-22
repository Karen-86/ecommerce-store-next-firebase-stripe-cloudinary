"use client";

import React from "react";
import { BreadcrumbDemo } from "@/components/index";
import { Card, CardContent } from "@/components/ui/card";

const Template = () => {
  const breadcrumbItems = [{ href: "/", label: "Home" }, { label: "Privacy Policy" }];

  return (
    <main className="privacy-page pt-25  min-h-screen">
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
        <h2 className="text-3xl mb-7 text-center">Privacy Policy</h2>
        <Card className="">
          <CardContent className="px-8 py-8">
            <h2 className="text-xl mb-4 text-primary">Introduction</h2>
            <p className="text-secondary-v4 leading-[1.7] text-[15px] font-light mb-6">
              At Your Company Name, we respect your privacy and are committed to protecting your personal information.
              This Privacy Policy explains how we collect, use, and safeguard your information when you visit our
              website or use our services.
            </p>

            <h2 className="text-xl mb-4 text-primary">Information We Collect</h2>
            <ul className="text-secondary-v4 leading-[1.7] text-[15px] font-light mb-6 list-disc pl-6">
              <li>Personal information such as name, email address, and phone number</li>
              <li>Billing and shipping address for order processing</li>
              <li>Account details if you create an account</li>
              <li>Payment-related information (processed securely via third-party providers)</li>
              <li>Device and usage data such as IP address, browser type, and pages visited</li>
            </ul>

            <h2 className="text-xl mb-4 text-primary">How We Use Your Information</h2>
            <ul className="text-secondary-v4 leading-[1.7] text-[15px] font-light mb-6 list-disc pl-6">
              <li>To process and fulfill orders</li>
              <li>To provide customer support and respond to inquiries</li>
              <li>To improve our website and services</li>
              <li>To send order confirmations and important updates</li>
              <li>To prevent fraud and ensure security</li>
            </ul>

            <h2 className="text-xl mb-4 text-primary">Payments</h2>
            <p className="text-secondary-v4 leading-[1.7] text-[15px] font-light mb-6">
              We use secure third-party payment processors (such as Stripe) to handle payments. We do not store full
              credit card details on our servers.
            </p>

            <h2 className="text-xl mb-4 text-primary">Cookies</h2>
            <p className="text-secondary-v4 leading-[1.7] text-[15px] font-light mb-6">
              We use cookies to improve your experience, remember preferences, and analyze website traffic. You can
              disable cookies in your browser settings, but some features may not work properly.
            </p>

            <h2 className="text-xl mb-4 text-primary">Data Sharing</h2>
            <p className="text-secondary-v4 leading-[1.7] text-[15px] font-light mb-6">
              We do not sell your personal data. We may share information with trusted third parties such as payment
              processors, hosting providers, and analytics services to operate our website effectively.
            </p>

            <h2 className="text-xl mb-4 text-primary">Data Retention</h2>
            <p className="text-secondary-v4 leading-[1.7] text-[15px] font-light mb-6">
              We retain your information only as long as necessary to provide our services, comply with legal
              obligations, and resolve disputes.
            </p>

            <h2 className="text-xl mb-4 text-primary">Your Rights</h2>
            <ul className="text-secondary-v4 leading-[1.7] text-[15px] font-light mb-6 list-disc pl-6">
              <li>Access and review your personal data</li>
              <li>Request correction or deletion of your data</li>
              <li>Withdraw consent where applicable</li>
              <li>Object to certain data processing activities</li>
            </ul>

            <h2 className="text-xl mb-4 text-primary">Data Security</h2>
            <p className="text-secondary-v4 leading-[1.7] text-[15px] font-light mb-6">
              We take reasonable measures to protect your data, but no method of transmission over the internet is 100%
              secure.
            </p>

            <h2 className="text-xl mb-4 text-primary">Third-Party Services</h2>
            <p className="text-secondary-v4 leading-[1.7] text-[15px] font-light mb-6">
              We may use third-party services such as Stripe, Firebase, and analytics tools. These services have their
              own privacy policies governing how they handle your data.
            </p>

            <h2 className="text-xl mb-4 text-primary">Children’s Privacy</h2>
            <p className="text-secondary-v4 leading-[1.7] text-[15px] font-light mb-6">
              Our services are not intended for children under 13, and we do not knowingly collect personal data from
              children.
            </p>

            <h2 className="text-xl mb-4 text-primary">Changes to This Policy</h2>
            <p className="text-secondary-v4 leading-[1.7] text-[15px] font-light mb-6">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an
              updated date.
            </p>

            <h2 className="text-xl mb-4 text-primary">Contact Us</h2>
            <p className="text-secondary-v4 leading-[1.7] text-[15px] font-light mb-6">
              If you have any questions about this Privacy Policy, please contact us at support@yourdomain.com.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Template;
