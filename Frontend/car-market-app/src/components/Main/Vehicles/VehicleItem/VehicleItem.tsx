import { FC, useState } from 'react';
import { SimplifiedVehicleModel } from '../../../../models/VehicleModel';
import { Typography } from '@mui/material';
import defaultImage from "../../../../assets/no-image.png";
import './VehicleItem.scss';

interface VehicleItemProps {
  navigateToVehicle: Function,
  vehicle: SimplifiedVehicleModel
}

const VehicleItem: FC<VehicleItemProps> = (props: VehicleItemProps) => {
  const [image, setImage] = useState(props.vehicle.thumbnail);

  return (
    <div className="vehicleItem" onClick={() => props.navigateToVehicle(props.vehicle.id)}>
      {props.vehicle.isSold ?
        <div className="soldVehicleMarkerContainer">
          <Typography className="soldVehicleMarker" fontSize={30}>
            Sold!
          </Typography>
        </div>
        : <></>
      }
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
