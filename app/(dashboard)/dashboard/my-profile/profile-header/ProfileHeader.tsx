import React, { useState, useEffect } from "react";
import { LOCAL_DATA } from "@/constants/index";
import { ButtonDemo, DialogDemo, InputDemo, TextareaDemo, CropDemo } from "@/components/index";
import { Camera, X } from "lucide-react";
import { DeleteUserDialog } from "../delete-user-dialog/DeleteUserDialog";
import { convertToBase64, resizeBase64Image } from "@/lib/utils/imageUtils";
import { successAlert, errorAlert, warningAlert } from "@/lib/utils/alert";
import { useAuthStore } from "@/modules/auth/store";
import { useUserStore } from "@/modules/users/store";
import { Skeleton } from "@/components/ui/skeleton";

const { avatarPlaceholderImage } = LOCAL_DATA.images;

const ProfileHeader = ({ user = {}, isUserLoading = false }: { user: any; isUserLoading: boolean }) => {
  return (
    <div className="profile-header  max-w-200">
      <div className="flex flex-col sm:flex-row  gap-y-5 gap-x-10 mb-5">
        <div className="flex-1 avatar  max-w-30">
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
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{user.displayName}</h2>
          <div className=" text-sm font-normal leading-6 text-gray-500 line-clamp-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga maxime quidem perferendis molestias soluta aut debitis? Exercitationem vero culpa nobis neque! Distinctio sit beatae maxime ipsa consequuntur enim quisquam. Tempore ipsam soluta facilis iste officiis tempora nulla eaque eius reiciendis et! Aspernatur, quam aliquam? Excepturi doloremque temporibus eos blanditiis adipisci odio voluptatibus ullam alias. Saepe eaque autem labore in modi corrupti est libero. Dicta cupiditate, sapiente commodi alias sed ex quia odio, nulla et ullam perferendis expedita autem quae. Corrupti eum optio iusto vel, at maxime quod repellat saepe mollitia nisi laborum, quaerat illo officia, ratione deserunt quisquam est voluptatem!</div>
        </div>
      </div>
       {/* <div className="">
         <EditProfileDialog user={user} />
         <DeleteUserDialog userId={user.id} />
       </div> */}
    </div>
  );
};

export default ProfileHeader;

const EditProfileDialog = ({ user = {} }) => {
  return (
    <DialogDemo
      trigger={<ButtonDemo text={`${"Edit Profile"}`} className={`flex  text-sm`} variant="secondary" />}
    >
      {(closeDialog) => <EditProfileContent user={user} closeDialog={closeDialog} />}
    </DialogDemo>
  );
};

type StateProps = {
  // isAvatarExist: boolean;
  isAvatarRemoved: boolean;
  newAvatar: string;
  name: string;
  bio: string;
};

