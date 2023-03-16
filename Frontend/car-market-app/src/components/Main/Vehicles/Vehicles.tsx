import { Button } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import './Vehicles.scss';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MenuIcon from '@mui/icons-material/Menu';
import ManageLocationsDialog from '../ManageLocationsDialog/ManageLocationsDialog';
import AddVehicleDialog, { AddVehicleDialogProps } from '../AddVehicleDialog/AddVehicleDialog';
import Loading from '../../Loading/Loading';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { setLocationsFromJson } from '../../../redux/locationsStore';
import { getLocations } from '../../../services/locationsService';
import { getAvailableVehicles } from '../../../services/vehiclesService';
import { setVehiclesFromJson } from '../../../redux/vehiclesStore';
import VehicleItem from '../VehicleItem/VehicleItem';
import { notifyBadResultCode, notifyFetchFail } from '../../../services/toastNotificationsService';
import ManageFeaturesDialog from '../ManageFeaturesDialog/ManageFeaturesDialog';
import { setFeaturesFromJson } from '../../../redux/featuresStore';
import { getFeatures } from '../../../services/featuresService';

interface VehiclesProps { }

const adminRoleSet = new Set<string>(["admin", "sysadmin"]);
/**
 * Checks whether the current user is an admin
 * @param role the user's role
 */
function isAdmin(role: string): boolean {
  if (adminRoleSet.has(role.toLowerCase()))
    return true;
  return false;
}

const Vehicles: FC<VehiclesProps> = () => {

  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [featureDialogOpen, setFeatureDialogOpen] = useState(false);
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const vehicles = useAppSelector((state) => state.vehicle.vehicles);
  const showAdminCommands = isAdmin(useAppSelector((state) => state.user.role) || "");
  const dispatch = useAppDispatch();

  useEffect(() => {
    setLoading(true);
    getAvailableVehicles()
      .then(async (result) => {
        if (result.status === 200) {
          var json = await result.json();
          dispatch(setVehiclesFromJson(json));
        }
        else {
          notifyBadResultCode(result.status);
        }
      })            
      .catch((err) => {
        notifyFetchFail(err);
      })
      .then(() => {
        setLoading(false);
      });
    // eslint-disable-next-line 
  }, []);

  function openLocationDialog() {
    setLoading(true);

    getLocations()
    .then(async response => {
      if (response.status !== 200) {
        notifyBadResultCode(response.status);
      }
      else {
        var json = await response.json();
        dispatch(setLocationsFromJson(json));
        setLocationDialogOpen(true);
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

  function closeLocationDialog() {
    setLocationDialogOpen(false);
  }

  const locationDialogProps = {
    isOpen: locationDialogOpen,
    onClose: closeLocationDialog
  }

  function openFeatureDialog() {
    setLoading(true);

    getFeatures()
    .then(async response => {
      if (response.status !== 200) {
        notifyBadResultCode(response.status);
      }
      else {
        var json = await response.json();
        dispatch(setFeaturesFromJson(json));
        setFeatureDialogOpen(true);
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

  function closeFeatureDialog() {
    setFeatureDialogOpen(false);
  }

  const featureDialogProps = {
    isOpen: featureDialogOpen,
    onClose: closeFeatureDialog
  }

  function openVehicleDialog() {
    setLoading(true);

    getLocations()
      .then(async response => {
        if (response.status !== 200) {
          notifyBadResultCode(response.status);
        }
        else {
          var json = await response.json();
          dispatch(setLocationsFromJson(json));
          setVehicleDialogOpen(true);
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

  function closeVehicleDialog() {
    setVehicleDialogOpen(false);
  }

  const vehicleDialogProps = {
    isOpen: vehicleDialogOpen,
    onClose: closeVehicleDialog,
    loadingCallback: setLoading,
  } as AddVehicleDialogProps;

  return (
    <div className="vehicles">
      {loading ? <Loading /> : <></>}
      <ManageLocationsDialog {...locationDialogProps} />
      <ManageFeaturesDialog {...featureDialogProps} />
      <AddVehicleDialog {...vehicleDialogProps} />
      {/* only display the admin toolbar for admins 
        NOTE - if somebody manually changes their role they can see the menus but they can't use them because the requests will return 403 */
        showAdminCommands ?
          <div className="adminToolbar">
            <div className="adminToolbarButtons">
              <Button disabled={loading} variant="contained" startIcon={<MenuIcon />} onClick={openLocationDialog}>Manage locations</Button>
              <Button disabled={loading} variant="contained" startIcon={<MenuIcon />} onClick={openFeatureDialog}>Manage features</Button>
              <Button disabled={loading} variant="contained" startIcon={<AddCircleIcon />} onClick={openVehicleDialog}>Add vehicle</Button>
            </div>
          </div>
          :
          <></>
      }
      <div className="vehiclesListContainer">
        {vehicles.map((vehicle) => (
          <div className="vehicleItemContainer" key={vehicle.id}>
            <VehicleItem vehicle={vehicle} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Vehicles;
