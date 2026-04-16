"use client";

import React, { useState } from "react";
import { Mail } from "lucide-react";
import Link from "next/link";
import { ButtonDemo, InputDemo } from "@/components/index";
import useSendEmail from "@/hooks/useSendEmail";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const SubscribeBanner = () => {
  const [state, setState] = useState({
    email: "",
  });

  const { sendEmail, isLoading } = useSendEmail();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submit");

    const form = e.target as any;

    const email = form.email?.value?.trim();
    const image = form.image?.defaultValue;

    const CONTENT =
      (email ? `<p><strong>email</strong>: ${email}</p>` : "") +
      (image ? `<img src="${image}" width='200' style="height:auto;"  />` : "");
    form.CONTENT.value = CONTENT;

    sendEmail({ form });
  };

  return (
    <div className="subscribe-banner bg-black px-5 sm:px-10 py-20  rounded-xl text-center my-[100px]">
      <Mail className="text-white h-8 w-8 mx-auto mb-5" />
      <h2 className="text-white text-xl sm:text-3xl mb-3">Subscribe our newsletter</h2>
      <p className="text-white/60 max-w-[550px] mx-auto mb-10">
        Get the latest products, exclusive offers, and inspiration delivered straight to your inbox.
      </p>

      <form onSubmit={onSubmit} className="mb-4 flex flex-col sm:flex-row gap-3 items-center justify-center">
        <InputDemo
          required={true}
          placeholder="Enter your email address"
          className="flex-1 w-full sm:max-w-[300px]"
          inputClassName="rounded-full px-5 py-5 h-12 text-white bg-white/10 placeholder:text-white/40"
          name="email"
          type="email"
          value={state.email}
          callback={handleOnChange}
        />
        <input type="text" name="image" defaultValue={`${siteUrl}/assets/images/logo.png`} className="hidden" />
        <input type="text" name="CONTENT" className="hidden" />
        <input type="text" name="to_email" defaultValue="aiden.dev7@gmail.com" className="hidden" />

        <ButtonDemo
          type="submit"
          disabled={isLoading}
          className="rounded-full px-7 w-full sm:w-auto"
          variant="light"
          size="lg"
          text="Subscribe"
        />
      </form>
      <p className="text-white/50 text-xs ">
        We care about your data. Read our{" "}
        <Link className="underline hover:text-white" href="/privacy">
          Privacy Policy.
        </Link>{" "}
      </p>
    </div>
  );
};

export default SubscribeBanner;


