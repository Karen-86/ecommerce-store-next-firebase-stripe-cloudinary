import { Header, Footer, ButtonDemo } from "@/components/index";
import { LOCAL_DATA } from "@/constants/index";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const { notFoundImage } = LOCAL_DATA.images;

export default function NotFound() {
  return (
    <div className="">
      {/* <Header className="static" /> */}
      <main className="">
        <section className="min-h-screen flex items-center">
          <div className="container text-center">
            <h1 className="text-6xl mb-8 uppercase">404</h1>
            <br />
            <Image
              src={notFoundImage}
              alt="Page not found"
              width={450}
              height={450}
              className="w-full max-w-112.5 mx-auto mb-12"
            />
            <Link href="/">
              <ButtonDemo startIcon={<ChevronLeft className="-ml-3" />} text="Home" className="min-w-25" />
            </Link>
          </div>
        </section>
      </main>
      {/* <Footer /> */}
    </div>
  );
}
