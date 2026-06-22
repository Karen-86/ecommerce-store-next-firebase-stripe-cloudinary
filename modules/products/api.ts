import request, { createHeaders, urls, requestMiddleware } from "@/lib/api/client.js";

// for custom api
// import axios from "axios";

// const api = axios.create({
//   baseURL: urls.localData,
//   withCredentials: true,
// });

// api.interceptors.request.use(requestMiddleware);

export async function getProducts({ query = "" } = {}) {
  let url = "/products";
  if (query) url += query;
  const headers = createHeaders();
  return request({ url, method: "GET", headers });
}

export async function getProduct({ productId }: any) {
  const url = `/products/${productId}`;
  const headers = createHeaders();
  return request({ url, method: "GET", headers });
}

export async function uploadProducts({ body }: any) {
  let url = "/products/upload";
  const headers = createHeaders();
  return request({ url, method: "POST", headers, body });
}

export async function createProduct({body}:any) {
  let url = "/products";
  const headers = createHeaders();
  return request({ url, method: "POST", headers, body });
}

export async function updateProduct({productId, body}:any) {
  let url = `/products/${productId}`;
  const headers = createHeaders();
  return request({ url, method: "PATCH", headers, body });
}

export async function deleteProducts({ query = "" }) {
  let url = "/products";
  if (query) url += query;
  const headers = createHeaders();
  return request({ url, method: "DELETE", headers });
}

export async function deleteProduct({ productId = "" }) {
  let url = `/products/${productId}`;
  const headers = createHeaders();
  return request({ url, method: "DELETE", headers });
}

export async function exportProducts({ }) {
  let url = "/products/export";
  const headers = createHeaders();
  return request({ url, method: "GET", headers, responseType: "blob" });
}