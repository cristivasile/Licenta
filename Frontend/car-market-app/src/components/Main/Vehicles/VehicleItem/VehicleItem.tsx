import { FC, useState } from 'react';
import { ShortVehicleModel } from '../../../../models/VehicleModel';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import defaultImage from "../../../../assets/no-image.png";
import './VehicleItem.scss';

interface VehicleItemProps {
  vehicle: ShortVehicleModel
}

const VehicleItem: FC<VehicleItemProps> = (props: VehicleItemProps) => {
  const [image, setImage] = useState(props.vehicle.image);
  
  const navigate = useNavigate();

  function navigateToVehicle(){
    navigate("./view/" + props.vehicle.id);
  }

  return (
    <div className="vehicleItem" onClick={navigateToVehicle}>
      <div className="vehicleHeader">
        <div className="vehicleName">
          {props.vehicle.brand + " " + props.vehicle.model}
        </div>
      </div>
      <div className="vehicleDetails">
        <div className="vehicleImageContainer">
          <img src={image} alt="Empty" className="vehicleImage" onError={() => setImage(defaultImage)} />
        </div>
        <div className="vehicleDescriptionContainer">

          <div className="vehicleDescriptionColumn">
            <div className="descriptionRow">
              <Typography fontSize={18}>
                <span className="descriptionTitle">Year: </span> {props.vehicle.year}
              </Typography>
            </div>
            <div className="descriptionRow">
              <Typography fontSize={18}>
                <span className="descriptionTitle">Odometer: </span> {props.vehicle.odometer.toLocaleString() + " km"}
              </Typography>
            </div>
          </div>

          <div className="vehicleDescriptionColumn">
            <div className="descriptionRow">
              <Typography fontSize={18}>
                <span className="descriptionTitle">Body type: </span> {props.vehicle.bodyType}
              </Typography>
            </div>
            <div className="descriptionRow">
              <Typography fontSize={18}>
                <span className="descriptionTitle">Transmission: </span> {props.vehicle.transmissionType}
              </Typography>
            </div>
          </div>

          <div className="vehicleDescriptionColumn">
            <div className="descriptionRow">
              <Typography fontSize={18}>
                <span className="descriptionTitle">Power: </span> {props.vehicle.power + " hp"}
              </Typography>
            </div>
            <div className="descriptionRow">
              <Typography fontSize={18}>
                <span className="descriptionTitle">Torque: </span> {props.vehicle.torque + " Nm"}
              </Typography>
            </div>
            <div className="descriptionRow">
              <Typography fontSize={18}>
                <span className="descriptionTitle">Engine size: </span>
                {(Math.round((props.vehicle.engineSize) / 100) / 10).toFixed(1) + "L"}
              </Typography>
            </div>
          </div>

          <div className="vehiclePriceContainer">
            <Typography fontSize={26} className="priceTypography">
              {props.vehicle.price.toLocaleString() + "€"}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleItem;
