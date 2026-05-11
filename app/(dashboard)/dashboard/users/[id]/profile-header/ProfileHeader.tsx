import React, { useState, useEffect } from "react"
import { LOCAL_DATA } from "@/constants/index"
import { ButtonDemo, DialogDemo, InputDemo, TextareaDemo, CropDemo } from "@/components/index"
import { Camera, X } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { User } from "@/modules/users/types"

const { bannerPlaceholderImage, avatarPlaceholderImage } = LOCAL_DATA.images

const ProfileHeader = ({ user, isUserLoading }: { user: any; isUserLoading: boolean }) => {
  return (
    <div className="profile-header">
      <div className="relative h-0 rounded-lg border pt-[50%] sm:pt-[30%]">
        {isUserLoading ? (
          <Skeleton className="absolute top-0 left-0 h-full w-full animation-duration-[0.8s]" />
        ) : (
          <img
            className="banner absolute top-0 left-0 h-full w-full rounded-lg border object-cover"
            src={user?.banner?.base64URL || bannerPlaceholderImage}
            alt=""
          />
        )}
        <div className="avatar absolute bottom-0 left-[5%] w-[25%] translate-y-[50%] lg:w-[170px]">
          <div className="relative h-0 w-[100%] overflow-hidden rounded-full border-2 border-white bg-white pt-[100%] shadow-[0_0_6px_rgba(0,0,0,0.3)]">
            {isUserLoading ? (
              <Skeleton className="absolute top-0 left-0 h-full w-full animation-duration-[0.8s]" />
            ) : (
              <img
                src={user.base64PhotoURL || user.photoURL || avatarPlaceholderImage}
                className="absolute top-0 left-0 block h-full w-full bg-gray-50 object-cover"
                alt=""
              />
            )}
          </div>
        </div>
      </div>
      <div className="pointer-events-none mt-3 mb-[15px] flex justify-end opacity-0 sm:mb-[5%] md:mb-[3%]">
        <div className="">
          <ButtonDemo text="hidden" className="mb-1 flex" />
          <ButtonDemo text="hidden" className="flex" />
        </div>
      </div>

      <div className="mb-10 md:pl-10">
        <h2 className="text-2xl font-bold">{user.displayName}</h2>
        <div className="max-w-[380px] text-sm font-medium text-gray-500">{user.bio}</div>
      </div>
    </div>
  )
}

export default ProfileHeader
