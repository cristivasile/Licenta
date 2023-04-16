import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, MenuItem, TextField, Autocomplete, FormControl, InputLabel, Select, OutlinedInput, ListItemText, Checkbox } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { generateErrorMessage, generateSuccessMessage } from '../../../common';
import { useAppSelector } from '../../../hooks';
import { notifyFetchFail } from '../../../services/toastNotificationsService';
import { createVehicle, updateVehicle } from '../../../services/vehiclesService';
import { capitalizeFirstLetter, compressImage, fileToBase64 } from '../../../services/utils';
import { mapFromVehicleTypeList } from '../../../models/VehicleTypeModel';
import { driveTrainsMap, DriveTrainTypeEnum } from '../../../models/DriveTrainTypeEnum';
import { powerTrainsMap, PowerTrainTypeEnum } from '../../../models/PowerTrainTypeEnum';
import Loading from '../../Loading/Loading';
import defaultImage from "../../../assets/no-image.png";
import { TransmissionTypeEnum, transmissionTypesMap } from '../../../models/TransmissionTypeEnum';
import { compressedImageSizeInMb, compressedThumbnailSizeInMb, maxCompressedImageWidth, maxCompressedThumbnailWidth } from '../../../constants';
import { DetailedVehicleModel, VehicleCreateModel } from '../../../models/VehicleModel';
import './VehicleDialog.scss';

export interface VehicleDialogProps {
  isOpen: boolean,
  onClose: Function,
  forUpdate: boolean,
  vehicle: DetailedVehicleModel | null, //used in update
  reloadVehicleCallback: Function | null, //used to refresh vehicle page after update
}

