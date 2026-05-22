"use client";

import React, { useState } from "react";
import LOCAL_DATA from "@/constants/localData";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { ButtonDemo, InputDemo } from "@/components/index";
import useSendEmail from "@/hooks/useSendEmail";
import { ArrowRight, Phone, Mail } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const { logo } = LOCAL_DATA.images;
const { twitterIcon, facebookIcon, linkedInIcon, githubIcon } = LOCAL_DATA.svgs;

const Footer = () => {
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
      (image ? `<img src="${image}" width='100' style="height:auto;"  />` : "");
    form.CONTENT.value = CONTENT;

    sendEmail({ form });
  };

  return (
    <footer className="  min-h-[300px] pt-[4rem] bg-black/2">
      <div className="container">
        <div className="wrapper w-full mb-10 grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-20 lg:gap-x-5  lg:grid-cols-[auto_auto_auto_auto] justify-between">
          <div className="col  lg:max-w-[270px] xl:max-w-[350px]">
            <a href="/" className="mb-7 block">
              <img src={logo} alt="" className="max-w-[120px] h-auto " />
            </a>
            <p className="footer-description text-sm text-black/40  mb-3 max-w-[450px]">
              Discover the latest trends, curated just for you. From everyday must-haves to standout pieces, we make
              shopping easy, stylish, and fun.
            </p>
            <div className="socials flex gap-2">
              <a href="https://www.facebook.com/" target="_blank" className="socials-link facebook">
                <ButtonDemo
                  className="rounded-full text-secondary-v3 hover:bg-white hover:-translate-y-1 hover:shadow-[0_1px_6px_rgba(0,0,0,0.1)]"
                  variant="outline"
                  size="icon"
                  icon={facebookIcon}
                />
              </a>
              <a href="https://x.com/" target="_blank" className="socials-link facebook">
                <ButtonDemo
                  className="rounded-full text-secondary-v3 hover:bg-white hover:-translate-y-1 hover:shadow-[0_1px_6px_rgba(0,0,0,0.1)]"
                  variant="outline"
                  size="icon"
                  icon={twitterIcon}
                />
              </a>
              <a href="https://www.linkedin.com/" target="_blank" className="socials-link facebook">
                <ButtonDemo
                  className="rounded-full text-secondary-v3 hover:bg-white hover:-translate-y-1 hover:shadow-[0_1px_6px_rgba(0,0,0,0.1)]"
                  variant="outline"
                  size="icon"
                  icon={linkedInIcon}
                />
              </a>
              <a href="https://github.com/" target="_blank" className="socials-link facebook">
                <ButtonDemo
                  className="rounded-full text-secondary-v3 hover:bg-white hover:-translate-y-1 hover:shadow-[0_1px_6px_rgba(0,0,0,0.1)]"
                  variant="outline"
                  size="icon"
                  icon={githubIcon}
                />
              </a>
            </div>
          </div>

          <div className="col">
            <h4 className="mb-5">Quick Links</h4>
            <ul className="flex flex-col items-start">
              <Link href="/about" className="text-sm text-secondary-v3 hover:text-primary whitespace-nowrap  mb-2">
                About Us
              </Link>
              <Link href="/contact" className="text-sm text-secondary-v3 hover:text-primary whitespace-nowrap  mb-2">
                Contact Us
              </Link>
              <Link href="/privacy" className="text-sm text-secondary-v3 hover:text-primary whitespace-nowrap  mb-2">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-secondary-v3 hover:text-primary whitespace-nowrap  mb-2">
                Terms and Conditions
              </Link>
            
            </ul>
          </div>

          <div className="col">
            <h4 className="mb-5">Help & Support</h4>
            <ul className="flex flex-col items-start">
              <Link href="/shop" className="text-sm text-secondary-v3 hover:text-primary whitespace-nowrap  mb-2">
                Shop
              </Link>
              <a href="#features-section" className="text-sm text-secondary-v3 hover:text-primary whitespace-nowrap  mb-2">
                Featured products
              </a>
              <a href="#trends-section" className="text-sm text-secondary-v3 hover:text-primary whitespace-nowrap  mb-2">
                Trending products
              </a>
              <Link href="/my-orders" className="text-sm text-secondary-v3 hover:text-primary whitespace-nowrap  mb-2">
                My Orders
              </Link>
              <Link href="/cart" className="text-sm text-secondary-v3 hover:text-primary whitespace-nowrap  mb-2">
                Cart
              </Link>
             
            </ul>
          </div>

          <div className="col lg:max-w-[270px] xl:max-w-[350px]">
            <h4 className="mb-5">Newsletter</h4>
            <p className="description text-sm text-black/40 max-w-[400px] mb-3">
              Subscribe to our newsletter to receive updates and exclusive offers.
            </p>

            <form onSubmit={onSubmit} className=" relative mb-5">
              <InputDemo
                required={true}
                placeholder="Enter your email address"
                className=" w-full"
                inputClassName="rounded-full px-5 py-5 h-12 pr-15"
                name="email"
                type="email"
                value={state.email}
                onChange={handleOnChange}
              />
              <input type="text" name="image" defaultValue={`${siteUrl}/assets/images/logo.png`} className="hidden" />
              <input type="text" name="CONTENT" className="hidden" />
              <input type="text" name="to_email" defaultValue="aiden.dev7@gmail.com" className="hidden" />

              <ButtonDemo
                type="submit"
                disabled={isLoading}
                className="rounded-full absolute right-1 top-1 w-10 h-10"
                size="icon"
                icon={<ArrowRight />}
              />
            </form>

            <Separator className="bg-primary/10 mb-5" />

            <div className="flex items-center gap-1 mb-2">
              <Phone className="h-4 text-primary" />
              <a
                href="tel:+1234567890"
                target="_blank"
                className="text-sm text-secondary-v3 hover:text-primary whitespace-nowrap "
              >
                +1 (800) 123-4567
              </a>
            </div>
            <div className="flex items-center gap-1 mb-2">
              <Mail className="h-4 text-primary" />
              <a
                href="mailto:example@gmail.com"
                target="_blank"
                className="text-sm text-secondary-v3 hover:text-primary whitespace-nowrap "
              >
                support@example.com
              </a>
            </div>
          </div>
        </div>

        <hr className="border-primary/10" />

        <div className="row py-10 flex gap-5 flex-wrap justify-between">
          <div className="col flex gap-5">
            <Link href="/privacy" className="text-secondary-v3 hover:text-primary text-sm ">
              Privacy Policy
            </Link>
            <Separator orientation="vertical" className="bg-primary/10" />
            <Link href="/terms" className="text-secondary-v3 hover:text-primary text-sm ">
              Terms of Service
            </Link>
          </div>

          <div className="col">
            <p className="text-secondary-v3 text-sm ">© 2026 All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
