import { Box, Button, Dialog, DialogActions, DialogTitle, MenuItem, Tab, Tabs, TextField } from '@mui/material';
import { FC, useState } from 'react';
import { generateErrorMessage, generateSuccessMessage, TabPanel } from '../../../common';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { addLocation, removeLocationById, updateLocationById } from '../../../redux/locationsStore';
import { postLocation, removeLocation, updateLocation } from '../../../services/locationsService';
import Loading from '../../Loading/Loading';
import './ManageLocationsDialog.scss';

interface ManageLocationsDialogProps {
  isOpen: boolean,
  onClose: Function,
}

const ManageLocationsDialog: FC<ManageLocationsDialogProps> = (props: ManageLocationsDialogProps) => {

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [addressValue, setAddressValue] = useState("");
  const [locationValue, setLocationValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const [cityError, setCityError] = useState(false);
  const [cityErrorText, setCityErrorText] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [addressErrorText, setAddressErrorText] = useState("");
  const [locationError, setLocationError] = useState(false);
  const [locationErrorText, setLocationErrorText] = useState("");

  const locations = useAppSelector((state) => state.location.locations);
  const dispatch = useAppDispatch();

  function clearErrors() {
    setErrorMessage("");
    setSuccessMessage("");

    setCityError(false);
    setCityErrorText("");
    setAddressError(false);
    setAddressErrorText("");
    setLocationError(false);
    setLocationErrorText("");
  }

  function addLocationClick() {
    clearErrors();

    var hasError = false;
    if (cityValue.trim() === "") {
      hasError = true;
      setCityError(true);
      setCityErrorText("Please input a city!");
    }

    if (addressValue.trim() === "") {
      hasError = true;
      setAddressError(true);
      setAddressErrorText("Please input an address!");
    }

    if (hasError)
      return;

    setLoading(true);

    postLocation(cityValue, addressValue)
      .then(async response => {
        var responseText = await response.text();
        if (response.status !== 200) {
          setErrorMessage(responseText !== "" ? responseText : response.statusText);
        }
        else {
          //add the location to the list manually to avoid an unnecessary fetch
          dispatch(addLocation({ id: responseText, city: cityValue, address: addressValue }));
          setSuccessMessage("Location successfully added!");
        }
      })
      .catch((err) => {
        if (err.message === "Failed to fetch") {
          setErrorMessage("The server is currently unavailable");
        }
        else {
          setErrorMessage("An unexpected error happened");
          console.log(err.message);
        }
      })
      .then(() => {
        setLoading(false)
      });
  }

  function removeLocationClick() {
    clearErrors();

    if (locationValue === "") {
      setLocationError(true);
      setLocationErrorText("Please select a location to delete!");
      return;
    }

    setLoading(true);
    removeLocation(locationValue)
      .then(async response => {
        var responseText = await response.text();
        if (response.status !== 200) {
          setErrorMessage(responseText !== "" ? responseText : response.statusText);
        }
        else {
          //remove the location from the list manually to avoid an unnecessary fetch
          setLocationValue('');
          dispatch(removeLocationById({ id: locationValue }));
          setSuccessMessage("Location successfully removed!");
        }
      })
      .catch((err) => {
        if (err.message === "Failed to fetch") {
          setErrorMessage("The server is currently unavailable");
        }
        else {
          setErrorMessage("An unexpected error happened");
          console.log(err.message);
        }
      })
      .then(() => {
        setLoading(false)
      });
  }

  function updateLocationClick() {
    clearErrors();

    var hasError = false;
    if (cityValue.trim() === "") {
      hasError = true;
      setCityError(true);
      setCityErrorText("Please input a city!");
    }

    if (addressValue.trim() === "") {
      hasError = true;
      setAddressError(true);
      setAddressErrorText("Please input an address!");
    }

    if (locationValue === "") {
      hasError = true;
      setLocationError(true);
      setLocationErrorText("Please select a location to update!");
      return;
    }

    if (hasError)
      return;

    setLoading(true);
    updateLocation(locationValue, cityValue, addressValue)
      .then(async response => {
        var responseText = await response.text();
        if (response.status !== 200) {
          setErrorMessage(responseText !== "" ? responseText : response.statusText);
        }
        else {
          //update the location manually to avoid an unnecessary fetch
          dispatch(updateLocationById({ id: locationValue, updatedCity: cityValue, updatedAddress: addressValue }));
          setSuccessMessage("Location successfully updated!");
        }
      })
      .catch((err) => {
        if (err.message === "Failed to fetch") {
          setErrorMessage("The server is currently unavailable");
        }
        else {
          setErrorMessage("An unexpected error happened");
          console.log(err.message);
        }
      })
      .then(() => {
        setLoading(false)
      });
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Dialog open={props.isOpen} onClose={() => props.onClose()} PaperProps={{ sx: { width: "50em" } }}>
      {loading ? <Loading /> : <></>}

      <DialogTitle className="formTitle">Manage locations</DialogTitle>
      <Box className="selectorBox">
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Add" />
          <Tab label="Modify" />
          <Tab label="Remove" />
        </Tabs>
      </Box>
      <TabPanel value={selectedTab} index={0}>
        <div className="splitDiv">
          <TextField value={cityValue} label="City" margin="dense" fullWidth autoFocus
            onChange={(event) => setCityValue(event.target.value)}
            error={cityError} helperText={cityErrorText}
            type="text" name="address" className="locationDialogField" />
          <TextField value={addressValue} label="Address" margin="dense" fullWidth autoFocus
            error={addressError} helperText={addressErrorText}
            onChange={(event) => setAddressValue(event.target.value)}
            type="text" name="address" className="locationDialogField" />
        </div>
        <div className="rightDiv" style={{ marginTop: 20 }}>
          <Button disabled={loading} onClick={addLocationClick} variant="contained" >Add</Button>
        </div>
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        <TextField value={locationValue} label="Select a location to modify" margin="dense" fullWidth autoFocus select
          onChange={(event) => setLocationValue(event.target.value)}
          error={locationError} helperText={locationErrorText}
          name="location" className="vehicleDialogField">
          {locations.map((location) => (
            <MenuItem key={location.city + ", " + location.address} value={location.id}>
              {location.city + ", " + location.address}
            </MenuItem>
          ))}
        </TextField>
        <div className="splitDiv">
          <TextField value={cityValue} label="City" margin="dense" fullWidth autoFocus
            onChange={(event) => setCityValue(event.target.value)}
            error={cityError} helperText={cityErrorText}
            type="text" name="address" className="locationDialogField" />
          <TextField value={addressValue} label="Address" margin="dense" fullWidth autoFocus
            error={addressError} helperText={addressErrorText}
            onChange={(event) => setAddressValue(event.target.value)}
            type="text" name="address" className="locationDialogField" />
        </div>
        <div className="rightDiv" style={{ marginTop: 20 }}>
          <Button disabled={loading} onClick={updateLocationClick} variant="contained">Update</Button>
        </div>
      </TabPanel>
      <TabPanel value={selectedTab} index={2}>
        <TextField value={locationValue} label="Select a location to remove" margin="dense" fullWidth autoFocus select
          onChange={(event) => setLocationValue(event.target.value)}
          error={locationError} helperText={locationErrorText}
          name="location" className="vehicleDialogField">
          {locations.map((location) => (
            <MenuItem key={location.city + ", " + location.address} value={location.id}>
              {location.city + ", " + location.address}
            </MenuItem>
          ))}
        </TextField>
        <div className="rightDiv" style={{ marginTop: 20 }}>
          <Button disabled={loading} onClick={removeLocationClick} variant="contained">Remove</Button>
        </div>
      </TabPanel>

      {generateErrorMessage(errorMessage)}
      {generateSuccessMessage(successMessage)}
      <DialogActions>
        <Button disabled={loading} onClick={() => props.onClose()} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ManageLocationsDialog;
