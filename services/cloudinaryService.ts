import cloudinary from "@/lib/cloudinary/config/cloudinary";

type CreateImageParams = {
  buffer: Buffer;
  folderPath: string;
  publicId: string;
};

export const createImage = async ({ buffer, folderPath, publicId }: CreateImageParams) => {
  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: folderPath,
          public_id: publicId,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      )
      .end(buffer);
  });

  return result;
};

export const deleteImage = async ({ publicId }:{publicId: string}) => {
  const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });
  
  return result;
};

export const deleteImages = async ({ publicIds }:{publicIds: string[]}) => {
  const result = await cloudinary.api.delete_resources(publicIds, {
    resource_type: "image",
    invalidate: true,
  });

  return result;
};

export const deleteImagesAndFolder = async ({ folderPath }:{folderPath: string;}) => {
  const result = await cloudinary.api.delete_resources_by_prefix(folderPath);

  await cloudinary.api.delete_folder(folderPath);

  return result;
};
