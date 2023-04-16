import { Button, Dialog, DialogActions, DialogTitle, IconButton } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import "./ImagesEditDialog.scss";
import { generateErrorMessage, generateSuccessMessage } from '../../../../common';
import Loading from '../../../Loading/Loading';
import { compressImage, fileToBase64 } from '../../../../services/utils';
import { compressedImageSizeInMb, maxCompressedImageWidth } from '../../../../constants';
import { notifyFetchFail } from '../../../../services/toastNotificationsService';
import { updateVehicleImages } from '../../../../services/vehiclesService';
export interface ImagesEditDialogProps {
    vehicleId: string,
    initialImages: string[],
    reloadVehicleCallback: Function,
    isOpen: boolean,
    onClose: Function,
}

const ImagesEditDialog: FC<ImagesEditDialogProps> = (props: ImagesEditDialogProps) => {

    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState(new Array<string>());
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (props.initialImages !== undefined)
            setImages(props.initialImages)
    }, [props.initialImages, props.isOpen]);

    function removeImage(toRemove: string) {
        var filteredImages = images.filter(image => image !== toRemove);
        setImages(filteredImages)
    }

    async function addImages(toAdd: FileList) {
        setLoading(true);
        var compressedImages = new Array<string>();
        var imageArray = Array.from(toAdd);

        for (var image of imageArray) {
            var compressedImage = await compressImage(image, compressedImageSizeInMb, maxCompressedImageWidth);
            var base64Image = image.name !== "" ? await fileToBase64(compressedImage) : "";
            compressedImages.push(base64Image);
        }
        
        setImages([...images, ...compressedImages]);
        setLoading(false);
    }

    function setVehicleImages() {
        setErrorMessage("");
        setSuccessMessage("");

        //disable buttons
        setLoading(true);
        updateVehicleImages(props.vehicleId, images)
            .then(async response => {
                if (response.status !== 200) {
                    setErrorMessage(await response.text());
                }
                else {
                    setSuccessMessage("Vehicle successfully updated!");
                    props.reloadVehicleCallback(true);
                }
            })
            .catch((err) => {
                notifyFetchFail(err);
            })
            .then(() => {
                setLoading(false);
            });
    }

    return (
        <Dialog open={props.isOpen} onClose={() => props.onClose()} PaperProps={{ sx: { width: "50em", maxHeight: "50em", maxWidth: "50em" } }}>
            {loading ? <Loading /> : <></>}

            <DialogTitle className="formTitle">Modify images</DialogTitle>
            <div className="imagesContainer">
                {
                    images.map((image) => (
                        <div className="imageContainer">
                            <img src={image} alt="Empty" className="vehicleImage" />
                            <IconButton className="imageButton" onClick={() => removeImage(image)}>
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    ))
                }
            </div>

            {generateErrorMessage(errorMessage)}
            {generateSuccessMessage(successMessage)}
            <DialogActions>
                <Button disabled={loading} variant="contained" component="label" 
                 sx={{marginLeft:"8px"}}>
                        Add images
                    <input type="file" hidden accept={"image/png, image/jpeg"} multiple={true}
                        onChange={(event) => event.target.files !== null ? addImages(event.target.files) : {}} />
                </Button>
                <Button disabled={loading} onClick={setVehicleImages} variant="contained" sx={{marginLeft:"8px"}}>
                    Save changes</Button>
                <Button disabled={loading} onClick={() => props.onClose()} variant="contained">Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ImagesEditDialog;
