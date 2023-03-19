import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, MenuItem, TextField, Autocomplete, FormControl, InputLabel, Select, OutlinedInput, ListItemText, Checkbox } from '@mui/material';
import { FC, useState } from 'react';
import { generateErrorMessage, generateSuccessMessage } from '../../../common';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { setVehiclesFromJson } from '../../../redux/vehiclesStore';
import { generateToastError, notifyFetchFail } from '../../../services/toastNotificationsService';
import { getAvailableVehicles, postVehicle, VehicleCreateModel } from '../../../services/vehiclesService';
import { capitalizeFirstLetter, compressImage, fileToBase64 } from '../../../services/utils';
import { dictFromVehicleTypeList as mapFromVehicleTypeList } from '../../../models/VehicleTypeModel';
import { driveTrainsMap, DriveTrainTypeEnum } from '../../../models/DriveTrainTypeEnum';
import { powerTrainsMap, PowerTrainTypeEnum } from '../../../models/PowerTrainTypeEnum';
import Loading from '../../Loading/Loading';
import defaultImage from "../../../assets/no-image.png";
import './AddVehicleDialog.scss';

export interface AddVehicleDialogProps {
  isOpen: boolean,
  onClose: Function,
  loadingCallback: Function,
}

const compressedImageSizeInMb: number = 0.5; 
const maxCompressedImageWidth: number = 1024;
const compressedThumbnailSizeInMb: number = 0.05; 
const maxCompressedThumbnailWidth: number = 256;

