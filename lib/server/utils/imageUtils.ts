import sharp from "sharp";
const MAX_SIZE = 300 * 1024; // 300KB

// export const resizeImage = async ({
//   buffer,
//   // maxSize = 1024 * 1024, // 1mb
//   maxSize = MAX_SIZE, // 300kb
//   maxWidth = 1600,
//   quality = 80,
// }: any) => {
//   if (buffer.length <= maxSize) return buffer;

//   return sharp(buffer).resize({ width: maxWidth, withoutEnlargement: true }).webp({ quality }).toBuffer();
// };

export const resizeImage = async ({
  buffer,
  maxSize = MAX_SIZE, // 300KB
  maxWidth = 1600,
}: any) => {
  if (buffer.length <= maxSize) return buffer;

  let width = maxWidth;
  let quality = 80;

  let output = await sharp(buffer).resize({ width, withoutEnlargement: true }).webp({ quality }).toBuffer();

  while (output.length > maxSize) {
    if (quality > 40) {
      quality -= 10;
    } else {
      width = Math.floor(width * 0.9);
    }

    output = await sharp(buffer).resize({ width, withoutEnlargement: true }).webp({ quality }).toBuffer();

    // safety guard
    if (width < 400) break;
  }

  return output;
};
