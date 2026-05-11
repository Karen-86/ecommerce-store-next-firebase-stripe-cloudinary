"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { BreadcrumbDemo, ButtonDemo, CarouselGallery } from "@/components/index.js";
import { useParams } from "next/navigation";
import { useCartStore } from "@/modules/carts/store";
import LOCAL_DATA from "@/constants/localData";
import { Home, StarIcon, Minus, Plus, RefreshCw, Undo2, Truck, Package } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import useProductWithCart from "@/modules/products/hooks/useProductWithCart";
import { alert } from "@/lib/utils/alert";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDeliveryRange } from "@/lib/utils/formatters";

const colorMap: any = {
  red: "bg-red-600",
  blue: "bg-blue-600",
  green: "bg-green-600",
  black: "bg-black",
  purple: "bg-purple-600",
  white: "bg-white",
  silver: "bg-gray-400",
  yellow: "bg-yellow-400",
};

const getVariantKey = (attributes: any = {}) =>
  Object.entries(attributes)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join("|");

const Template = () => {
  const params = useParams();
  const id = params.id as string;

  const { productWithCart, isLoading } = useProductWithCart({ id });

  const breadcrumbItems = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Products" },
    {
      label: productWithCart?.name ? <div className="truncate max-w-100">{productWithCart?.name}</div> : "unknown",
    },
  ];

  return (
    <main className="product-page pt-25 min-h-[100vh]">
      <div className="container">
        <BreadcrumbDemo items={breadcrumbItems} />
      </div>

      <DetailsSection productWithCart={productWithCart} isLoading={isLoading} />
    </main>
  );
};

type ProductsProps = {
  productWithCart: any;
  isLoading?: boolean;
  isInDialog?: boolean;
};