const EditProfileContent = ({ user = {}, closeDialog = () => {} }: { user: any; closeDialog: any }) => {
  const getProfileAsync = useAuthStore((s) => s.getProfileAsync);
  const updateTargetUserAsync = useUserStore((s) => s.updateTargetUserAsync);

  const authUser = useAuthStore((s) => s.authUser);

  const [state, setState] = useState<StateProps>({
    // isAvatarExist: user.base64PhotoURL || user.photoURL,
    isAvatarRemoved: false,
    newAvatar: user.base64PhotoURL || user.photoURL || avatarPlaceholderImage,

    name: "",
    bio: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [src, setSrc] = useState("");
  const [croppedImageSrc, setCroppedImageSrc] = useState("");

  const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // const compressedBlob = await compressImage(e.target.files[0], 300);
      const imageBase64 = await convertToBase64(e.target.files[0]);
      setSrc(imageBase64);

      e.target.value = "";
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // USER
    const fields: { [key: string]: any } = {};

    if (state.newAvatar !== avatarPlaceholderImage) {
      fields.base64PhotoURL = state.newAvatar;
    }
    if (state.isAvatarRemoved) {
      fields.base64PhotoURL = "";
      // fields.photoURL = "";
    }

    if (state.name !== user.displayName) {
      fields.displayName = state.name;
    }
    if (state.bio !== user.bio) {
      fields.bio = state.bio;
    }

    let errorMessage = "";

    // REQUESTS
    await updateTargetUserAsync({
      userId: authUser?.uid,
      body: fields,
      errorCB: (m: string) => (errorMessage = m),
    });

    closeDialog();
    getProfileAsync();
    setIsLoading(false);

    if (errorMessage) return errorAlert(errorMessage);

    successAlert("User has been updated successfully.");
  };

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      name: user.displayName || "",
      bio: user.bio || "",
    }));
  }, [user]);

  return (
    <div>
      <CropAvatarDialog
        src={src}
        setSrc={setSrc}
        croppedImageSrc={croppedImageSrc}
        setCroppedImageSrc={setCroppedImageSrc}
        setState={setState}
      />

      <h2 className="mb-5 text-center text-2xl !font-semibold">Edit Profile</h2>

      <div className="profile-header mb-[70px]">
        <div className="relative h-0 pt-[30%]">
          <div className="avatar-options avatar absolute bottom-0 left-[5%] w-[25%] translate-y-[50%]">
            <div className="relative h-0 w-[100%] overflow-hidden rounded-full border-2 border-white pt-[100%] shadow-[0_0_6px_rgba(0,0,0,0.3)]">
              <img
                src={state.newAvatar}
                className="absolute top-0 left-0 block h-full w-full bg-gray-50 object-cover"
                alt=""
              />
              <div className="pointer-events-none absolute top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.3)]"></div>

              <div className="absolute top-[50%] left-[50%] flex transform-[translate(-50%,-50%)] gap-1">
                <ButtonDemo
                  onClick={() => {
                    const input = document.querySelector("#upload-avatar") as HTMLInputElement | null;
                    input?.click();
                  }}
                  startIcon={<Camera />}
                  className="h-[30px] w-[30px] rounded-full bg-[rgba(0,0,0,0.7)] !shadow-none hover:bg-[rgba(0,0,0,0.8)] sm:h-[35px] sm:w-[35px]"
                />
                <input id="upload-avatar" type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
                {state.newAvatar !== avatarPlaceholderImage && !state.isAvatarRemoved && (
                  <ButtonDemo
                    startIcon={<X />}
                    className="h-[30px] w-[30px] rounded-full bg-[rgba(0,0,0,0.7)] !shadow-none hover:bg-[rgba(0,0,0,0.8)] sm:h-[35px] sm:w-[35px]"
                    onClick={() => {
                      setState((prev) => ({
                        ...prev,
                        isAvatarRemoved: true,
                        newAvatar: avatarPlaceholderImage,
                      }));
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={onSubmit} className={`${""}`}>
        <InputDemo
          label="Name"
          placeholder="Name"
          name="name"
          type="text"
          onChange={onChange}
          className="mb-5"
          value={state.name}
        />
        <TextareaDemo
          label={<div>Bio</div>}
          placeholder="Bio"
          name="bio"
          type="text"
          value={state.bio}
          onChange={onChange}
          className="mb-5"
        />
        <div className="button-group flex justify-end gap-2">
          <ButtonDemo
            className=""
            disabled={isLoading}
            text="Cancel"
            variant="outline"
            type="button"
            onClick={closeDialog}
          />
          <ButtonDemo className="" disabled={isLoading} text={`${isLoading ? "Loading..." : "Save"}`} />
        </div>
      </form>
    </div>
  );
};

// AVATAR DIALOG
const CropAvatarDialog = ({
  src = "",
  setSrc = (_: any) => {},
  croppedImageSrc = "",
  setCroppedImageSrc = (_: any) => {},
  setState = (_: any) => {},
}) => {
  const callback = (kkk: any) => {
    setSrc("");
  };
  return (
    <DialogDemo
      callback={callback}
      contentClassName="sm:max-w-[600px] py-[50px]  max-h-[100vh] overflow-y-auto"
      isDialogOpened={src ? true : false}
      trigger={<div className="hidden">hidden</div>}
    >
      {(closeDialog) => (
        <CropAvatarDialogContent
          closeDialog={closeDialog}
          src={src}
          setSrc={setSrc}
          croppedImageSrc={croppedImageSrc}
          setCroppedImageSrc={setCroppedImageSrc}
          setState={setState}
        />
      )}
    </DialogDemo>
  );
};

const CropAvatarDialogContent = ({
  closeDialog = () => {},
  src = "",
  setSrc = (_: any) => {},
  croppedImageSrc = "",
  setCroppedImageSrc = (_: any) => {},
  setState = (_: any) => {},
}) => {
  function getBase64ImageSize(base64String: any) {
    const padding = base64String.endsWith("==") ? 2 : base64String.endsWith("=") ? 1 : 0;
    const base64Length = base64String.length;
    const sizeInBytes = (base64Length * 3) / 4 - padding;
    const sizeInKB = sizeInBytes / 1024;
    return { bytes: sizeInBytes, kilobytes: sizeInKB };
  }

  return (
    <div className="crop-avatar-dialog">
      <div className="mx-auto mb-10 flex max-w-[500px]">
        <CropDemo src={src} aspect={1} setCroppedImageSrc={setCroppedImageSrc} />
      </div>
      <div className="button-group flex justify-end gap-2">
        <ButtonDemo
          className=""
          text="Cancel"
          variant="outline"
          type="button"
          onClick={() => {
            closeDialog();
            setSrc("");
          }}
        />
        <ButtonDemo
          className=""
          text={`${"Apply"}`}
          onClick={async () => {
            const size = getBase64ImageSize(croppedImageSrc).kilobytes;
            let filteredImage = croppedImageSrc;

            if (size > 350) filteredImage = await resizeBase64Image(croppedImageSrc, 350);

            setState((prev: any) => ({
              ...prev,
              newAvatar: filteredImage,
              isAvatarRemoved: false,
            }));
            setSrc("");
            closeDialog();
          }}
        />
      </div>
    </div>
  );
};
