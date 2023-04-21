import { Button, IconButton, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DetailedVehicleModel, mapJsonToDetailedVehicleModel } from '../../../models/VehicleModel';
import { notifyBadResultCode, notifyFetchFail } from '../../../services/toastNotificationsService';
import { getImagesByVehicleId, getVehicleById, getVehicleTypesDictionary, sellVehicle } from '../../../services/vehiclesService';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Loading from '../../Loading/Loading';
import defaultImage from "../../../assets/no-image.png";
import './ViewVehicle.scss';
import ImageGalleryDialog from './ImageGalleryDialog/ImageGalleryDialog';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { isAdmin } from '../../../services/authenticationService';
import SellVehicleDialog from './SellVehicleDialog/SellVehicleDialog';
import { getDateTimeDate } from '../../../services/utils';
import VehicleDialog from '../VehicleDialog/VehicleDialog';
import { getLocations } from '../../../services/locationsService';
import { getBodyTypes } from '../../../services/bodyTypeService.';
import { getFeatures } from '../../../services/featuresService';
import { setLocationsFromJson } from '../../../redux/locationsStore';
import { setBodyTypesFromJson } from '../../../redux/bodyTypesStore';
import { setFeaturesFromJson } from '../../../redux/featuresStore';
import { setVehicleTypesFromJson } from '../../../redux/vehicleTypesStore';
import ImagesEditDialog from './ImagesEditDialog/ImagesEditDialog';
import { deleteAppointment, getAppointmentByVehicleId } from '../../../services/appointmentService';
import { AppointmentModel, jsonToAppointmentModel } from '../../../models/AppointmentModel';
import AppointmentDialog from './AppointmentDialog/AppointmentDialog';

interface ViewVehicleProps { }

