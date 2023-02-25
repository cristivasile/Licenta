import React, { FC, useState } from 'react';
import { VehicleModel } from '../../../models/VehicleModel';
import './VehicleItem.scss';
import defaultImage from "../../../assets/no-image.png";

interface VehicleItemProps {
  vehicle: VehicleModel
}

const VehicleItem: FC<VehicleItemProps> = (props: VehicleItemProps) => {
  const [image, setImage] = useState(props.vehicle.image);
  
  function setDefaultImage(){
    setImage(defaultImage);
  }

  return (
    <div className="vehicleItem">
      <div className="vehiclesHeader">
        <div className="vehicleName">
          {props.vehicle.brand + " " + props.vehicle.model}
        </div>
        <div className="vehiclePrice">
          {props.vehicle.price.toLocaleString() + "€"}
        </div>
      </div>
      <div className="vehicleImageContainer">
        <img src={image} alt="Empty" className="vehicleImage" onError={() => setDefaultImage()}/>
      </div>
      <div className="vehicleDescriptionContainer">
        <div className="vehicleDescriptionRow"> 
          <div><span className="descriptionTitle">Year: </span> {props.vehicle.year}</div>
          <div><span className="descriptionTitle">Odometer: </span> {props.vehicle.odometer.toLocaleString() + " km"}</div>
        </div>

        <div className="vehicleDescriptionRow"> 
          <div><span className="descriptionTitle">Engine size: </span> {props.vehicle.engineSize}</div>
          <div><span className="descriptionTitle">Power: </span> {props.vehicle.power + " hp"}</div>
        </div>
      </div>
    </div>
  );
}

export default VehicleItem;
