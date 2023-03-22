import { Accordion, AccordionDetails, Button, Checkbox, FormControlLabel, MenuItem, Pagination, Select, TextField, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MenuIcon from '@mui/icons-material/Menu';
import AddVehicleDialog, { AddVehicleDialogProps } from './AddVehicleDialog/AddVehicleDialog';
import Loading from '../../Loading/Loading';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { setLocationsFromJson } from '../../../redux/locationsStore';
import { getLocations } from '../../../services/locationsService';
import { getAvailableVehicles, getVehicleTypesDictionary } from '../../../services/vehiclesService';
import { setVehiclesFromJson } from '../../../redux/vehiclesStore';
import VehicleItem from './VehicleItem/VehicleItem';
import { notifyBadResultCode, notifyFetchFail } from '../../../services/toastNotificationsService';
import { setFeaturesFromJson } from '../../../redux/featuresStore';
import { getFeatures } from '../../../services/featuresService';
import { getBodyTypes } from '../../../services/bodyTypeService.';
import { setBodyTypesFromJson } from '../../../redux/bodyTypesStore';
import { setVehicleTypesFromJson } from '../../../redux/vehicleTypesStore';
import { isAdmin } from '../../../services/authenticationService';
import './Vehicles.scss';
import AccordionSummary from '@mui/material/AccordionSummary';
import TuneIcon from '@mui/icons-material/Tune';
import { mapFromVehicleTypeList } from '../../../models/VehicleTypeModel';
import { transmissionTypesMap } from '../../../models/TransmissionTypeEnum';
import { sortTypesMap } from '../../../models/SortTypeEnumModel';
import ManageLocationsDialog from './ManageLocationsDialog/ManageLocationsDialog';
import ManageFeaturesDialog from './ManageFeaturesDialog/ManageFeaturesDialog';
import ManageBodyTypesDialog from './ManageBodyTypesDialog/ManageBodyTypesDialog';
import { VehicleFiltersModel } from '../../../models/VehicleModel';
import { setBodyTypeFilter, setBrandFilter, setMaxMileageFilter, setMaxPowerFilter, setMaxPriceFilter, setMinPowerFilter, setMinPriceFilter, 
  setMinYearFilter, setModelFilter, setSelectedPage, setSortAscending, setTransmissionFilter, setVehiclesPerPage } from '../../../redux/vehiclesMainFiltersStore';

interface VehiclesProps { }

const Vehicles: FC<VehiclesProps> = () => {

  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const showAdminCommands = isAdmin(useAppSelector((state) => state.user.role) || "");
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [featureDialogOpen, setFeatureDialogOpen] = useState(false);
  const [bodyTypeDialogOpen, setBodyTypeDialogOpen] = useState(false);
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);

  //get from redux store in order to keep state after navigating
  const selectedPage = useAppSelector((state) => state.vehiclesMainFiltersStore.selectedPage);
  const vehiclesPerPage = useAppSelector((state) => state.vehiclesMainFiltersStore.vehiclesPerPage);
  const [vehicleCount, setVehicleCount] = useState(0);
  const pageCount = Math.ceil(vehicleCount / vehiclesPerPage);
  const pageSizeOptions: number[] = [5, 10, 15, 20];

  //filter values, get from redux in order to keep state after navigating
  const brandFilter = useAppSelector((state) => state.vehiclesMainFiltersStore.brandFilter);
  const modelFilter = useAppSelector((state) => state.vehiclesMainFiltersStore.modelFilter);
  const bodyTypeFilter = useAppSelector((state) => state.vehiclesMainFiltersStore.bodyTypeFilter);
  const maxMileageFilter = useAppSelector((state) => state.vehiclesMainFiltersStore.maxMileageFilter);
  const minPriceFilter = useAppSelector((state) => state.vehiclesMainFiltersStore.minPriceFilter);
  const maxPriceFilter = useAppSelector((state) => state.vehiclesMainFiltersStore.maxPriceFilter);
  const minPowerFilter = useAppSelector((state) => state.vehiclesMainFiltersStore.minPowerFilter);
  const maxPowerFilter = useAppSelector((state) => state.vehiclesMainFiltersStore.maxPowerFilter);
  const minYearFilter = useAppSelector((state) => state.vehiclesMainFiltersStore.minYearFilter);
  const transmissionFilter = useAppSelector((state) => state.vehiclesMainFiltersStore.transmissionFilter);
  const sortType = useAppSelector((state) => state.vehiclesMainFiltersStore.sortType);
  const sortAscending = useAppSelector((state) => state.vehiclesMainFiltersStore.sortAscending);

  const bodyTypes = useAppSelector((state) => state.bodyType.bodyTypes);
  const vehicleTypesMap = mapFromVehicleTypeList(useAppSelector((state) => state.vehicleType.vehicleTypes));
  const brands = Array.from(vehicleTypesMap.keys());
  const transmissionTypes = Array.from(transmissionTypesMap.entries());
  const sortTypes = Array.from(sortTypesMap.entries());
  const [modelOptions, setModelOptions] = useState(new Array<string>());

  // Sets the 'Model' autocomplete options when the brand value is modified
  function handleBrandSelection(brand: string) {
    var options = vehicleTypesMap.get(brand) || new Array<string>();
    setModelOptions(options);
  }
  //collection values
  const vehicles = useAppSelector((state) => state.vehicle.vehicles);

  function fetchVehicles(currentPage: number = selectedPage, pageSize: number = vehiclesPerPage): void {
    var filters: VehicleFiltersModel = {
      startAt: (currentPage - 1) * vehiclesPerPage,
      numberToGet: pageSize,
      brand: brandFilter !== "" ? brandFilter : null,
      model: modelFilter !== "" ? modelFilter : null,
      bodyType: bodyTypeFilter !== "" ? bodyTypeFilter : null,
      maxMileage: !Number.isNaN(maxMileageFilter) ? maxMileageFilter : null,
      minPrice: !Number.isNaN(minPriceFilter) ? minPriceFilter : null,
      maxPrice: !Number.isNaN(maxPriceFilter) ? maxPriceFilter : null,
      minPower: !Number.isNaN(minPowerFilter) ? minPowerFilter : null,
      maxPower: !Number.isNaN(maxPowerFilter) ? maxPowerFilter : null,
      minYear: !Number.isNaN(minYearFilter) ? minYearFilter : null,
      transmissionType: transmissionFilter !== "" ? transmissionFilter : null,
      sort: sortType !== "" ? sortType : null,
      sortAsc: sortAscending
    };

    getAvailableVehicles(filters)
      .then(async (result) => {
        if (result.status === 200) {
          var json = await result.json();
          dispatch(setVehiclesFromJson(json.vehicles));
          setVehicleCount(json.totalCount);
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
    fetchVehicles(selectedPage);
    fetchData();

    async function fetchData() {
      try {
        //run fetches in parallel
        const [bodyTypeResponse, vehicleTypesResponse] = await Promise.all([
          getBodyTypes(), getVehicleTypesDictionary()
        ]);

        if (bodyTypeResponse.status !== 200)
          notifyBadResultCode(bodyTypeResponse.status);
        else if (vehicleTypesResponse.status !== 200)
          notifyBadResultCode(vehicleTypesResponse.status);
        else {
          var json = await bodyTypeResponse.json();
          dispatch(setBodyTypesFromJson(json));
          json = await vehicleTypesResponse.json();
          dispatch(setVehicleTypesFromJson(json));
        }
      }
      catch (err: any) {
        notifyFetchFail(err);
      }
    }
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

  const vehicleDialogProps = {
    isOpen: vehicleDialogOpen,
    onClose: closeVehicleDialog,
  } as AddVehicleDialogProps;

  function applyFilters() {
    setLoading(true);
    fetchVehicles(selectedPage);
  }

  function clearFilters() {
    dispatch(setBrandFilter(""));
    dispatch(setModelFilter(""));
    dispatch(setBodyTypeFilter(""));
    dispatch(setMaxMileageFilter(NaN));
    dispatch(setMinPriceFilter(NaN));
    dispatch(setMaxPriceFilter(NaN));
    dispatch(setMinPowerFilter(NaN));
    dispatch(setMaxPowerFilter(NaN));
    dispatch(setMinYearFilter(NaN));
    dispatch(setTransmissionFilter(""));
    dispatch(setSortTypeValue(""));
    dispatch(setSortAscending(true));
  }

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setSelectedPage(value));
    setLoading(true);
    fetchVehicles(value);
  };

  function handleNumericInput(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, isFloat = false): number {
    var value = event.target.value;
    var number;

    if (value !== "") {
      if (isFloat)
        number = parseFloat(value);
      else
        number = parseInt(value, 10);
    }
    else
      number = NaN;

    return number;
  }

  return (
    <div className="vehicles">
      <ManageLocationsDialog {...locationDialogProps} />
      <ManageFeaturesDialog {...featureDialogProps} />
      <ManageBodyTypesDialog {...bodyTypeDialogProps} />
      <AddVehicleDialog {...vehicleDialogProps} />
      {loading ? <Loading /> : <></>}

      <Accordion>
        <AccordionSummary>
          <TuneIcon color='primary' sx={{ marginRight: '5px' }} />
          <Typography>
            Filters
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <div style={{ width: "100%" }}>
            <div className="filtersDiv">
              <TextField value={brandFilter} label="Brand" margin="dense" fullWidth select
                onChange={(event) => { dispatch(setBrandFilter(event.target.value)); handleBrandSelection(event.target.value); }}
                name="BrandFilter" sx={{ width: "12em" }}>
                {brands.map((brand) => (
                  <MenuItem key={brand} value={brand}>
                    {brand}
                  </MenuItem>
                ))}
              </TextField>
              <TextField value={modelFilter} label="Model" margin="dense" fullWidth select
                onChange={(event) => dispatch(setModelFilter(event.target.value))}
                name="modelFilter" sx={{ width: "12em" }}>
                {modelOptions.map((model) => (
                  <MenuItem key={model} value={model}>
                    {model}
                  </MenuItem>
                ))}
              </TextField>
              <TextField value={bodyTypeFilter} label="Body type" margin="dense" fullWidth select
                onChange={(event) => dispatch(setBodyTypeFilter(event.target.value))}
                name="bodyTypeFilter" sx={{ width: "12em" }}>
                {bodyTypes.map((bodyType) => (
                  <MenuItem key={bodyType.name} value={bodyType.name}>
                    {bodyType.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField value={transmissionFilter} label="Transmission type" margin="dense" fullWidth select
                onChange={(event) => dispatch(setTransmissionFilter(event.target.value))}
                name="transmissionFilter" sx={{ width: "12em" }}>
                {transmissionTypes.map((type) => (
                  <MenuItem key={type[0]} value={type[1]}>
                    {type[0]}
                  </MenuItem>
                ))}
              </TextField>
              <div className="PriceGroup">
                <TextField value={minPriceFilter || ""} label="Min price" margin="dense"
                  onChange={(event) => dispatch(setMinPriceFilter(handleNumericInput(event)))}
                  type="number" name="minPrice" sx={{ width: "8em", marginRight: "5px" }} />
                <TextField value={maxPriceFilter || ""} label="Max price" margin="dense"
                  onChange={(event) => dispatch(setMaxPriceFilter(handleNumericInput(event)))}
                  type="number" name="maxPrice" sx={{ width: "8em" }} />
              </div>
              <div className="PowerGroup">
                <TextField value={minPowerFilter || ""} label="Min power" margin="dense"
                  onChange={(event) => dispatch(setMinPowerFilter(handleNumericInput(event)))}
                  type="number" name="minPower" sx={{ width: "8em", marginRight: "5px" }} />
                <TextField value={maxPowerFilter || ""} label="Max power" margin="dense"
                  onChange={(event) => dispatch(setMaxPowerFilter(handleNumericInput(event)))}
                  type="number" name="maxPower" sx={{ width: "8em" }} />
              </div>
              <div className="AgeGroup">
                <TextField value={maxMileageFilter || ""} label="Max mileage" margin="dense"
                  onChange={(event) => dispatch(setMaxMileageFilter(handleNumericInput(event)))}
                  type="number" name="maxMileage" sx={{ width: "10em", marginRight: "5px" }} />
                <TextField value={minYearFilter || ""} label="Min year" margin="dense"
                  onChange={(event) => dispatch(setMinYearFilter(handleNumericInput(event)))}
                  type="number" name="minYear" sx={{ width: "10em" }} />
              </div>
              <div className="SortGroup">
                <TextField value={sortType} label="Sort" margin="dense" fullWidth select
                  onChange={(event) => dispatch(setSortTypeValue(event.target.value))}
                  name="sortType" sx={{ width: "12em", marginRight: "15px" }}>
                  {sortTypes.map((type) => (
                    <MenuItem key={type[0]} value={type[1]}>
                      {type[0]}
                    </MenuItem>
                  ))}
                </TextField>
                <FormControlLabel control={
                  <Checkbox checked={sortAscending} onChange={(event) => dispatch(setSortAscending(event.target.checked))} />
                } label="Sort asc." />
              </div>
            </div>

            <div className="FilterButtonsDiv">
              <Button disabled={loading} onClick={clearFilters} variant="contained" sx={{ marginRight: "15px" }}>Clear filters</Button>
              <Button disabled={loading} onClick={applyFilters} variant="contained">Apply filters</Button>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* only display the admin toolbar for admins 
        NOTE - if somebody manually changes their role they can see the buttons but they can't use them because the requests will return 403 Unauthorized */
        showAdminCommands ?
          <div className="adminToolbar">
            <div className="adminToolbarButtonsDiv">
              <Button disabled={loading} sx={{ marginTop: ".4em", marginBottom: ".4em" }} variant="contained" startIcon={<AddCircleIcon />}
                onClick={openVehicleDialog}>Add vehicle</Button>
              <Button disabled={loading} sx={{ marginTop: ".4em", marginBottom: ".4em" }} variant="contained" startIcon={<MenuIcon />}
                onClick={openFeatureDialog}>Manage features</Button>
              <Button disabled={loading} sx={{ marginTop: ".4em", marginBottom: ".4em" }} variant="contained" startIcon={<MenuIcon />}
                onClick={openLocationDialog}>Manage locations</Button>
              <Button disabled={loading} sx={{ marginTop: ".4em", marginBottom: ".4em" }} variant="contained" startIcon={<MenuIcon />}
                onClick={openBodyTypeDialog}>Manage body types</Button>
            </div>
          </div>
          :
          <></>
      }
      <div className="paginationInfoContainer">
        <div>
          <Typography>
            {loading ? "Fetching..." :
              vehicleCount === 0 ? "The query returned 0 results."
                : "Displaying results " + ((selectedPage - 1) * vehiclesPerPage + 1) + " - "
                + ((selectedPage * vehiclesPerPage) < vehicleCount ? selectedPage * vehiclesPerPage : vehicleCount) + ":"}
          </Typography>
        </div>
        <div className="paginationSizeSelectorDiv">
          <Typography>
            Results per page:
          </Typography>
          <Select size="small" variant="standard"
            value={vehiclesPerPage} onChange={(event) => {
              dispatch(setVehiclesPerPage(event.target.value as number));
              setLoading(true); fetchVehicles(selectedPage, event.target.value as number)
            }}>
            {pageSizeOptions.map((pageSize) => (
              <MenuItem key={pageSize} value={pageSize}>
                {pageSize}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
      <div className="vehiclesListContainer">
        {vehicles.map((vehicle) => (
          <div className="vehicleItemContainer" key={vehicle.id}>
            <VehicleItem vehicle={vehicle} />
          </div>
        ))}
      </div>
      <div className="paginationSelectorContainer">
        <Pagination disabled={loading} count={pageCount} page={selectedPage} onChange={handlePageChange} color="primary" />
      </div>
    </div>
  );
}

export default Vehicles;
function setSortTypeValue(arg0: string): any {
  throw new Error('Function not implemented.');
}

