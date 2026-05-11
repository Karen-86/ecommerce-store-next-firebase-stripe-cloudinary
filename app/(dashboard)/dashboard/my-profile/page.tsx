"use client"

import { BreadcrumbDemo, Separator } from "@/components/index"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

import ProfileHeader from "./profile-header/ProfileHeader"
import { useAuthStore } from "@/modules/auth/store"
import type { User } from "@/modules/users/types"

const breadcrumbItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    label: "My Profile",
  },
]

const Page = () => {
  const user = useAuthStore((s) => s.user)
  const isUserLoading = useAuthStore((s) => s.isUserLoading)

  return (
    <main className="pages-page p-5 pt-1">
      <h2 className="mb-1 text-2xl">My Profile</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />
      <Card className="relative mb-[150px] min-h-[500px]">
        <CardContent>
          <ProfileHeader user={user} isUserLoading={isUserLoading} />
          <UserInfoBlock user={user} />
        </CardContent>
      </Card>
    </main>
  )
}

// USER INFO BLOCK
const UserInfoBlock = ({ user }: { user: User }) => {
  return (
    <div className="relative py-5">
      <Separator title="Details" className="mb-3" titleClassName="bg-white" />
      <div className="relative">
        <div className=""></div>
        <div className="w-full">
          <div className="mb-3 flex items-center justify-between gap-5 border-b-1 border-dashed border-input px-3 py-1 text-sm">
            <div className="font-bold">Name:</div>
            <div>{user.displayName || "-"}</div>
          </div>
          <div className="mb-3 flex items-center justify-between gap-5 border-b-1 border-dashed border-input px-3 py-1 text-sm">
            <div className="font-bold">Email:</div>
            <div>{user.email || "-"}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
