import request, { createHeaders, urls, requestMiddleware } from "@/lib/api/client.js";

// for custom api
// import axios from "axios";

// const api = axios.create({
//   baseURL: urls.localData,
//   withCredentials: true,
// });

// api.interceptors.request.use(requestMiddleware);

export async function checkout({ body }: any) {
  const url = `/checkout`;
  const headers = createHeaders();
  return request({ url, method: "POST", headers, body });
}

export async function getCart({ cartId }: any) {
  const url = `/carts/${cartId}`;
  const headers = createHeaders();
  return request({ url, method: "GET", headers });
}

export async function createCartItem({ cartId, body }: any) {
  const url = `/carts/${cartId}/cart-items`;
  const headers = createHeaders();
  return request({ url, method: "POST", headers, body });
}

export async function updateCartItem({ cartId, cartItemId, body }: any) {
  const url = `/carts/${cartId}/cart-items/${cartItemId}`;
  const headers = createHeaders();
  return request({ url, method: "PATCH", headers, body });
}

export async function deleteCartItem({ cartId, cartItemId, body }: any) {
  const url = `/carts/${cartId}/cart-items/${cartItemId}`;
  const headers = createHeaders();
  return request({ url, method: "DELETE", headers, body });
}

export async function deleteCart({ cartId}: any) {
  const url = `/carts/${cartId}`;
  const headers = createHeaders();
  return request({ url, method: "DELETE", headers});
}

export async function attachGuestCartItems({ cartId, body}: any) {
  const url = `/carts/${cartId}/guest-cart-items`;
  const headers = createHeaders();
  return request({ url, method: "POST", headers, body});
}
