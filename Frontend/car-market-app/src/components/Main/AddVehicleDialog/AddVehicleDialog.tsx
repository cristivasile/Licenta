import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, MenuItem, TextField } from '@mui/material';
import React, { FC, useState } from 'react';
import { generateErrorMessage, generateSuccessMessage } from '../../../common';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { setVehiclesFromJson } from '../../../redux/vehiclesStore';
import { generateToastError, notifyFetchFail } from '../../../services/toastNotificationsService';
import { getAvailableVehicles, postVehicle, VehicleAddModel } from '../../../services/vehiclesService';
import { compressImage, fileToBase64 } from '../../../services/utils';
import Loading from '../../Loading/Loading';
import './AddVehicleDialog.scss';

export interface AddVehicleDialogProps {
  isOpen: boolean,
  onClose: Function,
  loadingCallback: Function,
}

const AddVehicleDialog: FC<AddVehicleDialogProps> = (props: AddVehicleDialogProps) => {

  const today = new Date();
  const locations = useAppSelector((state) => state.location.locations);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [brandValue, setBrandValue] = useState("");
  const [modelValue, setModelValue] = useState("");
  const [priceValue, setPriceValue] = useState(NaN);
  const [yearValue, setYearValue] = useState(NaN);
  const [engineSizeValue, setEngineSizeValue] = useState(NaN);
  const [powerValue, setPowerValue] = useState(NaN);
  const [odometerValue, setOdometerValue] = useState(NaN);
  const [locationValue, setLocationValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [imageValue, setImageValue] = useState(new File([""], ""));

  const [brandError, setBrandError] = useState(false);
  const [brandErrorText, setBrandErrorText] = useState("");
  const [modelError, setModelError] = useState(false);
  const [modelErrorText, setModelErrorText] = useState("");
  const [yearError, setYearError] = useState(false);
  const [yearErrorText, setYearErrorText] = useState("");
  const [odometerError, setOdometerError] = useState(false);
  const [odometerErrorText, setOdometerErrorText] = useState("");
  const [engineSizeError, setEngineSizeError] = useState(false);
  const [engineSizeErrorText, setEngineSizeErorrText] = useState("");
  const [powerError, setPowerError] = useState(false);
  const [powerErrorText, setPowerErrorText] = useState("");
  const [locationError, setLocationError] = useState(false);
  const [locationErrorText, setLocationErrorText] = useState("");
  const [priceError, setPriceError] = useState(false);
  const [priceErrorText, setPriceErrorText] = useState("");

  const dispatch = useAppDispatch();

  function clearMessages() {
    setErrorMessage("");
    setSuccessMessage("");
    setBrandError(false);
    setBrandErrorText("");
    setModelError(false);
    setModelErrorText("");
    setYearError(false);
    setYearErrorText("");
    setOdometerError(false);
    setOdometerErrorText("");
    setEngineSizeError(false);
    setEngineSizeErorrText("");
    setPowerError(false);
    setPowerErrorText("");
    setLocationError(false);
    setLocationErrorText("");
    setPriceError(false);
    setPriceErrorText("");
  }

  function clearInputs() {
    setBrandValue("");
    setModelValue("");
    setYearValue(NaN);
    setPriceValue(NaN);
    setEngineSizeValue(NaN);
    setPowerValue(NaN);
    setOdometerValue(NaN);
    setLocationValue("");
    setDescriptionValue("");
    setImageValue(new File([""], ""));
  }

  function validate() {
    var hasError = false;
    if (modelValue.trim() === "") {
      setModelError(true);
      setModelErrorText("This field is mandatory!");
      hasError = true;
    }
    if (brandValue.trim() === "") {
      setBrandError(true);
      setBrandErrorText("This field is mandatory!");
      hasError = true;
    }
    if (locationValue.trim() === "") {
      setLocationError(true);
      setLocationErrorText("This field is mandatory!");
      hasError = true;
    }

    if (Number.isNaN(yearValue)) {
      setYearError(true);
      setYearErrorText("This field is mandatory!");
      hasError = true;
    }
    else if (yearValue <= 1886) {
      setYearError(true);
      setYearErrorText("Year cannot be smaller than 1886");
      hasError = true;
    }
    else if (yearValue >= today.getFullYear()) {
      setYearError(true);
      setYearErrorText("Year cannot be bigger than " + today.getFullYear());
      hasError = true;
    }

    if (Number.isNaN(odometerValue)) {
      setOdometerError(true);
      setOdometerErrorText("This field is mandatory!");
      hasError = true;
    }
    if (Number.isNaN(powerValue)) {
      setPowerError(true);
      setPowerErrorText("This field is mandatory!");
      hasError = true;
    }
    if (Number.isNaN(engineSizeValue)) {
      setEngineSizeError(true);
      setEngineSizeErorrText("This field is mandatory!");
      hasError = true;
    }
    if (Number.isNaN(priceValue)) {
      setPriceError(true);
      setPriceErrorText("This field is mandatory!");
      hasError = true;
    }

    return !hasError;
  }

  async function addVehicle() {
    clearMessages();

    if (!validate()) //don't send a request if validation fails
      return;

    setLoading(true);

    if (imageValue.size !== 0) {
      var compressedImage = await compressImage(imageValue, .5, 1024);  //compress the image in order to save bandwidth and reduce loading times
      var base64Image = imageValue.name !== "" ? await fileToBase64(compressedImage) : "";
    }
    else {
      base64Image = "";
    }

    var newVehicle: VehicleAddModel = {   //TODO - implement features
      image: base64Image,
      brand: brandValue,
      model: modelValue,
      description: descriptionValue,
      address: locationValue,
      odometer: odometerValue,
      year: yearValue,
      engineSize: engineSizeValue,
      power: powerValue,
      features: [],
      price: priceValue
    };

    postVehicle(newVehicle)
      .then(async response => {
        if (response.status !== 200) {
          var text = await response.text();
          setErrorMessage(text !== "" ? text : response.statusText);
        }
        else {
          setSuccessMessage("Vehicle successfully added!");
          clearInputs();

          //notify the user that the vehicles list is loading
          props.loadingCallback(true);

          //refresh the vehciles list
          getAvailableVehicles()
            .then(async (response) => {
              if (response.status === 200) {
                var json = await response.json();
                dispatch(setVehiclesFromJson(json));
              }
              else {
                generateToastError("The server returned " + response.status + ", please refresh the page manually!", 5000);
              }
            })
            .catch((err) => {
              notifyFetchFail(err);
            })
            .then(() => {
              props.loadingCallback(false);
            })
        }
      })
      .catch((err) => {
        notifyFetchFail(err);
      })
      .then(() => {
        setLoading(false);
      });
  }

  function handleNumericInput(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<number>>, isFloat = false) {
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

    setter(number);
  }

  return (
    <Dialog open={props.isOpen} onClose={() => { clearMessages(); props.onClose(); }} PaperProps={{ sx: { width: "50em" } }}>
      {loading ? <Loading /> : <></>}
      <DialogTitle className="formTitle">Add a new vehicle</DialogTitle>
      <DialogContent>
        <div className="splitDiv">
          <Button disabled={loading} variant="contained" component="label" className="addImageButton">
            Add image
            <input type="file" hidden accept={"image/png, image/jpeg"}
              onChange={(event) => event.target.files !== null ? setImageValue(event.target.files![0]) : {}} />
          </Button>
          <div>
            {imageValue.name !== "" ? imageValue.name : "No image selected"}
          </div>
        </div>

        <div className="splitDiv">
          <TextField value={brandValue} label="Brand*" margin="dense" fullWidth autoFocus
            onChange={(event) => setBrandValue(event.target.value)}
            type="text" name="brand" className="splitDialogField"
            error={brandError} helperText={brandErrorText} />
          <TextField value={modelValue} label="Model*" margin="dense" fullWidth autoFocus
            onChange={(event) => setModelValue(event.target.value)}
            type="text" name="model" className="splitDialogField"
            error={modelError} helperText={modelErrorText} />
        </div>
        <div className="splitDiv">
          <TextField value={yearValue || ""} label="Year*" margin="dense" fullWidth autoFocus
            onChange={(event) => handleNumericInput(event, setYearValue)}
            type="number" name="year" className="splitDialogField"
            error={yearError} helperText={yearErrorText} />
          <TextField value={odometerValue || ""} label="Odometer*" margin="dense" fullWidth autoFocus
            onChange={(event) => handleNumericInput(event, setOdometerValue)}
            type="number" name="odometer" className="splitDialogField"
            InputProps={{
              endAdornment: <InputAdornment position="end">km</InputAdornment>,
            }}
            error={odometerError} helperText={odometerErrorText} />
        </div>
        <div className="splitDiv">
          <TextField value={engineSizeValue || ""} label="Engine size*" margin="dense" fullWidth autoFocus
            onChange={(event) => handleNumericInput(event, setEngineSizeValue)}
            type="number" name="engineSize" className="splitDialogField"
            error={engineSizeError} helperText={engineSizeErrorText} />
          <TextField value={powerValue || ""} label="Power*" margin="dense" fullWidth autoFocus
            onChange={(event) => handleNumericInput(event, setPowerValue)}
            type="number" name="power" className="splitDialogField"
            InputProps={{
              endAdornment: <InputAdornment position="end">hp</InputAdornment>,
            }}
            error={powerError} helperText={powerErrorText} />
        </div>
        <div className="splitDiv">
          <TextField value={locationValue} label="Location*" margin="dense" fullWidth autoFocus select
            onChange={(event) => setLocationValue(event.target.value)}
            name="location" className="splitDialogField"
            error={locationError} helperText={locationErrorText}>
            {locations.map((location) => (
              <MenuItem key={location.city + ", " + location.address} value={location.id}>
                {location.city + ", " + location.address}
              </MenuItem>
            ))}
          </TextField>
          <TextField value={priceValue || ""} label="Price*" margin="dense" fullWidth autoFocus
            onChange={(event) => handleNumericInput(event, setPriceValue, true)}
            type="number" name="price" className="splitDialogField"
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
            }}
            error={priceError} helperText={priceErrorText} />
        </div>
        <div className="fullDiv">
          <TextField value={descriptionValue || ""} label="Description" margin="dense" fullWidth autoFocus
            onChange={(event) => setDescriptionValue(event.target.value)}
            multiline minRows={3} maxRows={5} name="description" className="vehicleDialogField" />
        </div>
      </DialogContent>
      {generateErrorMessage(errorMessage)}
      {generateSuccessMessage(successMessage)}
      <DialogActions>
        <Button disabled={loading} onClick={() => { clearMessages(); props.onClose(); }} variant="contained">Cancel</Button>
        <Button disabled={loading} onClick={addVehicle} variant="contained">Add</Button>
      </DialogActions>
    </Dialog>
  );
}



export default AddVehicleDialog;
