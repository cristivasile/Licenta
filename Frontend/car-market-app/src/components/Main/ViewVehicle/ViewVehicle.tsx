import { Button, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DetailedVehicleModel, mapJsonToDetailedVehicleModel } from '../../../models/VehicleModel';
import { notifyBadResultCode, notifyFetchFail } from '../../../services/toastNotificationsService';
import { getVehicleById } from '../../../services/vehiclesService';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Loading from '../../Loading/Loading';
import defaultImage from "../../../assets/no-image.png";
import './ViewVehicle.scss';

interface ViewVehicleProps { }

const ViewVehicle: FC<ViewVehicleProps> = () => {

  const navigate = useNavigate();

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [vehicle, setVehicle] = useState({} as DetailedVehicleModel)

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
          setImage(json.image);
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

  function goBackToMain() {
    navigate("../../");
  }

  return (
    <div className="ViewVehicle">
      {loading ? <Loading /> : <></>}
      <div className="buttonContainer">
        <Button variant="outlined" sx={{ marginLeft: ".3em", marginTop: ".3em" }} size="large" startIcon={<ArrowBackIosNewIcon />} onClick={goBackToMain}>
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
                <div className="vehicleImageContainer">
                  <img src={image} alt="Empty" className="vehicleImage" onError={() => setImage(defaultImage)} />
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
              </div>
            </div>
            :
            <>{/* TODO - put 'vehicle was sold' here */}</>
          :
          <>{/* vehicle is not yet defined, display nothing */}</>
      }


    </div>
  );
}

export default ViewVehicle;