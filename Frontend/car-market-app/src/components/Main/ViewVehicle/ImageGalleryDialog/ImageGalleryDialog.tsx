import { Dialog, IconButton } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import "./ImageGalleryDialog.scss";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
export interface ImageGalleryDialogProps {
  getImages: Function,
  getSelectedImage: Function,
  isOpen: boolean,
  onClose: Function,
}

const ImageGalleryDialog: FC<ImageGalleryDialogProps> = (props: ImageGalleryDialogProps) => {

  const [images, setImages] = useState(new Array<string>());
  const [image, setImage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageCount, setImageCount] = useState(0);

  useEffect(() => {
    var vehicleImages = props.getImages();
    var selectedImage = props.getSelectedImage();

    if (vehicleImages !== undefined && selectedImage !== undefined) {
      setImages(vehicleImages);
      setImage(vehicleImages[selectedImage]);
      setSelectedImageIndex(selectedImage);
      setImageCount(vehicleImages.length);
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
    <Dialog open={props.isOpen} onClose={() => props.onClose()} PaperProps={{ sx: { width: "90%", height: "90%", maxWidth: "90%" } }}>
      <div className="galleryContent">
        <img src={image} alt="Empty" className="vehicleGalleryImage" />
        <IconButton color="primary" size="large" disabled={selectedImageIndex === 0} onClick={setPreviousImage} className="leftArrow">
          <KeyboardArrowLeftIcon />
        </IconButton>
        <IconButton color="primary" size="large" disabled={selectedImageIndex >= (imageCount - 1)} onClick={setNextImage} className="rightArrow">
          <KeyboardArrowRightIcon />
        </IconButton>
      </div>
    </Dialog>
  );
}

export default ImageGalleryDialog;
