import React, { useState, useEffect } from "react";
import BasicInfoSection from "./sections/BasicInfoSection";
import PricingSection from "./sections/PricingSection";
import InventorySection from "./sections/InventorySection";
import VariantsSection from "./sections/VariantsSection";
import OrganizationSection from "./sections/OrganizationSection";
import StatusSection from "./sections/StatusSection";
import SeoSection from "./sections/SeoSection";
import { useAuthStore } from "@/modules/auth/store";
import { useUserStore } from "@/modules/users/store";
import { useProductStore } from "@/modules/products/store";
import { ValidationResult } from "joi";
import { validateCreateProduct } from "@/modules/products/validation";
import LOCAL_DATA from "@/constants/localData";
import { ButtonDemo } from "@/components/index";
import { alert, errorAlert } from "@/lib/utils/alert";
import { slugify } from "@/lib/utils/formatters";
import type { Product, ProductFormType, MediaItemType } from "@/modules/products/types";
import { parseFormattedNumber } from "@/lib/utils/formatters";
import type { BasicInfoType, OptionType, VariantType, SeoType } from "@/modules/products/types";
import { useRouter } from "next/navigation";

const { preloader } = LOCAL_DATA.images;

const DEFAULT_VARIANT = {
  id: `variant-${crypto.randomUUID()}`,
  sku: "",
  stock: 0,
  price: "",
  compareAtPrice: "",
  images: [],
  primaryImage: "",
  attributes: {},
};

const ProductForm = ({ editingProduct = null, isProductLoading = false }: any) => {
  const [basicInfo, setBasicInfo] = useState<BasicInfoType>({
    title: "",
    slug: "",
    description: "",
    media: [],
    category: "",
  });
  const [options, setOptions] = useState<OptionType[]>([]);
  const [variants, setVariants] = useState<VariantType[]>([DEFAULT_VARIANT]);
  const [seo, setSeo] = useState<SeoType>({
    title: "",
    description: "",
  });
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("active");
  const [organization, setOrganization] = useState<{ [key: string]: any }>({
    brand: "",
    collections: [],
    collectionsNormalized:[],
    tags: [],
  });
  const [media, setMedia] = useState<MediaItemType[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (!editingProduct) return;
    setBasicInfo({
      title: editingProduct.title,
      slug: editingProduct.slug,
      description: editingProduct.description,
      media: editingProduct.media,
      category: editingProduct.category,
    });

    setOptions(
      editingProduct.options.map((option: OptionType) => ({
        ...option,
        isSaved: true,
      })),
    );

    setVariants(
      editingProduct.variants.map((variant: VariantType) => ({
        ...variant,
        price: variant.price || "", // Formatted for UI
        compareAtPrice: variant.compareAtPrice || "", // Formatted for UI
      })),
    );

    setStatus(editingProduct.status);

    setOrganization({
      brand: editingProduct.brand || "",
      collections: editingProduct.collections || [],
      tags: editingProduct.tags || [],
    });

    setMedia(editingProduct.media);
  }, [editingProduct]);

  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [result, setResult] = useState<ValidationResult>();
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

  const createProductAsync = useProductStore((s) => s.createProductAsync);
  const updateProductAsync = useProductStore((s) => s.updateProductAsync);
  const isProductCreating = useProductStore((s) => s.isProductCreating);
  const isProductUpdating = useProductStore((s) => s.isProductUpdating);

  const getFormattedProduct = () => {
    let formattedProduct: ProductFormType = { ...basicInfo, ...organization, seo, slug, status, media };
    formattedProduct.options = [...options].filter((option) => option.isSaved).map(({ isSaved, ...rest }) => rest);
    formattedProduct.variants = [...variants].map((variant) => ({
      ...variant,
      stock: parseFormattedNumber(variant.stock), // Formatted for DB
      price: parseFormattedNumber(variant.price), // Formatted for DB
      compareAtPrice: parseFormattedNumber(variant.compareAtPrice), // Formatted for DB
    }));

    return formattedProduct;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setBasicInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedProduct = getFormattedProduct();

    const { error } = editingProduct
      ? validateCreateProduct(formattedProduct)
      : validateCreateProduct(formattedProduct);

    if (error) errorAlert(error.message);

    if (!error) {
      if (editingProduct) {
        updateProductAsync({
          productId: editingProduct.id,
          body: formattedProduct,
          successCB: (data: any) => alert(data.message),
          errorCB: (data: any) => errorAlert(data.message),
        });
      } else {
        createProductAsync({
          body: formattedProduct,
          successCB: (data: any) => {
            alert(data.message);
            router.push(`/dashboard/products/${data.data.id}`);
            // window.open(`/dashboard/products/${data.data.id}`, "_blank");
          },
          errorCB: (data: any) => errorAlert(data.message),
        });
      }
      console.log(formattedProduct, " product");
      console.log("Submit");
    }
    if (!error) return;
    setWasSubmitted(true);
  };

  useEffect(() => {
    const formattedProduct = getFormattedProduct();

    setResult(editingProduct ? validateCreateProduct(formattedProduct) : validateCreateProduct(formattedProduct));
  }, [basicInfo, variants, options]);

  useEffect(() => {
    if (!wasSubmitted) return;
    const errors: Record<string, string> = {};
    result?.error?.details.forEach((item) => {
      const key = String(item.path[0]);
      if (errors[key]) return;
      errors[key] = item.message;
    });
    setErrorMessages(errors);
  }, [result, wasSubmitted]);

  // useEffect(() => {
  //   if (!isOpen) {
  //     setBasicInfo(initialProduct);
  //     setWasSubmitted(false);
  //     setErrorMessages({});
  //     setEditingProduct(null)
  //   }
  // }, [isOpen]);
  return (
    <form
      onSubmit={onSubmit}
      className={`max-w-[900px] mx-auto h-full flex flex-col ${wasSubmitted ? "was-submitted" : ""}`}
    >
      <div className="row flex flex-col lg:flex-row gap-5 [&_input,&_textarea,select,button,.combobox-chips,.dark-border-field]:border-black/40! ">
        <div className="col flex-1 min-w-0">
          <BasicInfoSection {...{ basicInfo, setBasicInfo, media, setMedia, onChange, errorMessages }} />
          <PricingSection {...{ variants, setVariants }} />
          <InventorySection {...{ variants, setVariants }} />
          <VariantsSection {...{ options, setOptions, variants, setVariants, media }} />
          <SeoSection {...{ setSeo, slug, setSlug, basicInfo }} />
        </div>

        <div className="col lg:max-w-[300px] flex-1">
          <StatusSection {...{ status, setStatus, basicInfo }} />
          <OrganizationSection {...{ organization, setOrganization }} />
        </div>
      </div>

      <ButtonDemo
        className="ml-auto w-full sm:w-auto rounded-lg  hover:bg-black/80"
        variant="dark"
        startIcon={false ? <img src={preloader} className=" w-[18px] h-[18px]" /> : null}
        text={`${editingProduct ? "Edit Product" : "Save Product"}`}
        disabled={isProductCreating || isProductUpdating}
      />
    </form>
  );
};

export default ProductForm;
