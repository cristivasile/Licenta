import { Button, Pagination } from '@mui/material';
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
import { getAvailableVehicles, getVehicleTypesDictionary, VehicleFiltersModel } from '../../../services/vehiclesService';
import { setVehiclesFromJson } from '../../../redux/vehiclesStore';
import VehicleItem from '../VehicleItem/VehicleItem';
import { notifyBadResultCode, notifyFetchFail } from '../../../services/toastNotificationsService';
import ManageFeaturesDialog from '../ManageFeaturesDialog/ManageFeaturesDialog';
import { setFeaturesFromJson } from '../../../redux/featuresStore';
import { getFeatures } from '../../../services/featuresService';
import { getBodyTypes } from '../../../services/bodyTypeService.';
import { setBodyTypesFromJson } from '../../../redux/bodyTypesStore';
import ManageBodyTypesDialog from '../ManageBodyTypesDialog/ManageBodyTypesDialog';
import { setVehicleTypesFromJson } from '../../../redux/vehicleTypesStore';
import { isAdmin } from '../../../services/authenticationService';

interface VehiclesProps { }

const vehiclesPerPage: number = 5;

const Vehicles: FC<VehiclesProps> = () => {

  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [featureDialogOpen, setFeatureDialogOpen] = useState(false);
  const [bodyTypeDialogOpen, setBodyTypeDialogOpen] = useState(false);
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState(1);
  const [selectedPage, setSelectedPage] = useState(1);
  const pageCount = Math.ceil(vehicleNumber / vehiclesPerPage);

  const [loading, setLoading] = useState(false);
  const vehicles = useAppSelector((state) => state.vehicle.vehicles);
  const showAdminCommands = isAdmin(useAppSelector((state) => state.user.role) || "");
  const dispatch = useAppDispatch();

  function fetchVehicles (selectedPage: number): void
  {
    var filters: VehicleFiltersModel = {
      startAt: (selectedPage - 1) * vehiclesPerPage,
      numberToGet: vehiclesPerPage,
      brand: null,
      model: null,
      bodyType: null,
      maxMileage: null,
      minPrice: null,
      maxPrice: null,
      minYear: null,
      sort: null,
      sortAsc: true
    };

    getAvailableVehicles(filters)
    .then(async (result) => {
      if (result.status === 200) {
        var json = await result.json();
        dispatch(setVehiclesFromJson(json.vehicles));
        setVehicleNumber(json.totalCount);
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
  }

  useEffect(() => {
    setLoading(true);
    fetchVehicles(1);
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

  function openBodyTypeDialog() {
    setLoading(true);

    getBodyTypes()
      .then(async response => {
        if (response.status !== 200) {
          notifyBadResultCode(response.status);
        }
        else {
          var json = await response.json();
          dispatch(setBodyTypesFromJson(json));
          setBodyTypeDialogOpen(true);
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

  function closeBodyTypeDialog() {
    setBodyTypeDialogOpen(false);
  }

  const bodyTypeDialogProps = {
    isOpen: bodyTypeDialogOpen,
    onClose: closeBodyTypeDialog
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
      else
      {
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

  const vehicleDialogProps = {
    isOpen: vehicleDialogOpen,
    onClose: closeVehicleDialog,
    loadingCallback: setLoading,
  } as AddVehicleDialogProps;

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setSelectedPage(value);
    setLoading(true);
    fetchVehicles(value);
  };

  return (
    <div className="vehicles">
      {loading ? <Loading /> : <></>}
      <ManageLocationsDialog {...locationDialogProps} />
      <ManageFeaturesDialog {...featureDialogProps} />
      <ManageBodyTypesDialog {...bodyTypeDialogProps} />
      <AddVehicleDialog {...vehicleDialogProps} />
      {/* only display the admin toolbar for admins 
        NOTE - if somebody manually changes their role they can see the menus but they can't use them because the requests will return 403 */
        showAdminCommands ?
          <div className="adminToolbar">
            <div className="adminToolbarButtons">
              <Button disabled={loading} variant="contained" startIcon={<AddCircleIcon />} onClick={openVehicleDialog}>Add vehicle</Button>
              <Button disabled={loading} variant="contained" startIcon={<MenuIcon />} onClick={openFeatureDialog}>Manage features</Button>
              <Button disabled={loading} variant="contained" startIcon={<MenuIcon />} onClick={openLocationDialog}>Manage locations</Button>
              <Button disabled={loading} variant="contained" startIcon={<MenuIcon />} onClick={openBodyTypeDialog}>Manage body types</Button>
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
      <div className="paginationContainer">
        <Pagination disabled={loading} count={pageCount} page={selectedPage} onChange={handlePageChange} color="primary"/>
      </div>
    </div>
  );
}

export default Vehicles;
