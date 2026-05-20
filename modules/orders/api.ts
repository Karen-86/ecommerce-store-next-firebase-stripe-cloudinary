import request, { createHeaders, urls, requestMiddleware } from "@/lib/api/client.js";

// for custom api
// import axios from "axios";

// const api = axios.create({
//   baseURL: urls.localData,
//   withCredentials: true,
// });

// api.interceptors.request.use(requestMiddleware);

export async function getOrder({ orderId, query }: any) {
  let url = `/orders/${orderId}`;
  
  if (query) url += query;
  const headers = createHeaders();
  return request({ url, method: "GET", headers });
}
