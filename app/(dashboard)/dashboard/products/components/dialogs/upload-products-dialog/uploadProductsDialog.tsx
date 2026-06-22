"use client";

import React, { useState, useEffect, useRef } from "react";
import { DialogDemo, ButtonDemo, InputDemo } from "@/components/index";
import { useProductStore } from "@/modules/products/store";
import { alert, errorAlert, warningAlert } from "@/lib/utils/alert";
import { FileJson } from "lucide-react";
import * as productsApi from "@/modules/products/api";

type UploadProductsDialogProps = {
  file: File | null;
  setFile: (file: File | null) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

type UploadProductsDialogContentProps = UploadProductsDialogProps & {
  closeDialog: () => void;
};

export default function UploadProductsDialog({ file = null, setFile = () => {}, inputRef }: UploadProductsDialogProps) {
  return (
    <DialogDemo
      contentClassName=""
      trigger={<ButtonDemo startIcon={<FileJson />} text="Upload" disabled={!file} className="rounded-l-none" />}
    >
      {(closeDialog) => <UploadProductsDialogContent {...{ file, setFile, inputRef }} closeDialog={closeDialog} />}
    </DialogDemo>
  );
}

const UploadProductsDialogContent = ({
  file = null,
  setFile = () => {},
  inputRef,
  closeDialog = () => {},
}: UploadProductsDialogContentProps) => {
  const [loading, setLoading] = useState(false);

  const getProductsAsync = useProductStore(s=>s.getProductsAsync)

  const handleFileUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);

      const text = await file.text();
      const jsonData = JSON.parse(text);

      const data = await productsApi.uploadProducts({ body: { products: jsonData.products } });

      if (!data.success) return errorAlert(data.message || "Upload failed");
      setFile(null);
      getProductsAsync()


      if (inputRef?.current) inputRef.current.value = "";
      closeDialog();
      alert("Products uploaded successfully!");
    } catch {
      alert("Invalid JSON file");
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-products-dialog">
      <h2 className="mb-5 text-2xl font-semibold!">Upload Products</h2>
      <p className="mb-3 text-sm leading-[1.6] text-gray-500">
        This will permanently replace all existing product data in the database. Proceed?
      </p>
      <div className="text-xs mb-6 text-secondary-v3">{file?.name}</div>

      <div className="button-group flex justify-end gap-2">
        <ButtonDemo
          className=""
          text="Cancel"
          variant="outline"
          type="button"
          onClick={() => {
            closeDialog();
          }}
          disabled={loading}
        />

        <ButtonDemo
          variant="outlineDanger"
          text={`${loading ? "Submitting..." : "Submit"}`}
          onClick={handleFileUpload}
          className={``}
          disabled={loading}
        />
      </div>
    </div>
  );
};