const VehicleDialog: FC<VehicleDialogProps> = (props: VehicleDialogProps) => {

  const today = new Date();
  const locations = useAppSelector((state) => state.location.locations);
  const bodyTypes = useAppSelector((state) => state.bodyType.bodyTypes);
  const features = useAppSelector((state) => state.feature.features);
  const vehicleTypesMap = mapFromVehicleTypeList(useAppSelector((state) => state.vehicleType.vehicleTypes));
  const driveTrains = Array.from(driveTrainsMap.entries());
  const powerTrains = Array.from(powerTrainsMap.entries());
  const transmissions = Array.from(transmissionTypesMap.entries());

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [brandValue, setBrandValue] = useState("");
  const [modelValue, setModelValue] = useState("");
  const [bodyTypeValue, setBodyTypeValue] = useState("");
  const [locationValue, setLocationValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [priceValue, setPriceValue] = useState(NaN);
  const [yearValue, setYearValue] = useState(NaN);
  const [engineSizeValue, setEngineSizeValue] = useState(NaN);
  const [powerValue, setPowerValue] = useState(NaN);
  const [torqueValue, setTorqueValue] = useState(NaN);
  const [odometerValue, setOdometerValue] = useState(NaN);
  const [featuresValue, setFeaturesValue] = useState(new Array<string>());
  const [driveTrainValue, setDriveTrainValue] = useState(DriveTrainTypeEnum.FWD);
  const [powerTrainValue, setPowerTrainValue] = useState(PowerTrainTypeEnum.Diesel);
  const [transmissionValue, setTransmissionValue] = useState(TransmissionTypeEnum.Manual);
  const [thumbnailValue, setThumbnailValue] = useState(new File([""], ""));
  const [imagesValue, setImagesValue] = useState(new Array<File>());

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

  // Sets the 'Model' autocomplete options when the brand value is modified
  function handleBrandSelection(brand: string) {
    brand = capitalizeFirstLetter(brand);
    var options = vehicleTypesMap.get(brand) || new Array<string>();
    setVehicleModelOptions(options);
  }

  useEffect(() => {
    if (props.forUpdate && props.vehicle !== null) {
      if (props.vehicle !== undefined) {
        setBrandValue(props.vehicle.brand);
        setModelValue(props.vehicle.model);
        setBodyTypeValue(props.vehicle.bodyType);
        setYearValue(props.vehicle.year);
        setPriceValue(props.vehicle.price);
        if (props.vehicle.engineSize != null)
          setEngineSizeValue(props.vehicle.engineSize);
        setPowerValue(props.vehicle.power);
        setTorqueValue(props.vehicle.torque);
        setOdometerValue(props.vehicle.odometer);
        setDescriptionValue(props.vehicle.description);

        if (props.vehicle.location !== undefined)
          setLocationValue(props.vehicle.location.id);

        if (props.vehicle.features !== undefined) {
          var features = new Array<string>();
          props.vehicle.features.forEach((feature) => {
            features.push(feature.id);
          });
          setFeaturesValue(features);
        }
      }
    }
  }, [props]);

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
    setFeaturesValue(new Array<string>());
    setThumbnailValue(new File([""], ""));
    setImagesValue(new Array<File>());
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
    else if (odometerValue <= 0) {
      setOdometerError(true);
      setOdometerErrorText("This field must be at least 1!");
      hasError = true;
    }

    if (Number.isNaN(powerValue)) {
      setPowerError(true);
      setPowerErrorText("This field is mandatory!");
      hasError = true;
    }
    else if (powerValue <= 0) {
      setPowerError(true);
      setPowerErrorText("This field must be at least 1!");
      hasError = true;
    }

    if (Number.isNaN(torqueValue)) {
      setTorqueError(true);
      setTorqueErrorText("This field is mandatory!");
      hasError = true;
    }
    else if (torqueValue <= 0) {
      setTorqueError(true);
      setTorqueErrorText("This field must be at least 1!");
      hasError = true;
    }

    if (Number.isNaN(priceValue)) {
      setPriceError(true);
      setPriceErrorText("This field is mandatory!");
      hasError = true;
    }
    else if (priceValue <= 0) {
      setPriceError(true);
      setPriceErrorText("This field must be at least 1!");
      hasError = true;
    }

    if (!Number.isNaN(engineSizeValue) && engineSizeValue <= 0) {
      setEngineSizeError(true);
      setEngineSizeErorrText("This field must be at least 0!");
      hasError = true;
    }

    return !hasError;
  }

  async function sendVehicle() {
    clearMessages();

    if (!validate()) //don't send a request if validation fails
      return;

    setLoading(true);

    //compress thumbnail
    if (thumbnailValue.size !== 0) {
      //compress the image further to use as thumbnail
      var compressedThumbnailImage = await compressImage(thumbnailValue, compressedThumbnailSizeInMb, maxCompressedThumbnailWidth);
      var base64ThumbnailImage = thumbnailValue.name !== "" ? await fileToBase64(compressedThumbnailImage) : "";
    }
    else {  //if no thumbnail was added
      if (props.forUpdate && props.vehicle !== null)
        base64ThumbnailImage = props.vehicle.thumbnail;
      else
        base64ThumbnailImage = "";
    }

    //compress images in order to save bandwidth and reduce loading times
    var base64Images = new Array<string>();

    if (imagesValue.length !== 0) {
      for (var image of imagesValue) {
        var compressedImage = await compressImage(image, compressedImageSizeInMb, maxCompressedImageWidth);
        var base64Image = image.name !== "" ? await fileToBase64(compressedImage) : "";
        base64Images.push(base64Image);
      }
    }
    else if (props.forUpdate) { //if no images were added
      base64Images = props.vehicle!.images; //vehicle images are already compressed
    }

    var vehicleModel: VehicleCreateModel = {
      images: base64Images,
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
      transmission: transmissionValue,
    };

    if (props.forUpdate) {
      updateVehicle(props.vehicle!.id, vehicleModel)
        .then(async response => {
          if (response.status !== 200) {
            var text = await response.text();
            setErrorMessage(text !== "" ? text : response.statusText);
          }
          else {
            setSuccessMessage("Vehicle successfully updated!");
            if (props.reloadVehicleCallback !== null)
              props.reloadVehicleCallback(true);
          }
        })
        .catch((err) => {
          notifyFetchFail(err);
        })
        .then(() => {
          setLoading(false);
        });
    }
    else {
      createVehicle(vehicleModel)
        .then(async response => {
          if (response.status !== 200) {
            var text = await response.text();
            setErrorMessage(text !== "" ? text : response.statusText);
          }
          else {
            setSuccessMessage("Vehicle successfully added!");
            clearInputs();
          }
        })
        .catch((err) => {
          notifyFetchFail(err);
        })
        .then(() => {
          setLoading(false);
        });
    }
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
    <Dialog open={props.isOpen} onClose={() => { clearMessages(); props.onClose(); }} PaperProps={{ sx: { width: "50em", maxWidth: "50em" } }}>
      {loading ? <Loading /> : <></>}
      <DialogTitle className="formTitle">
        {props.forUpdate ?
          "Update vehicle"
          :
          "Add a new vehicle"
        }</DialogTitle>
      <DialogContent>
        <div className="splitDiv">
          {
            !props.forUpdate ?
              <>
                <div>
                  <Button disabled={loading} variant="contained" component="label" className="addImageButton" sx={{ marginRight: ".4em" }}>
                    Add images
                    <input type="file" hidden accept={"image/png, image/jpeg"} multiple={true}
                      onChange={(event) => event.target.files !== null ? setImagesValue(Array.from(event.target.files)) : {}} />
                  </Button>
                  <Button disabled={loading} variant="contained" component="label" className="addImageButton">
                    Add thumbnail
                    <input type="file" hidden accept={"image/png, image/jpeg"}
                      onChange={(event) => event.target.files !== null ? setThumbnailValue(event.target.files![0]) : {}} />
                  </Button>
                </div>

                <div id="imagesInfoDiv">
                  <div>
                    {
                    imagesValue.length !== 0 ? 
                    imagesValue.length + " image(s) uploaded" 
                    : "No image uploaded"
                    }
                  </div>
                  <div id="previewImageDiv">
                    <img src={getImage(thumbnailValue)} alt="" id="previewImage" />
                  </div>
                </div>
              </>
              :
              <></>
          }
        </div>

        <div className="splitDiv">
          <Autocomplete value={brandValue} fullWidth freeSolo className="thirdSplitDialogField"
            options={Array.from(vehicleTypesMap.keys())} sx={{ marginTop: '8px' }}
            onChange={(_, value) => {
              setBrandValue(value || '');
              handleBrandSelection(value || "")
            }}
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
            name="bodyType" className="thirdSplitDialogField">
            {driveTrains.map((entry) => (
              <MenuItem key={entry[0]} value={entry[1]}>
                {entry[0]}
              </MenuItem>
            ))}
          </TextField>
          <TextField value={powerTrainValue} label="Power train*" margin="dense" fullWidth select
            onChange={(event) => setPowerTrainValue(event.target.value as PowerTrainTypeEnum)}
            name="powerTrain" className="thirdSplitDialogField">
            {powerTrains.map((entry) => (
              <MenuItem key={entry[0]} value={entry[1]}>
                {entry[0]}
              </MenuItem>
            ))}
          </TextField>
          <TextField value={transmissionValue} label="Transmission*" margin="dense" fullWidth select
            onChange={(event) => setTransmissionValue(event.target.value as TransmissionTypeEnum)}
            name="transmission" className="thirdSplitDialogField">
            {transmissions.map((entry) => (
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
        <Button disabled={loading} onClick={sendVehicle} variant="contained">
          {props.forUpdate ? "Update" : "Add"}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default VehicleDialog;
