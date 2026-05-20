import request, { createHeaders } from "@/lib/api/client.js"

export async function getUsers() {
  const url = "/users"
  const headers = createHeaders()
  return request({ url, method: "GET", headers })
}

export async function getTargetUser({ userId }: any) {
  const url = `/users/${userId}`
  const headers = createHeaders()
  return request({ url, method: "GET", headers })
}

export async function updateTargetUser({ userId, body }: any) {
  const url = `/users/${userId}`
  const headers = createHeaders()
  return request({ url, method: "PATCH", headers, body })
}

export async function updateTargetUserRoles({ userId, body }: any) {
  const url = `/users/${userId}/roles`
  const headers = createHeaders()
  return request({ url, method: "PATCH", headers, body })
}

export async function createTargetUserAddress({ userId, body }: any) {
  const url = `/users/${userId}/addresses`
  const headers = createHeaders()
  return request({ url, method: "POST", headers, body })
}
export async function updateTargetUserAddress({ userId,addressId, query, body }: any) {
  let url = `/users/${userId}/addresses/${addressId}`
  if(query) url += query
  const headers = createHeaders()
  return request({ url, method: "PATCH", headers, body })
}
export async function deleteTargetUserAddress({ userId,addressId, body }: any) {
  let url = `/users/${userId}/addresses/${addressId}`
  const headers = createHeaders()
  return request({ url, method: "DELETE", headers, body })
}

export async function deleteTargetUser({ userId }: any) {
  const url = `/users/${userId}`
  const headers = createHeaders()
  return request({ url, method: "DELETE", headers })
}
