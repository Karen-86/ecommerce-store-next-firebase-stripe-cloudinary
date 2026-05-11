import request, { createHeaders, urls, requestMiddleware } from "@/lib/api/client.js"

// for custom api
// import axios from "axios";

// const api = axios.create({
//   baseURL: urls.localData,
//   withCredentials: true,
// });

// api.interceptors.request.use(requestMiddleware);

export async function checkout({ body }: any) {
  const url = `/checkout`
  const headers = createHeaders()
  return request({ url, method: "POST", headers, body })
}