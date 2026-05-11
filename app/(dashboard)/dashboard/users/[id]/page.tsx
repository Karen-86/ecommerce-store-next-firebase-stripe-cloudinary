"use client"

import React, { useState, useEffect } from "react"
import { BreadcrumbDemo, Separator } from "@/components/index"
import { LOCAL_DATA } from "@/constants/index"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { useParams } from "next/navigation"
import { useAuthStore } from "@/modules/auth/store"

import ProfileHeader from "./profile-header/ProfileHeader"
import { useUserStore } from "@/modules/users/store"
import type { User } from "@/modules/users/types"

const { notFoundImage } = LOCAL_DATA.images

const Page = () => {
  const params = useParams()
  const userId = params.id

  const getTargetUserAsync = useUserStore((s) => s.getTargetUserAsync)
  const targetUser = useUserStore((s) => s.targetUser)
  const isTargetUserLoading = useUserStore((s) => s.isTargetUserLoading)
  const authUser = useAuthStore((s) => s.authUser)

  useEffect(() => {
    if (!userId) return
    getTargetUserAsync({ userId })
  }, [userId])

  const breadcrumbItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
    },
    {
      label: `Profile (${targetUser.displayName})`,
    },
  ]
  if (authUser?.uid === targetUser?.id) {
    return (
      <main>
        <img className="max-w-[300px]" src={notFoundImage} alt="" />
      </main>
    )
  }

  return (
    <main className="pages-page p-5 pt-1">
      <h2 className="mb-1 text-2xl capitalize">Profile</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />
      <Card className="relative mb-[150px] min-h-[500px]">
        <CardContent>
          <ProfileHeader user={targetUser} isUserLoading={isTargetUserLoading} />
          <UserInfoBlock user={targetUser} />
        </CardContent>
      </Card>
    </main>
  )
}

// USER INFO BLOCK
const UserInfoBlock = ({ user = {} }: { user: User }) => {
  return (
    <div className="relative py-5">
      <Separator title="Details" className="mb-3" titleClassName="bg-white" />
      <div className="settings mb-[80px] ml-auto flex justify-end"></div>
      <div className="relative">
        <div className="w-full max-w-[500px]">
          <div className="mb-3 flex items-center justify-between gap-5 border-b-1 border-dashed border-input px-3 py-1 text-sm">
            <div className="font-bold">Name:</div>
            <div>{user.displayName || "-"}</div>
          </div>
          <div className="mb-3 flex items-center justify-between gap-5 border-b-1 border-dashed border-input px-3 py-1 text-sm">
            <div className="font-bold">Email:</div>
            <div>
              {(user.email &&
                user.roles?.some((role) => ["admin", "superAdmin"].includes(role)) &&
                user.email) ||
                "***"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
