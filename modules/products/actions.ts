// "use server";

// import { stripe } from "@/lib/Stripe";
// import createError from "@/lib/utils/createError";
// import type { Product } from "@/modules/products/types";

// export const getProductsAction = async () => {
//   try {
//     const products = await stripe.products.list({
//       expand: ["data.default_price"],
//     });
//     const plainProducts = JSON.parse(JSON.stringify(products));

//     return { success: true, data: plainProducts, message: "Products found successfully" };
//   } catch (error: any) {
//     // console.error("Stripe checkout error:", error);
//     return { success: false, message: error.message || "Internal server error" };
//   }
// };

// export const getProductAction = async ({ id = "" }) => {
//   try {
//     if (!id) return { success: false, message: "Invalid ID" };

//     const product = await stripe.products.retrieve(id, {
//       expand: ["default_price"],
//     });
//     const serializedProduct = JSON.parse(JSON.stringify(product));

//     return { success: true, data: serializedProduct, message: "Product found successfully" };
//   } catch (error: any) {
//     // console.error("Stripe checkout error:", error);
//     return { success: false, message: error.message || "Internal server error" };
//   }
// };

// export const checkoutAction = async ({ cartProducts }: {cartProducts: Product[]}) => {
  
//   try {
//     const line_items = cartProducts.map((product) => ({
//       price_data: {
//         currency: "cad",
//         product_data: { name: product.name },
//         unit_amount: product.price, // Stripe expects amount in cents
//       },
//       quantity: product.quantity,
//     }));

//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items,
//       mode: "payment",
//       success_url: `${baseUrl}/success`,
//       cancel_url: `${baseUrl}/cart`,
//       // customer_email: user.email,
//       // metadata: {
//       //   userId: user.userId,
//       // },
//       // mode: 'subscription'
//     });
    
//     return { success: true, url: session.url };
//   } catch (error: any) {
//     // console.error("Stripe checkout error:", error);
//      return { success: false, message: error.message };
//   }
// };
