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


/** 
 * Capitalizes the first letter of a given string and makes the rest lowercase
 */
export const capitalizeFirstLetter = (input: string): string => {
  if (input.length === 0)
    return "";

  return input[0].toUpperCase() + input.substring(1).toLowerCase();
}

/**
 * Formats a datetime to return dd/MM/YYYY
 * @param date 
 */
export const getDateTimeDate = (date: Date): string => {

  const convertedDate = new Date(date);

  const day = convertedDate.getDate();
  const monthIndex = convertedDate.getMonth();
  const year = convertedDate.getFullYear();

  return day + '/' + (monthIndex < 10 ? '0' : '') + (monthIndex + 1) + '/' + year;
}

export const handleNumericInput = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, 
                                    setter: React.Dispatch<React.SetStateAction<number>>, isFloat = false): void => {
  var value = event.target.value;
  var number;

  if (value !== "") {
    if (isFloat)
      number = parseFloat(value);
    else
      number = parseInt(value, 10);
  }
  else
    number = NaN;

  setter(number);
}