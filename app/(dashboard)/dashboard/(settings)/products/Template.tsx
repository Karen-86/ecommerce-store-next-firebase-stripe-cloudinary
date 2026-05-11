"use client";

import React, { useState, useEffect } from "react";
import { InputDemo, ButtonDemo, AccordionDemo, UploadImageDemo, BlogFormSkeleton } from "@/components/index";
import { PlusIcon } from "lucide-react";
import { LOCAL_DATA } from "@/constants/index";
import { v4 as uuidv4 } from "uuid";
// import DeleteProductDialog from "./delete-product-dialog/DeleteProductDialog";
import { Product } from "@/modules/products/types";
import { useProductStore } from "@/modules/products/store";
import { successAlert, errorAlert, warningAlert } from "@/lib/utils/alert";
import { useAuthStore } from "@/modules/auth/store";
import * as productsApi from "@/modules/products/api";

const { placeholderImage } = LOCAL_DATA.images;

const Template = () => {

  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const getProductsAsync = useProductStore((s) => s.getProductsAsync);

  const user = useAuthStore((s) => s.user);

  const [formattedProducts, setFormattedProducts] = useState<{ [key: string]: any }[]>([]);

  useEffect(() => {
    getProductsAsync();
  }, []);

  useEffect(() => {
    setFormattedProducts(products);
  }, [products]);

  const populateList = () => {
    setFormattedProducts((prev): any => {
      return [
        ...prev,
        {
          id: uuidv4(),
          slug: `${uuidv4()}`,
       
        },
      ];
    });
  };

  return (
    <section>
      {isLoading ? (
        <BlogFormSkeleton />
      ) : (
        // <div className="blog-list mb-[150px]">
        //   {filteredBlogs.length ? (
        //     <AccordionDemo
        //       // type="multiple"
        //       className=""
        //       itemClassName={`!border rounded-md mb-[0.5rem] overflow-hidden`}
        //       triggerClassName="!rounded-none text-[14px] font-normal !no-underline p-4 hover:bg-slate-100 dark:hover:bg-neutral-700 rounded-md"
        //       items={filteredBlogs.map((blogItem: any, index: any) => {
        //         return {
        //           itemClassName: blogItem.slug,
        //           trigger: (
        //             <div className="flex w-full items-center gap-3">
        //               <div className="flex items-center gap-1">
        //                 <span className="text-xs">Author:</span>
        //                 <span className="text-xs text-gray-500">
        //                   {blogItem.author}
        //                 </span>
        //               </div>
        //               <div className="flex-1">
        //                 <span className="text-dark min-w-[150px] truncate">
        //                   {" "}
        //                   {blogItem.title}
        //                 </span>
        //               </div>
        //               <div className="text-xs text-gray-500">
        //                 {blogItem.slug}
        //               </div>{" "}
        //             </div>
        //           ),
        //           content: (
        //             <BlogItem key={index} {...{ blogItem, filteredBlogs }} />
        //           ),
        //         }
        //       })}
        //     />
        //   ) : (
        //     <h2 className="mb-4 text-3xl text-gray-300">Empty</h2>
        //   )}

        //   {filteredBlogs.length === blogs.length && (
        //     <ButtonDemo
        //       disabled={isProductsLoading}
        //       onClick={populateList}
        //       icon={<PlusIcon />}
        //       className="min-h-14 w-full"
        //       variant="secondary"
        //       text="Create New Blog"
        //     />
        //   )}
        // </div>
        <UploadProducts />
      )}
    </section>
  );
};

export function UploadProducts() {
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setLoading(true);

      const text = await file.text();
      const jsonData = JSON.parse(text);

      const data = await productsApi.uploadProducts({ body: { products: jsonData } });

      if (!data.success) return console.error(data.message);
      console.log(data);
    } finally {
      e.target.value = "";
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <InputDemo
        label="Upload Products"
        className="mb-[1.5rem] inline-block"
        name="picture"
        type="file"
        accept=".json"
        onChange={handleFileUpload}
      />

      {loading && <p>Uploading...</p>}
    </div>
  );
}

// const BlogItem = ({ blogItem = {}, filteredBlogs = [] }: any) => {
//   const [state, setState] = useState<Blog>({
//     status: "draft",
//     slug: "",
//     title: "",
//     description: "",
//     images: [],
//   })

//   const isBlogCreating = useProductStore((s) => s.isBlogCreating)
//   const isBlogUpdating = useProductStore((s) => s.isBlogUpdating)
//   const createBlogAsync = useProductStore((s) => s.createBlogAsync)
//   const updateBlogAsync = useProductStore((s) => s.updateBlogAsync)

//   const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setState((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }))
//   }

//   const onSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     const slug = state.slug?.split(" ").join("-")

//     if (blogItem.isNewBlog) {
//       createBlogAsync({
//         blogId: slug,
//         errorCB: (message: string) => errorAlert(message),
//         successCB: (message: string) => successAlert(message),
//         fields: {
//           status: state.status,
//           slug: state.slug,
//           title: state.title,
//           description: state.description,
//           images: state.images,
//         },
//       })
//       return
//     } else {
//       updateBlogAsync({
//         blogId: slug,
//         errorCB: (message: string) => errorAlert(message),
//         successCB: (message: string) => successAlert(message),
//         fields: {
//           ...(state.title !== blogItem.title ? { title: state.title } : {}),
//           ...(state.description !== blogItem.description
//             ? { description: state.description }
//             : {}),
//           images: state.images,
//         },
//       })
//     }
//   }

//   useEffect(() => {
//     // if blog-page document dont exist in firebase the input values may go from defined to undefined throwing error, so just add here "if(!Object.values(blogItem).length) return"
//     const tempState = {
//       ...blogItem,

//     }
//     setState((prev) => ({ ...prev, ...tempState }))
//   }, [blogItem])

//   return (
//     <div className="p-4">
//       <form action="" onSubmit={onSubmit} className="">

//         <InputDemo
//           label="Title"
//           name="title"
//           placeholder="Enter the blog title"
//           type="text"
//           onChange={onChange}
//           className="mb-5"
//           value={state.title}
//           //   inputClassName={true ? "is-invalid" : "is-valid"}
//         />

//         <InputDemo
//           label="Description"
//           name="description"
//           placeholder="Detailed description or excerpt"
//           type="text"
//           onChange={onChange}
//           className="mb-5"
//           value={state.description}
//           //   inputClassName={true ? "is-invalid" : "is-valid"}
//         />
//         {state.images &&
//           state.images.map((item: { [key: string]: string }) => {
//             return (
//               <UploadImageDemo
//                 key={item.id}
//                 {...item}
//                 state={state}
//                 setState={setState}
//               />
//             )
//           })}
//         <ButtonDemo
//           text={`${isBlogCreating ? "Creating..." : isBlogUpdating ? "Updating..." : blogItem.isNewBlog ? "Create" : "Update"} `}
//           className={`w-full`}
//           disabled={
//             (filteredBlogs.some(
//               (item: any) => item.slug == state.slug?.split(" ").join("-").trim()
//             ) &&
//               state.slug?.split(" ").join("-").trim() !== blogItem.slug) ||
//             !state.slug ||
//             isBlogCreating ||
//             isBlogUpdating
//           }
//         />
//       </form>

//       {!blogItem.isNewBlog && <DeleteProductDialog blogId={state.slug} />}
//     </div>
//   )
// }

export default Template;
