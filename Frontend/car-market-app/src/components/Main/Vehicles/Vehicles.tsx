import { Button } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import './Vehicles.scss';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddLocationDialog from '../AddLocationDialog/AddLocationDialog';
import AddVehicleDialog, { AddVehicleDialogProps } from '../AddVehicleDialog/AddVehicleDialog';
import Loading from '../../Loading/Loading';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { setLocations } from '../../../redux/locationsStore';
import { getLocations } from '../../../services/locationsService';
import { getAvailableVehicles } from '../../../services/vehiclesService';
import { setVehicles } from '../../../redux/vehiclesStore';
import { logout } from '../../../redux/userStore';
import VehicleItem from '../VehicleItem/VehicleItem';

interface VehiclesProps { }

interface LocationsModel {
  address: string
}

const Vehicles: FC<VehiclesProps> = () => {

  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = useAppSelector((state) => state.user.token);
  const locations = useAppSelector((state) => state.location.locations);
  const vehicles = useAppSelector((state) => state.vehicle.vehicles);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setLoading(true);
    getAvailableVehicles(token)
      .then(async (result) => {
        if (result.status === 200) {
          var json = await result.json();
          dispatch(setVehicles(json));
          setLoading(false);
        }
        else if (result.status === 401){
          dispatch(logout()); //TODO - fix this some other way
        }
        else{
          //TODO - notify fetch fail
        }
      });
  // eslint-disable-next-line 
  }, []);

  function openLocationDialog() {
    setLocationDialogOpen(true);
  }

  function closeLocationDialog() {
    setLocationDialogOpen(false);
  }

  const locationDialogProps = {
    isOpen: locationDialogOpen,
    onClose: closeLocationDialog
  }

  function openVehicleDialog() {
    setLoading(true);

    getLocations(token)
      .then(async response => {
        if (response.status !== 200) {
          throw new Error();
        }
        else {
          var json = await response.json();
          var locationsList = json.map((x: LocationsModel) => x.address);
          dispatch(setLocations(locationsList));
          setLoading(false);
          setVehicleDialogOpen(true);
        }
      })
      .catch((err) => {
        setLoading(false);
        return;
      })
    //TODO - notify fetch fail
  }

  function closeVehicleDialog() {
    setVehicleDialogOpen(false);
  }

  const vehicleDialogProps = {
    isOpen: vehicleDialogOpen,
    onClose: closeVehicleDialog,
    loadingCallback: setLoading,
    locations: locations,
  } as AddVehicleDialogProps;


  return (
    <div className="vehicles">
      {loading ? <Loading /> : <></>}
      <AddLocationDialog {...locationDialogProps} />
      <AddVehicleDialog {...vehicleDialogProps} />
      <div className="toolbar">
        <div className="toolbarButtons">
          <Button disabled={loading} variant="contained" startIcon={<AddCircleIcon />} onClick={openLocationDialog}>Add location</Button>
          <Button disabled={loading} variant="contained" startIcon={<AddCircleIcon />} onClick={openVehicleDialog}>Add vehicle</Button>
        </div>
      </div>
      <div className="vehiclesListContainer">
          {vehicles.map((vehicle) => (
            <div className="vehicleItemContainer" key={vehicle.id}>
              <VehicleItem vehicle={vehicle}/>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Vehicles;
