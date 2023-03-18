import imageCompression from "browser-image-compression";

/**
 * Compresses an image in order to save bandwidth and storage space
 * @param file - the image to be compressed 
 * @param maxSize - max size of the compressed image, in Mb
 * @param maxDimension - max width or height of the compressed image
 */
export const compressImage = async (file: File, maxSize: number, maxDimension: number): Promise<File> => {
  
  const compressionOptions = {
    maxSizeMB: maxSize,
    maxWidthOrHeight: maxDimension
  }
  const compressedFile = await imageCompression(file, compressionOptions);
  return compressedFile;
}

/**
 * Connverts an image to a base64 string
 */
export const fileToBase64 = (file: File | Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
     resolve(reader.result as string);
    };

    reader.readAsDataURL(file);
    reader.onerror = reject;
  });