const AddVehicleDialog: FC<AddVehicleDialogProps> = (props: AddVehicleDialogProps) => {

  const today = new Date();
  const locations = useAppSelector((state) => state.location.locations);
  const bodyTypes = useAppSelector((state) => state.bodyType.bodyTypes);
  const features = useAppSelector((state) => state.feature.features);
  const vehicleTypesMap = mapFromVehicleTypeList(useAppSelector((state) => state.vehicleType.vehicleTypes));
  const driveTrains = Array.from(driveTrainsMap.entries());
  const powerTrains = Array.from(powerTrainsMap.entries());

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [brandValue, setBrandValue] = useState("");
  const [modelValue, setModelValue] = useState("");
  const [bodyTypeValue, setBodyTypeValue] = useState("");
  const [priceValue, setPriceValue] = useState(NaN);
  const [yearValue, setYearValue] = useState(NaN);
  const [engineSizeValue, setEngineSizeValue] = useState(NaN);
  const [powerValue, setPowerValue] = useState(NaN);
  const [torqueValue, setTorqueValue] = useState(NaN);
  const [odometerValue, setOdometerValue] = useState(NaN);
  const [locationValue, setLocationValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [imageValue, setImageValue] = useState(new File([""], ""));
  const [featuresValue, setFeaturesValue] = useState(new Array<string>());
  const [driveTrainValue, setDriveTrainValue] = useState(DriveTrainTypeEnum.FWD);
  const [powerTrainValue, setPowerTrainValue] = useState(PowerTrainTypeEnum.Diesel);

  const [brandError, setBrandError] = useState(false);
  const [brandErrorText, setBrandErrorText] = useState("");
  const [modelError, setModelError] = useState(false);
  const [modelErrorText, setModelErrorText] = useState("");
  const [bodyTypeError, setBodyTypeError] = useState(false);
  const [bodyTypeErrorText, setBodyTypeErrorText] = useState("");
  const [yearError, setYearError] = useState(false);
  const [yearErrorText, setYearErrorText] = useState("");
  const [odometerError, setOdometerError] = useState(false);
  const [odometerErrorText, setOdometerErrorText] = useState("");
  const [engineSizeError, setEngineSizeError] = useState(false);
  const [engineSizeErrorText, setEngineSizeErorrText] = useState("");
  const [powerError, setPowerError] = useState(false);
  const [powerErrorText, setPowerErrorText] = useState("");
  const [torqueError, setTorqueError] = useState(false);
  const [torqueErrorText, setTorqueErrorText] = useState("");
  const [locationError, setLocationError] = useState(false);
  const [locationErrorText, setLocationErrorText] = useState("");
  const [priceError, setPriceError] = useState(false);
  const [priceErrorText, setPriceErrorText] = useState("");
  const [vehicleModelOptions, setVehicleModelOptions] = useState(new Array<string>());

  const dispatch = useAppDispatch();

  // Sets the 'Model' autocomplete options when the brand value is modified
  function handleBrandSelection(brand: string) {
    brand = capitalizeFirstLetter(brand);
    var options = vehicleTypesMap.get(brand) || new Array<string>();
    setVehicleModelOptions(options);
  }

  function clearMessages() {
    setErrorMessage("");
    setSuccessMessage("");
    setBrandError(false);
    setBrandErrorText("");
    setModelError(false);
    setModelErrorText("");
    setBodyTypeError(false);
    setBodyTypeErrorText("");
    setYearError(false);
    setYearErrorText("");
    setOdometerError(false);
    setOdometerErrorText("");
    setEngineSizeError(false);
    setEngineSizeErorrText("");
    setPowerError(false);
    setPowerErrorText("");
    setTorqueError(false);
    setTorqueErrorText("");
    setLocationError(false);
    setLocationErrorText("");
    setPriceError(false);
    setPriceErrorText("");
  }

  function clearInputs() {
    setBrandValue("");
    setModelValue("");
    setBodyTypeValue("");
    setYearValue(NaN);
    setPriceValue(NaN);
    setEngineSizeValue(NaN);
    setPowerValue(NaN);
    setTorqueValue(NaN);
    setOdometerValue(NaN);
    setLocationValue("");
    setDescriptionValue("");
    setImageValue(new File([""], ""));
    setFeaturesValue(new Array<string>());
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
    if (bodyTypeValue.trim() === "") {
      setBodyTypeError(true);
      setBodyTypeErrorText("This field is mandatory!");
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
    if (Number.isNaN(torqueValue)) {
      setTorqueError(true);
      setTorqueErrorText("This field is mandatory!");
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
      //compress the image in order to save bandwidth and reduce loading times
      var compressedImage = await compressImage(imageValue, compressedImageSizeInMb, maxCompressedImageWidth);  
      var base64Image = imageValue.name !== "" ? await fileToBase64(compressedImage) : "";

      //compress the image further to use as thumbnail
      var compressedThumbnailImage = await compressImage(imageValue, compressedThumbnailSizeInMb, maxCompressedThumbnailWidth);  
      var base64ThumbnailImage = imageValue.name !== "" ? await fileToBase64(compressedThumbnailImage) : "";
    }
    else {
      base64Image = "";
      base64ThumbnailImage = "";
    }

    var newVehicle: VehicleCreateModel = {
      image: base64Image,
      thumbnailImage: base64ThumbnailImage,
      brand: brandValue,
      model: modelValue,
      bodyType: bodyTypeValue,
      description: descriptionValue,
      address: locationValue,
      odometer: odometerValue,
      year: yearValue,
      engineSize: Number.isNaN(engineSizeValue) ? null : engineSizeValue, //engine size can be empty
      locationId: locationValue,
      power: powerValue,
      torque: torqueValue,
      features: featuresValue,
      price: priceValue,
      driveTrain: driveTrainValue,
      powerTrain: powerTrainValue,
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
        }
      })
      .catch((err) => {
        notifyFetchFail(err);
      })
      .then(() => {
        setLoading(false);
      });
  }

  function getImage(imageValue: File | Blob): string {
    if (imageValue.size !== 0) 
      return URL.createObjectURL(imageValue);
    else
      return defaultImage;
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
          <div id="imageInfoDiv">
            <div>
              {imageValue.name !== "" ? imageValue.name : "No image selected"}
            </div>
            <div id="previewImageDiv">
              <img src={getImage(imageValue)} alt="" id="previewImage" />
            </div>
          </div>
        </div>

        <div className="splitDiv">
          <Autocomplete value={brandValue} fullWidth freeSolo className="thirdSplitDialogField"
            options={Array.from(vehicleTypesMap.keys())} sx={{ marginTop: '8px' }}
            onChange={(_, value) => 
              {setBrandValue(value || '');
              handleBrandSelection(value || "")}}
            renderInput={(params) =>
              <TextField {...params} autoFocus
                onChange={(event) => {
                  setBrandValue(event.target.value);
                  handleBrandSelection(event.target.value)
                }}
                error={brandError} helperText={brandErrorText} label="Brand*" />} />
          <Autocomplete value={modelValue} fullWidth freeSolo className="thirdSplitDialogField"
            options={vehicleModelOptions} sx={{ marginTop: '8px' }}
            onChange={(_, value) => setModelValue(value || '')}
            renderInput={(params) =>
              <TextField {...params} onChange={(event) => setModelValue(event.target.value)}
                error={modelError} helperText={modelErrorText} label="Model*" />} />
          <TextField value={bodyTypeValue} label="Body type*" margin="dense" fullWidth autoFocus select
            onChange={(event) => setBodyTypeValue(event.target.value)}
            name="bodyType" className="thirdSplitDialogField"
            error={bodyTypeError} helperText={bodyTypeErrorText}>
            {bodyTypes.map((bodyType) => (
              <MenuItem key={bodyType.name} value={bodyType.name}>
                {bodyType.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="splitDiv">
          <TextField value={yearValue || ""} label="Year*" margin="dense" fullWidth
            onChange={(event) => handleNumericInput(event, setYearValue)}
            type="number" name="year" className="halfSplitDialogField"
            error={yearError} helperText={yearErrorText} />
          <TextField value={odometerValue || ""} label="Odometer*" margin="dense" fullWidth
            onChange={(event) => handleNumericInput(event, setOdometerValue)}
            type="number" name="odometer" className="halfSplitDialogField"
            InputProps={{
              endAdornment: <InputAdornment position="end">km</InputAdornment>,
            }}
            error={odometerError} helperText={odometerErrorText} />
        </div>
        <div className="splitDiv">
          <TextField value={driveTrainValue} label="Drive train*" margin="dense" fullWidth select
            onChange={(event) => setDriveTrainValue(event.target.value as DriveTrainTypeEnum)}
            name="bodyType" className="halfSplitDialogField">
            {driveTrains.map((entry) => (
              <MenuItem key={entry[0]} value={entry[1]}>
                {entry[0]}
              </MenuItem>
            ))}
          </TextField>
          <TextField value={powerTrainValue} label="Power train*" margin="dense" fullWidth select
            onChange={(event) => setPowerTrainValue(event.target.value as PowerTrainTypeEnum)}
            name="powerTrain" className="halfSplitDialogField">
            {powerTrains.map((entry) => (
              <MenuItem key={entry[0]} value={entry[1]}>
                {entry[0]}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="splitDiv">
          <TextField value={powerValue || ""} label="Power*" margin="dense" fullWidth
            onChange={(event) => handleNumericInput(event, setPowerValue)}
            type="number" name="power" className="thirdSplitDialogField"
            InputProps={{
              endAdornment: <InputAdornment position="end">hp</InputAdornment>,
            }}
            error={powerError} helperText={powerErrorText} />
          <TextField value={torqueValue || ""} label="Torque*" margin="dense" fullWidth
            onChange={(event) => handleNumericInput(event, setTorqueValue)}
            type="number" name="torque" className="thirdSplitDialogField"
            InputProps={{
              endAdornment: <InputAdornment position="end">Nm</InputAdornment>,
            }}
            error={torqueError} helperText={torqueErrorText} />
          <TextField value={engineSizeValue || ""} label="Engine size" margin="dense" fullWidth
            onChange={(event) => handleNumericInput(event, setEngineSizeValue)}
            type="number" name="engineSize" className="thirdSplitDialogField"
            error={engineSizeError} helperText={engineSizeErrorText} />
        </div>
        <div className="fullDiv">
          <FormControl sx={{ marginTop: '8px', width: '100%' }}>
            <InputLabel>Select features</InputLabel>
            <Select
              multiple
              value={featuresValue}
              onChange={(event) => setFeaturesValue(event.target.value as string[])}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => "Selected features: " + selected.length}
            >
              {features.map((feature) => (
                <MenuItem key={feature.id} value={feature.id}>
                  <Checkbox checked={featuresValue.indexOf(feature.id) > -1} />
                  <ListItemText primary={feature.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="splitDiv">
          <TextField value={locationValue} label="Location*" margin="dense" fullWidth select
            onChange={(event) => setLocationValue(event.target.value)}
            name="location" className="halfSplitDialogField"
            error={locationError} helperText={locationErrorText}>
            {locations.map((location) => (
              <MenuItem key={location.city + ", " + location.address} value={location.id}>
                {location.city + ", " + location.address}
              </MenuItem>
            ))}
          </TextField>
          <TextField value={priceValue || ""} label="Price*" margin="dense" fullWidth
            onChange={(event) => handleNumericInput(event, setPriceValue, true)}
            type="number" name="price" className="halfSplitDialogField"
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
            }}
            error={priceError} helperText={priceErrorText} />
        </div>
        <div className="fullDiv">
          <TextField value={descriptionValue || ""} label="Description" margin="dense" fullWidth
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
