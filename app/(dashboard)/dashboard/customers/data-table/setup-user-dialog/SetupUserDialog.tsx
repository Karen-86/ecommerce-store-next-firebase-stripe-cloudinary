"use client";

import React, { useState, useEffect } from "react";
import {
  ButtonDemo,
  DialogDemo,
  InputDemo,
  SelectDemo,
  // SelectScrollable
} from "@/components/index";
import { successAlert, errorAlert, warningAlert } from "@/lib/utils/alert";

import { DropdownMenuCheckboxes } from "@/components/index.js";
import { ChevronDown } from "lucide-react";
import { useAuthActions } from "@/modules/auth/hooks/useAuthActions";
import { useUserStore } from "@/modules/users/store";
import { useAuthStore } from "@/modules/auth/store";

export const SetupUserDialog = ({ user = {} }) => {
  return (
    <DialogDemo contentClassName="" trigger={<div>{`${"Edit Settings"}`}</div>}>
      {(closeDialog) => <SetupUserDialogContent user={user} closeDialog={closeDialog} />}
    </DialogDemo>
  );
};

type StateProps = {
  roles: any;
};

const SetupUserDialogContent = ({ user = {}, closeDialog = () => {} }: { user: any; closeDialog: () => void }) => {
  const updateTargetUserRolesAsync = useUserStore((s) => s.updateTargetUserRolesAsync);
  const getProfileAsync = useAuthStore((s) => s.getProfileAsync);
  const isTargetUserRolesUpdating = useUserStore((s) => s.isTargetUserRolesUpdating);

  const [state, setState] = useState<StateProps>({
    roles: user.roles,
  });

  const [defaultRoles, setDefaultRoles] = useState<any>([]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fields: { [key: string]: any } = {};

    if (state.roles !== user.roles) fields.roles = state.roles;

    updateTargetUserRolesAsync({
      userId: user.id,
      body: fields,
      successCB: (data: any) => {
        closeDialog();
        successAlert(data.message);
        // getProfileAsync()
      },
      warningCB: (data: any) => {
        warningAlert(data.message);
      },
    });
  };

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      roles: user.roles,
    }));

    setDefaultRoles(
      [
        { id: "1", name: "user", isChecked: false },
        { id: "2", name: "admin", isChecked: false },
      ].map((role): any => ({
        id: role.id,
        name: role.name,
        isChecked: user.roles.includes(role.name),
      })),
    );
  }, [user]);

  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <div className="crop-avatar-dialog">
      <h2 className="mb-5 text-2xl font-semibold!">Change user settings</h2>
      <form onSubmit={onSubmit} className={`${""}`}>
        <DropdownMenuCheckboxes
          items={defaultRoles}
          onCheckedChange={({ isChecked, checkboxId }) => {
            let tempItems = [...defaultRoles];
            tempItems = tempItems.map((item) => ({
              ...item,
              isChecked: item.id === checkboxId ? isChecked : false,
            }));
            setDefaultRoles(tempItems);
            setState((prev) => ({
              ...prev,
              roles: tempItems.filter((role: any) => role.isChecked).map((role: any) => role.name),
            }));
          }}
          triggerClassName={`w-full mb-10`}
          contentClassName={`w-full! mx-0 max-w-full!`}
          trigger={
            <ButtonDemo text="Assign Roles" className="justify-between" variant="outline" endIcon={<ChevronDown />} />
          }
          open={openDropdown}
          setOpen={setOpenDropdown}
          // side="right"
          // align="end"
        />

        {/* {currentUser?.uid !== user.id && (
          <SelectDemo
            label="Select"
            defaultItems={["user", "admin"].map((role) => {
              return {
                label: role,
                value: role,
                isSelected: state.role == role,
              };
            })}
            callback={({ value }) => {
              setState((prev) => ({
                ...prev,
                role: value.toString(),
              }));
            }}
            className="mb-5"
            contentClassName={`custom-content`}
          />
        )} */}

        {/* {currentUser?.uid !== user.id && (
          <SelectScrollable
            label="Role"
            triggerClassName="w-full mb-5"
            contentClassName=""
            defaultItems={["user", "admin"].map((type) => {
              return {
                label: type,
                value: type,
                isSelected: user.role == type,
              };
            })}
            callback={(selectedItem) => {
              setState((prev) => ({
                ...prev,
                role: selectedItem.value.toString(),
              }));
            }}
          />
        )} */}

        <div className="button-group flex justify-end gap-2">
          <ButtonDemo
            className=""
            disabled={isTargetUserRolesUpdating}
            text="Cancel"
            variant="outline"
            type="button"
            onClick={closeDialog}
          />
          <ButtonDemo
            className=""
            disabled={isTargetUserRolesUpdating}
            text={`${isTargetUserRolesUpdating ? "Loading..." : "Save"}`}
          />
        </div>
      </form>
    </div>
  );
};
