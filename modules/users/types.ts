import { FirestoreDoc } from "@/types"

export type User = {
  bio?: string
  displayName?: string
  email?: string
  photoURL?: string
  base64PhotoURL?: string
  roles?: [string]
  uid?: string
  addresses?: {[key:string]:any}[]
}

// api response data
export type UserResponse = FirestoreDoc & User & { id?: string }

// api request/payload data
export type UserDto = User
