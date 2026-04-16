import request, { createHeaders, urls, requestMiddleware } from "@/lib/api/client.js"

// for custom api
// import axios from "axios";

// const api = axios.create({
//   baseURL: urls.apiApp,
//   withCredentials: true,
// });

// api.interceptors.request.use(requestMiddleware);

export async function getProducts() {
  let url = "/products"
  const headers = createHeaders()
  return request({ url, method: "GET", headers })
}

export async function getProduct({ id }: any) {
  const url = `/products/${id}`
  const headers = createHeaders()
  return request({ url, method: "GET", headers })
}
export async function checkout({ body }: any) {
  const url = `/checkout`
  const headers = createHeaders()
  return request({ url, method: "POST", headers, body })
}