export const DetailsSection = ({ productWithCart, isLoading, isInDialog }: ProductsProps) => {
  const setIsCartSheetOpen = useCartStore((s) => s.setIsCartSheetOpen);
  const isCartItemCreating = useCartStore((s) => s.isCartItemCreating);
  const isCartItemDeleting = useCartStore((s) => s.isCartItemDeleting);
  const createCartItemAsync = useCartStore((s) => s.createCartItemAsync);
  const cart = useCartStore((s) => s.cart);

  const [activeVariant, setActiveVariant] = useState<any>(null);

  const defaultVariant = useMemo(() => {
    return productWithCart?.variants?.find((v: any) => v.stock > 0) || null;
  }, [productWithCart]);

  const displayVariant = activeVariant || defaultVariant;

  const galleryImages = displayVariant?.images;

  const variantKey = displayVariant ? getVariantKey(displayVariant.attributes) : null;

  const cartItem = cart?.items?.find(
    (item: any) => item.productId === productWithCart?.id && item.variantKey === variantKey,
  );

  const isInCart = !!cartItem;

  const router = useRouter();

  const addProductToCart = async () => {
    if (!productWithCart || !activeVariant) return;
    const data = await createCartItemAsync({
      productId: productWithCart.id,
      variantKey: getVariantKey(activeVariant.attributes || {}),
      body: {
        quantity: 1,
        variantDetails: activeVariant,
        productDetails: productWithCart,
      },
    });

    if (data) {
      alert("Added to cart successfully!", `Name: ${productWithCart.name}`, {
        label: "View Cart",
        onClick: () => router.push("/cart"),
      });
    }
  };

  const handleBuyNow = async () => {
    if (!isInCart) await addProductToCart();
    router.push("/cart");
  };

  return (
    <section className="details pt-7!">
      <div className="container">
        {isLoading ? (
          <div className="grid sm:grid-cols-2 gap-7">
            <Skeleton className="min-h-[500px] w-full rounded-md" />
            <Skeleton className="min-h-[500px] w-full rounded-md" />
          </div>
        ) : !productWithCart ? (
          "Empty"
        ) : (
          <div className="grid sm:grid-cols-2 gap-12 gap-y-20  items-start ">
            <div className={`carousel-gallery-wrapper sm:sticky sm:top-4`}>
              <CarouselGallery items={galleryImages} />
            </div>

            <div>
              <h1 className="text-2xl lg:text-3xl sm:leading-10 mb-3">{productWithCart.name}</h1>

              <div className="flex items-center mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4.5 ${
                      i < Math.round(productWithCart?.rating || 4)
                        ? "fill-current text-primary"
                        : "text-secondary-v2/50"
                    }`}
                  />
                ))}
                <div className="text-sm text-secondary-v3 font-medium ml-2">({productWithCart?.rating})</div>
              </div>

              <div className="flex gap-2 mb-5">
                <div className="line-through text-secondary-v2 text-xl">${displayVariant?.compareAtPrice}</div>
                <div className="text-xl font-semibold">${displayVariant?.price}</div>
              </div>

              <p className="text-secondary-v3 font-light line-clamp-3 mb-5">{productWithCart.description}</p>

              <Separator className="mb-6" />

              <Variants
                productWithCart={productWithCart}
                activeVariant={activeVariant}
                setActiveVariant={setActiveVariant}
                isCartItemDeleting={isCartItemDeleting}
              />

              <div className="btn-group flex gap-3 flex-wrap mb-15">
                {isInCart ? (
                  <ButtonDemo
                    variant="outline"
                    size="xl"
                    className="rounded-xl flex-1"
                    text="Go to Cart"
                    onClick={() => router.push("/cart")}
                  />
                ) : (
                  <ButtonDemo
                    variant="outline"
                    size="xl"
                    className="rounded-xl flex-1"
                    text="Add to Cart"
                    onClick={addProductToCart}
                    disabled={isCartItemCreating || !activeVariant}
                  />
                )}

                <ButtonDemo
                  size="xl"
                  className="rounded-xl flex-1"
                  text="Buy Now"
                  onClick={() => handleBuyNow()}
                  disabled={isCartItemCreating || !activeVariant}
                />
              </div>

              <div className="wrapper">
                <div className="card order-info-card rounded-xl border border-black/3 bg-primary/3 px-4 py-5 min-h-25  flex gap-3 mb-5">
                  <div className="card-icon">
                    <Truck className="h-5 text-primary/80" />
                  </div>
                  <div className="card-body">
                    <div className="card-title text-sm font-medium">Estimated Delivery</div>
                    <div className="card-content text-xs font-light text-secondary-v2">
                      {formatDeliveryRange(7, 14)}
                    </div>
                  </div>
                </div>

                <div className="card order-info-card rounded-xl border border-black/3 bg-primary/3 px-4 py-5 min-h-25  flex gap-3">
                  <div className="card-icon">
                    <Package className="h-5 text-primary/80" />
                  </div>
                  <div className="card-body">
                    <div className="card-title text-sm font-medium">Free Shipping</div>
                    <div className="card-content text-xs font-light text-secondary-v2">
                      Free shipping available for orders over $120 in eligible regions and states.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

/* ---------------- VARIANTS ---------------- */

const Variants = ({ productWithCart, activeVariant, setActiveVariant, isCartItemDeleting }: any) => {
  const [selectedOptions, setSelectedOptions] = useState<any>({});

  const cart = useCartStore((s) => s.cart);
  const createCartItemAsync = useCartStore((s) => s.createCartItemAsync);
  const updateCartItemAsync = useCartStore((s) => s.updateCartItemAsync);
  const deleteCartItemAsync = useCartStore((s) => s.deleteCartItemAsync);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const findMatchingVariant = (options: any, variants: any[]) => {
    return variants.find((v) =>
      Object.entries(options).every(([key, value]) => value == null || v.attributes[key] === value),
    );
  };

  const isOptionAvailable = (optionName: string, value: string, variants: any[], selected: any) => {
    const testSelection = {
      ...selected,
      [optionName]: value,
    };

    return variants.some(
      (v) =>
        Object.entries(testSelection).every(([key, val]) => val == null || v.attributes[key] === val) && v.stock > 0,
    );
  };

  const toggleOption = (optionName: string, value: string) => {
    setSelectedOptions((prev: any) => {
      const isSame = prev[optionName] === value;

      if (isSame) {
        const copy = { ...prev };
        delete copy[optionName];
        return copy;
      }

      return {
        ...prev,
        [optionName]: value,
      };
    });
  };
  console.log(cart);
  // DEFAULT PASSED VARIANT
  const searchParams = useSearchParams();
  // const hasInitializedFromUrl = useRef(false);

  useEffect(() => {
    if (!productWithCart?.variants) return;
    // if (hasInitializedFromUrl.current) return;

    const variantId = searchParams.get("variantId");

    if (!variantId) return;

    const match = productWithCart.variants.find((v: any) => v.id === variantId);

    if (match) setSelectedOptions(match.attributes);

    // hasInitializedFromUrl.current = true;
  }, [searchParams]);
  //

  useEffect(() => {
    if (!productWithCart?.variants) return;
    const requiredCount = productWithCart?.options?.length || 0;
    const selectedCount = Object.keys(selectedOptions).length;

    if (selectedCount !== requiredCount) {
      setActiveVariant(null);
      return;
    }

    const match = findMatchingVariant(selectedOptions, productWithCart.variants);

    setActiveVariant(match || null);
  }, [selectedOptions, productWithCart?.variants]);

  const variantKey = activeVariant
    ? Object.entries(activeVariant.attributes)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}:${v}`)
        .join("|")
    : null;

  const cartItem = cart?.items?.find(
    (item: any) => item.productId === productWithCart?.id && item.variantKey === variantKey,
  );

  // const quantity = cartItem?.quantity ?? 0;
  const [localQuantity, setLocalQuantity] = useState(0);
  const [isEditingQty, setIsEditingQty] = useState(false);

  useEffect(() => {
    if (!isEditingQty) {
      setLocalQuantity(cartItem?.quantity ?? 0);
    }
  }, [cartItem?.quantity]);

  const updateQuantity = (next: number) => {
    if (!activeVariant) return;

    if (next <= 0) {
      deleteCartItemAsync({
        productId: productWithCart.id,
        variantKey,
      });
      return;
    }

    // Optimistic UI
    setIsEditingQty(true);
    setLocalQuantity(next);

    clearTimeout(debounceRef.current as any);
    debounceRef.current = setTimeout(() => {
      try {
        if (!cartItem) {
          createCartItemAsync({
            productId: productWithCart.id,
            variantKey: getVariantKey(activeVariant.attributes || {}),
            body: {
              quantity: next,
              variantDetails: activeVariant,
              productDetails: productWithCart,
            },
          });
        } else {
          updateCartItemAsync({
            productId: productWithCart.id,
            variantKey: getVariantKey(activeVariant.attributes || {}),
            body: {
              quantity: next,
            },
          });
        }
      } finally {
        setIsEditingQty(false);
      }
    }, 300);
  };

  const changeQty = (delta: number) => {
    let next = localQuantity + delta;

    if (next < 0) next = 0;
    if (next > (activeVariant?.stock || 0)) {
      next = activeVariant?.stock;
    }

    updateQuantity(next);
  };

  const reset = () => {
    setSelectedOptions({});
    setActiveVariant(null);
  };

  return (
    <div className="relative">
      {!!Object.keys(selectedOptions).length && (
        <ButtonDemo
          className=" bg-secondary/60 absolute top-0 right-0"
          size="sm"
          text="Undo"
          variant="ghostStrong"
          icon={<Undo2 />}
          onClick={reset}
        />
      )}

      {productWithCart?.options?.map((option: any, index: number) => (
        <div key={index} className="mb-5">
          <div className="text-sm font-medium capitalize mb-2">{option.name}</div>

          {/* SIZE */}
          {option.name === "size" && (
            <div className="flex gap-2">
              {option.values.map((value: string, i: number) => {
                const disabled = !isOptionAvailable(option.name, value, productWithCart.variants, selectedOptions);

                const selected = selectedOptions.size === value;

                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (disabled) return;
                      toggleOption(option.name, value);
                    }}
                    className={`border px-4 py-1 rounded-full text-sm cursor-pointer transition
                      ${selected ? "border-black" : "border-gray-300"}
                      ${disabled ? "opacity-30 pointer-events-none" : "hover:border-black/40"}`}
                  >
                    {value}
                  </div>
                );
              })}
            </div>
          )}

          {/* COLOR */}
          {option.name === "color" && (
            <div className="flex gap-2">
              {option.values.map((value: string, i: number) => {
                const disabled = !isOptionAvailable(option.name, value, productWithCart.variants, selectedOptions);

                const selected = selectedOptions.color === value;

                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (disabled) return;
                      toggleOption(option.name, value);
                    }}
                    className={`w-5 h-5 rounded-full border border-black/50 cursor-pointer transition shadow
                      ${colorMap[value] || "bg-gray-200"}
                      ${selected ? "ring-1 ring-black/70 ring-offset-1 ring-offset-white" : ""}
                      ${disabled ? "opacity-10 pointer-events-none" : "hover:scale-110"}`}
                  />
                );
              })}
            </div>
          )}

          {/* scent */}
          {option.name === "scent" && (
            <div className="flex gap-2">
              {option.values.map((value: string, i: number) => {
                const disabled = !isOptionAvailable(option.name, value, productWithCart.variants, selectedOptions);

                const selected = selectedOptions.size === value;

                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (disabled) return;
                      toggleOption(option.name, value);
                    }}
                    className={`border px-4 py-1 rounded-full text-sm cursor-pointer transition
                      ${selected ? "border-black" : "border-gray-300"}
                      ${disabled ? "opacity-30 pointer-events-none" : "hover:border-black/40"}`}
                  >
                    {value}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}

      {/* QUANTITY */}
      {!!localQuantity && (
        <div className={`flex items-center gap-3 mb-5 ${isCartItemDeleting ? "opacity-50 pointer-events-none" : ""}`}>
          <span className="text-sm">Quantity</span>

          <div className="flex items-center gap-2 rounded-full border overflow-hidden shadow-sm">
            <ButtonDemo
              variant="ghost"
              icon={<Minus />}
              size="icon"
              className="[&_svg]:h-3! rounded-none text-black"
              onClick={() => changeQty(-1)}
            />

            {/* <span className="w-10 text-center text-sm font-medium select-none">{quantity}</span> */}
            <input
              value={localQuantity}
              onChange={(e) => {
                const val = Number(e.target.value);

                if (isNaN(val)) return;

                let next = Math.max(0, val);

                if (activeVariant?.stock != null) {
                  next = Math.min(next, activeVariant.stock);
                }

                updateQuantity(next);
              }}
              className=" w-5 text-center text-sm font-medium bg-transparent outline-none"
            />

            <ButtonDemo
              variant="ghost"
              icon={<Plus />}
              size="icon"
              className="[&_svg]:h-3! rounded-none text-black"
              onClick={() => changeQty(+1)}
              disabled={localQuantity === activeVariant?.stock}
            />
          </div>

          <span className="text-sm">{activeVariant?.stock ?? 0} in stock</span>
        </div>
      )}
    </div>
  );
};

export default Template;
