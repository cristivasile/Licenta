import { Button } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DetailedVehicleModel, mapJsonToDetailedVehicleModel } from '../../../models/VehicleModel';
import { notifyBadResultCode, notifyFetchFail } from '../../../services/toastNotificationsService';
import { getVehicleById } from '../../../services/vehiclesService';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Loading from '../../Loading/Loading';
import './ViewVehicle.scss';

interface ViewVehicleProps { }

const ViewVehicle: FC<ViewVehicleProps> = () => {

  const navigate = useNavigate();

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
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
      <div className="backButtonContainer">
        <Button variant="text" size="large" startIcon={<ArrowBackIosNewIcon />} onClick={goBackToMain}>
          Back
        </Button>
      </div>

    </div>
  );
}

export default ViewVehicle;
