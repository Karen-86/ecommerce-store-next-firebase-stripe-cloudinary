import { BreadcrumbDemo } from "@/components/index";
import Template from "./Template";

const page = async () => {

  const breadcrumbItems = [

    {
      href: "/dashboard",
      label: "Dashboard",
    },
    {
      label: `products`,
    },
  ];

  return (
    <main className="product-section-page p-5 pt-1">
      <h2 className="text-2xl mb-1 capitalize">Products</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />
      <Template  />
    </main>
  );
};

export default page;
