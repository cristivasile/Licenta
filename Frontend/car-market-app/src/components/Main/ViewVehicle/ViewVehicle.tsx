import { Button, IconButton, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DetailedVehicleModel, mapJsonToDetailedVehicleModel } from '../../../models/VehicleModel';
import { notifyBadResultCode, notifyFetchFail } from '../../../services/toastNotificationsService';
import { getVehicleById } from '../../../services/vehiclesService';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Loading from '../../Loading/Loading';
import defaultImage from "../../../assets/no-image.png";
import './ViewVehicle.scss';
import ImageGalleryDialog, { ImageGalleryDialogProps } from './ImageGalleryDialog/ImageGalleryDialog';

interface ViewVehicleProps { }

const ViewVehicle: FC<ViewVehicleProps> = () => {

  const navigate = useNavigate();

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [vehicle, setVehicle] = useState({} as DetailedVehicleModel)
  const [image, setImage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageCount, setImageCount] = useState(0);
  const [imageGalleryOpen, setImageGalleryOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    getVehicleById(id as string)
      .then(async response => {
        if (response.status !== 200) {
          notifyBadResultCode(response.status);
        }
        else {
          var json = await response.json();
          setVehicle(mapJsonToDetailedVehicleModel(json));

          if (json.images.length > 0)
            setImage(json.images[0]);

          setImageCount(json.images.length);
        }
      })
      .catch((err) => {
        notifyFetchFail(err);
        return;
      })
      .then(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function openImageGallery() {
    setImageGalleryOpen(true);
  }

  function closeImageGallery() {
    setImageGalleryOpen(false);
  }

  function getSelectedImage(): number {
    return selectedImageIndex;
  }

  function getImages(): string[] {
    return vehicle.images;
  }

  const imageGalleryProps = {
    isOpen: imageGalleryOpen,
    getImages: getImages,
    getSelectedImage: getSelectedImage,
    onClose: closeImageGallery,
  } as ImageGalleryDialogProps;

  function setPreviousImage() {
    setImage(vehicle.images[selectedImageIndex - 1]);
    setSelectedImageIndex(selectedImageIndex - 1);
  }

  function setNextImage() {
    setImage(vehicle.images[selectedImageIndex + 1]);
    setSelectedImageIndex(selectedImageIndex + 1);
  }

  function goBackToMain() {
    navigate("../../");
  }

  return (
    <div className="ViewVehicle">
      <ImageGalleryDialog {...imageGalleryProps} />
      {loading ? <Loading /> : <></>}
      <div className="buttonContainer">
        <Button variant="outlined" sx={{ marginLeft: ".3em", marginTop: ".3em" }} size="large" startIcon={<ArrowBackIosIcon />} onClick={goBackToMain}>
          Back
        </Button>
      </div>
      {
        vehicle.status ?
          vehicle.status.isSold === false ?
            <div className="viewVehicleContent">
              <div className="headerContainer">
                <Typography fontSize={36} className="title">
                  {vehicle.brand + " " + vehicle.model}
                </Typography>
              </div>

              <div className="viewVehicleRow">
                <div className="vehicleImageGalleryContainer">
                  <IconButton color="primary" disabled={selectedImageIndex === 0} onClick={setPreviousImage}>
                    <KeyboardArrowLeftIcon />
                  </IconButton>
                  <div className="vehicleImageContainer" onClick={openImageGallery}>
                    <img src={image} alt="Empty" className="vehicleImage" onError={() => setImage(defaultImage)} />
                  </div>
                  <IconButton color="primary" disabled={selectedImageIndex >= (imageCount - 1)} onClick={setNextImage}>
                    <KeyboardArrowRightIcon />
                  </IconButton>
                </div>
                <div className="vehicleDetailsContainer">
                  <Typography fontSize={25} className="title">
                    Details
                  </Typography>
                  <div className="horizontalDivider" />

                  <div className="detailsDiv">
                    <div className="detailsRow">
                      <Typography fontSize={16}>
                        <span className="title">Year: </span> {vehicle.year}
                      </Typography>
                    </div>
                    <div className="detailsRow">
                      <Typography fontSize={16}>
                        <span className="title">Odometer: </span> {vehicle.odometer.toLocaleString() + " km"}
                      </Typography>
                    </div>
                    <div className="detailsRow">
                      <Typography fontSize={16}>
                        <span className="title">Transmission: </span> {vehicle.transmissionType}
                      </Typography>
                    </div>
                    <div className="detailsRow">
                      <Typography fontSize={16}>
                        <span className="title">Body type: </span> {vehicle.bodyType}
                      </Typography>
                    </div>
                    <div className="detailsRow">
                      <Typography fontSize={16}>
                        <span className="title">Power: </span> {vehicle.power + " hp"}
                      </Typography>
                    </div>
                    <div className="detailsRow">
                      <Typography fontSize={16}>
                        <span className="title">Torque: </span> {vehicle.torque + " Nm"}
                      </Typography>
                    </div>
                    {
                      vehicle.engineSize !== null ?
                        <div className="detailsRow">
                          <Typography fontSize={16}>
                            <span className="title">Engine size: </span> {vehicle.engineSize + " cc"}
                          </Typography>
                        </div>
                        :
                        <></>
                    }
                    <div className="detailsRow">
                      <Typography fontSize={16}>
                        <span className="title">Power train: </span> {vehicle.powerTrainType}
                      </Typography>
                    </div>
                    <div className="detailsRow">
                      <Typography fontSize={16}>
                        <span className="title">Drive train: </span> {vehicle.driveTrainType}
                      </Typography>
                    </div>
                    <div className="detailsRow">
                      <Typography fontSize={16}>
                        <span className="title">Location: </span> {vehicle.locationAddress}
                      </Typography>
                    </div>
                  </div>
                </div>

                <div className="vehicleDetailsContainer">
                  <Typography fontSize={25} className="title">
                    Features
                  </Typography>

                  <div className="horizontalDivider" />

                  <div className="featuresListContainer">
                    <ul>
                      {
                        vehicle.features.sort((x1, x2) => x1.name > x2.name ? 1 : -1).map((feature) => (
                          <li className="feature">
                            <Typography fontSize={16}>
                              {feature.name}
                            </Typography>
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                </div>

                {
                  vehicle.description !== null && vehicle.description !== "" ?
                  <div className="vehicleDescriptionContainer">
                  </div>
                  :
                  <></>
                }

              </div>
            </div>
            :
            <>{/* TODO - put 'vehicle was sold' here */}</>
          :
          <>{/* vehicle is not yet defined, display nothing */}</>
      }


    </div >
  );
}

export default ViewVehicle;