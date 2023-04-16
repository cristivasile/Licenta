import { Dialog, IconButton } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import "./ImageGalleryDialog.scss";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
export interface ImageGalleryDialogProps {
  vehicleImages: string[],
  inheritedSelectedImageIndex: number,
  isOpen: boolean,
  onClose: Function,
}

const ImageGalleryDialog: FC<ImageGalleryDialogProps> = (props: ImageGalleryDialogProps) => {

  const [images, setImages] = useState(new Array<string>());
  const [image, setImage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageCount, setImageCount] = useState(0);

  useEffect(() => {
    if (props.vehicleImages !== undefined && props.inheritedSelectedImageIndex !== undefined) {
      setImages(props.vehicleImages);
      setImage(props.vehicleImages[props.inheritedSelectedImageIndex]);
      setSelectedImageIndex(props.inheritedSelectedImageIndex);
      setImageCount(props.vehicleImages.length);
    }
  }, [images, props]);

  function setPreviousImage() {
    setImage(images[selectedImageIndex - 1]);
    setSelectedImageIndex(selectedImageIndex - 1);
  }

  function setNextImage() {
    setImage(images[selectedImageIndex + 1]);
    setSelectedImageIndex(selectedImageIndex + 1);
  }

  return (
    <Dialog open={props.isOpen} onClose={() => props.onClose()} PaperProps={{ sx: { width: "90%", height: "90%", maxWidth: "90%", backgroundColor:"transparent" } }}>
      <div className="galleryContent">
        <img src={image} alt="Empty" className="vehicleGalleryImage" />
        <IconButton color="primary" size="large" disabled={selectedImageIndex === 0} onClick={setPreviousImage} className="arrow leftArrow">
          <KeyboardArrowLeftIcon />
        </IconButton>
        <IconButton color="primary" size="large" disabled={selectedImageIndex >= (imageCount - 1)} onClick={setNextImage} className="arrow rightArrow">
          <KeyboardArrowRightIcon />
        </IconButton>
      </div>
    </Dialog>
  );
}

export default ImageGalleryDialog;