const ViewVehicle: FC<ViewVehicleProps> = () => {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [vehicle, setVehicle] = useState({} as DetailedVehicleModel)
  const [image, setImage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageCount, setImageCount] = useState(0);
  const [imageGalleryOpen, setImageGalleryOpen] = useState(false);
  const [imagesEditDialogOpen, setImagesEditDialogOpen] = useState(false);
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [hasAppointment, setHasAppointment] = useState(false);
  const [appointment, setAppointment] = useState({} as AppointmentModel);
  const userIsAdmin = isAdmin(useAppSelector((state) => state.user.role) as string);

  const appointmentDateOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  } as Intl.DateTimeFormatOptions;

  async function loadAppointment() {
    setLoading(true);
    await getAppointmentByVehicleId(id as string)
      .then(async response => {
        if (response.status === 200) {
          var json = await response.json();
          setAppointment(jsonToAppointmentModel(json));
          setHasAppointment(true);  
        }
        else {
          setHasAppointment(false);
        }
      })
      .catch((err) => {
        notifyFetchFail(err);
        return;
      })
      .then(() => {
        setLoading(false);
      });
  }

  async function loadVehicle(loadImages: boolean) {
    setLoading(true);
    await getVehicleById(id as string)
      .then(async response => {
        if (response.status !== 200) {
          notifyBadResultCode(response.status);
        }
        else {
          var json = await response.json();
          setVehicle(mapJsonToDetailedVehicleModel(json));
          setImagesLoading(loadImages);

          if (json.thumbnail !== undefined && json.thumbnail.length !== 0) {  //set thumbnail as preview until the images arrive
            setImage(json.thumbnail);
          }
        }
      })
      .catch((err) => {
        notifyFetchFail(err);
        return;
      })
      .then(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    loadAppointment();
    loadVehicle(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //after re-render, if vehicle changed and images are marked as loading run images fetch
  useEffect(() => {
    if (imagesLoading) {
      getImagesByVehicleId(id as string)
        .then(async response => {
          if (response.status !== 200) {
            notifyBadResultCode(response.status);
          }
          else {
            var json = await response.json();
            setImagesLoading(false);

            if (json !== undefined && json.length !== 0) {
              var updatedVehicle = vehicle;
              updatedVehicle.images = json;
              setImageCount(json.length);
              setVehicle(updatedVehicle);
              setImage(json[0]);
            }
          }
        })
        .catch((err) => {
          notifyFetchFail(err);
          return;
        })
        .then(() => {
          setImagesLoading(false);
        });
    }

  }, [vehicle, id, imagesLoading]);

  async function openImageGallery() {
    if (vehicle.images !== undefined && vehicle.images.length > 0 && imagesLoading !== true)
      setImageGalleryOpen(true);
  }

  function closeImageGallery() {
    setImageGalleryOpen(false);
  }

  async function openImagesEditDialog() {
    if (vehicle.images !== undefined && vehicle.images.length > 0 && imagesLoading !== true)
      setImagesEditDialogOpen(true);
  }

  function closeImagesEditDialog() {
    setImagesEditDialogOpen(false);
  }

  function openSellDialog() {
    setSellDialogOpen(true);
  }

  function closeSellDialog() {
    setSellDialogOpen(false);
  }

  function openAppointmentDialog() {
    setAppointmentDialogOpen(true);
  }

  function closeAppointmentDialog() {
    setAppointmentDialogOpen(false);
  }

  function setPreviousImage() {
    setImage(vehicle.images[selectedImageIndex - 1]);
    setSelectedImageIndex(selectedImageIndex - 1);
  }

  function setNextImage() {
    setImage(vehicle.images[selectedImageIndex + 1]);
    setSelectedImageIndex(selectedImageIndex + 1);
  }

  function undoSale() {
    //disable buttons
    setLoading(true);
    sellVehicle(vehicle.id, null, false)
      .then(async response => {
        if (response.status !== 200) {
          notifyBadResultCode(response.status);
        }
        else {
          loadVehicle(false);
        }
      })
      .catch((err) => {
        notifyFetchFail(err);
        return;
      })
      .then(() => {
        setLoading(false);
      });
  }

  async function openVehicleDialog() {
    setLoading(true);

    try {
      //run fetches in parallel
      const [locationResponse, bodyTypeResponse, featuresResponse, vehicleTypesResponse] = await Promise.all([
        getLocations(), getBodyTypes(), getFeatures(), getVehicleTypesDictionary()
      ]);

      if (locationResponse.status !== 200)
        notifyBadResultCode(locationResponse.status);
      else if (bodyTypeResponse.status !== 200)
        notifyBadResultCode(bodyTypeResponse.status);
      else if (featuresResponse.status !== 200)
        notifyBadResultCode(featuresResponse.status);
      else if (vehicleTypesResponse.status !== 200)
        notifyBadResultCode(vehicleTypesResponse.status);
      else {
        var json = await locationResponse.json();
        dispatch(setLocationsFromJson(json));
        json = await bodyTypeResponse.json();
        dispatch(setBodyTypesFromJson(json));
        json = await featuresResponse.json();
        dispatch(setFeaturesFromJson(json));
        json = await vehicleTypesResponse.json();
        dispatch(setVehicleTypesFromJson(json));

        setVehicleDialogOpen(true);
      }
    }
    catch (err: any) {
      notifyFetchFail(err);
    }

    setLoading(false);
  }

  function closeVehicleDialog() {
    setVehicleDialogOpen(false);
  }

  function cancelAppointmentClick() {
    setLoading(true);

    deleteAppointment(appointment.id)
      .then(async response => {
        if (response.status !== 200) {
          notifyBadResultCode(response.status);
        }
        else {

          setHasAppointment(false);
          setAppointment({} as AppointmentModel);
        }
      })
      .catch((err) => {
        notifyFetchFail(err);
        return;
      })
      .then(() => {
        setLoading(false);
      });
  }

  function goBackToMain() {
    navigate("../../");
  }

  return (
    <div className="ViewVehicle">
      {userIsAdmin ?
        <SellVehicleDialog reloadVehicleCallback={loadVehicle} vehicleId={vehicle.id}
          isOpen={sellDialogOpen} onClose={closeSellDialog} />
        :
        <AppointmentDialog reloadAppointmentCallback={loadAppointment}
          locationId = {vehicle.location !== undefined ? vehicle.location.id : ""}
          vehicleId = {vehicle.id}
          isOpen={appointmentDialogOpen} onClose={closeAppointmentDialog} />}
      {userIsAdmin ? <ImagesEditDialog initialImages={vehicle.images} isOpen={imagesEditDialogOpen}
        onClose={closeImagesEditDialog} reloadVehicleCallback={loadVehicle} vehicleId={vehicle.id} />
        : <></>}
      {userIsAdmin ? <VehicleDialog isOpen={vehicleDialogOpen} onClose={closeVehicleDialog}
        forUpdate={true} vehicle={vehicle} reloadVehicleCallback={loadVehicle} />
        : <></>}
      <ImageGalleryDialog isOpen={imageGalleryOpen} onClose={closeImageGallery}
        vehicleImages={vehicle.images} inheritedSelectedImageIndex={selectedImageIndex} />
      {loading ? <Loading /> : <></>}
      <div className="buttonContainer">
        <Button variant="contained" sx={{ marginLeft: ".3em", marginTop: ".3em" }} size="large"
          startIcon={<ArrowBackIosIcon />} onClick={goBackToMain}>
          Main page
        </Button>
      </div>
      {
        vehicle.status ?
          vehicle.status.isSold === false || userIsAdmin ? //admins can view sold vehicles
            <>
              <div className="vehicleHeaderContainer">
                <div className="headerDetailsContainer">
                  <Typography fontSize={36}>
                    {vehicle.brand + " " + vehicle.model}
                  </Typography>
                  <Typography fontSize={36}>
                    {vehicle.price + "€"}
                  </Typography>
                </div>
                <div className="horizontalDivider" />
              </div>

              <div className="viewVehicleContent">
                {vehicle.status.isSold === true ? //inform admin that the vehicle is sold
                  <div className="vehicleMessageContainer">
                    <Typography fontSize={18}>
                      <>This vehicle was sold to {vehicle.status.purchasedBy} on {getDateTimeDate(vehicle.status.dateSold as Date)}</>
                    </Typography>
                  </div>
                  : <></>
                }
                {hasAppointment === true ? //inform user that he has a reservation
                  <div className="vehicleMessageContainer">
                    <Typography fontSize={18}>
                      <>You have a(n) upcoming {appointment.appointmentTypeName} on {appointment.date.toLocaleDateString('en-UK', appointmentDateOptions)}</>
                    </Typography>
                  </div>
                  : <></>
                }
                <div className="viewVehicleRow">
                  <div className="vehicleImageGalleryContainer">
                    <IconButton color="primary" disabled={selectedImageIndex === 0} onClick={setPreviousImage}>
                      <KeyboardArrowLeftIcon />
                    </IconButton>
                    <div className="vehicleImageContainer" onClick={openImageGallery}>
                      {imagesLoading ? <Loading /> : <></>}
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
                        <Typography fontSize={17}>
                          <span className="title">Year: </span> {vehicle.year}
                        </Typography>
                      </div>
                      <div className="detailsRow">
                        <Typography fontSize={17}>
                          <span className="title">Odometer: </span> {vehicle.odometer.toLocaleString() + " km"}
                        </Typography>
                      </div>
                      <div className="detailsRow">
                        <Typography fontSize={17}>
                          <span className="title">Transmission: </span> {vehicle.transmissionType}
                        </Typography>
                      </div>
                      <div className="detailsRow">
                        <Typography fontSize={17}>
                          <span className="title">Body type: </span> {vehicle.bodyType}
                        </Typography>
                      </div>
                      <div className="detailsRow">
                        <Typography fontSize={17}>
                          <span className="title">Power: </span> {vehicle.power + " hp"}
                        </Typography>
                      </div>
                      <div className="detailsRow">
                        <Typography fontSize={17}>
                          <span className="title">Torque: </span> {vehicle.torque + " Nm"}
                        </Typography>
                      </div>
                      {
                        vehicle.engineSize !== null ?
                          <div className="detailsRow">
                            <Typography fontSize={17}>
                              <span className="title">Engine size: </span> {vehicle.engineSize + " cc"}
                            </Typography>
                          </div>
                          :
                          <></>
                      }
                      <div className="detailsRow">
                        <Typography fontSize={17}>
                          <span className="title">Power train: </span> {vehicle.powerTrainType}
                        </Typography>
                      </div>
                      <div className="detailsRow">
                        <Typography fontSize={17}>
                          <span className="title">Drive train: </span> {vehicle.driveTrainType}
                        </Typography>
                      </div>
                      <div className="detailsRow">
                        <Typography fontSize={17}>
                          <span className="title">Location: </span> {vehicle.location.city + ", " + vehicle.location.address}
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
                            <li className="feature" key={feature.id}>
                              <Typography fontSize={17}>
                                {feature.name}
                              </Typography>
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                  </div>

                  { /* Only display description container for vehicles with descriptions */
                    vehicle.description !== null && vehicle.description !== "" ?
                      <div className="vehicleDescriptionContainer">
                        <Typography fontSize={25} className="title">
                          Description
                        </Typography>

                        <div className="horizontalDivider" />

                        <div className="description">
                          {
                            vehicle.description.split('\n').map((description) => (
                              /* split by \n because Typography doesnt understand /n chars */
                              <Typography fontSize={17}>
                                {description}
                              </Typography>
                            ))
                          }
                        </div>
                      </div>
                      :
                      <></>
                  }
                </div>

                <div className="contentButtonsContainer">
                  {
                    userIsAdmin ?
                      <>
                        <Button disabled={loading} variant="contained" onClick={openImagesEditDialog}
                          sx={{ marginRight: "1em", marginBottom: "1%" }}>
                          Modify images
                        </Button>
                        <Button disabled={loading} variant="contained" onClick={openVehicleDialog}
                          sx={{ marginRight: "1em", marginBottom: "1%" }}>
                          Modify vehicle
                        </Button>
                        {
                          vehicle.status.isSold ?
                            <Button disabled={loading} variant="contained" onClick={undoSale} sx={{ marginRight: "1%", marginBottom: "1%" }}>
                              Undo sale
                            </Button>
                            :
                            <Button disabled={loading} variant="contained" onClick={openSellDialog} sx={{ marginRight: "1%", marginBottom: "1%" }}>
                              Set sold
                            </Button>
                        }
                      </>

                      :
                      <>
                      {
                        hasAppointment?
                        <Button disabled={loading} variant="contained" onClick={cancelAppointmentClick}
                        sx={{ marginRight: "1em", marginBottom: "1%" }}>
                        Cancel appointment
                        </Button>
                        :
                        <Button disabled={loading} variant="contained" onClick={openAppointmentDialog}
                          sx={{ marginRight: "1em", marginBottom: "1%" }}>
                          Make an appointment
                        </Button>
                      }

                      </>
                  }

                </div>
              </div>
            </>
            :
            <div className="vehicleSoldMessage">
              <Typography fontSize={30}>
                The vehicle you are looking for was sold!
              </Typography>

            </div>
          :
          <>{/* vehicle is not yet defined, display nothing */}</>
      }


    </div >
  );
}

export default ViewVehicle;