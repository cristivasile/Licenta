import { Box, Button, Checkbox, Dialog, DialogActions, DialogTitle, FormControlLabel, MenuItem, Tab, Tabs, TextField, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { generateErrorMessage, generateSuccessMessage, TabPanel } from '../../../../common';
import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { addLocation, removeLocationById, updateLocationById } from '../../../../redux/locationsStore';
import { postLocation, removeLocation, updateLocation } from '../../../../services/locationsService';
import Loading from '../../../Loading/Loading';
import { ScheduleModel } from '../../../../models/ScheduleModel';
import { WeekdayEnum } from '../../../../models/enums/WeekdayEnum';
import { LocationModel } from '../../../../models/LocationModel';
import { AppointmentTypeModel, mapJsonToAppointmentTypeModels } from '../../../../models/AppointmentTypeModel';
import { deleteAppointmentType, getAppointmentTypesBylocationId, postAppointmentType, putAppointmentType } from '../../../../services/appointmentTypesService';
import { handleNumericInput } from '../../../../services/utils';

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
  const [appointmentLocationValue, setAppointmentLocationValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedAppointmentTab, setSelectedAppointmentTab] = useState(0);
  const [appointmentTypeName, setAppointmentTypeName] = useState("");
  const [appointmentTypeDuration, setAppointmentTypeDuration] = useState(15);
  const [currentAppointmentTypes, setCurrentAppointmentTypes] = useState(new Array<AppointmentTypeModel>());
  const [selectedAppointmentType, setSelectedAppointmentType] = useState("");

  const [cityError, setCityError] = useState(false);
  const [cityErrorText, setCityErrorText] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [addressErrorText, setAddressErrorText] = useState("");
  const [locationError, setLocationError] = useState(false);
  const [locationErrorText, setLocationErrorText] = useState("");
  const [appointmentTypeNameError, setAppointmentTypeNameError] = useState(false);
  const [appointmentTypeNameErrorText, setAppointmentTypeNameErrorText] = useState("");
  const [appointmentTypeDurationError, setAppointmentTypeDurationError] = useState(false);
  const [appointmentTypeDurationErrorText, setAppointmentTypeDurationErrorText] = useState("");
  const [selectedAppointmentTypeError, setSelectedAppointmentTypeError] = useState(false);
  const [selectedAppointmentTypeErrorText, setSelectedAppointmentTypeErrorText] = useState("");

  const [mondayOpen, setMondayOpen] = useState(true);
  const [mondayOpenTime, setMondayOpenTime] = useState("09:00");
  const [mondayCloseTime, setMondayCloseTime] = useState("18:00");
  const [mondayError, setMondayError] = useState(false);

  const [tuesdayOpen, setTuesdayOpen] = useState(true);
  const [tuesdayOpenTime, setTuesdayOpenTime] = useState("09:00");
  const [tuesdayCloseTime, setTuesdayCloseTime] = useState("18:00");
  const [tuesdayError, setTuesdayError] = useState(false);

  const [wednesdayOpen, setWednesdayOpen] = useState(true);
  const [wednesdayOpenTime, setWednesdayOpenTime] = useState("09:00");
  const [wednesdayCloseTime, setWednesdayCloseTime] = useState("18:00");
  const [wednesdayError, setWednesdayError] = useState(false);

  const [thursdayOpen, setThursdayOpen] = useState(true);
  const [thursdayOpenTime, setThursdayOpenTime] = useState("09:00");
  const [thursdayCloseTime, setThursdayCloseTime] = useState("18:00");
  const [thursdayError, setThursdayError] = useState(false);

  const [fridayOpen, setFridayOpen] = useState(true);
  const [fridayOpenTime, setFridayOpenTime] = useState("09:00");
  const [fridayCloseTime, setFridayCloseTime] = useState("18:00");
  const [fridayError, setFridayError] = useState(false);

  const [saturdayOpen, setSaturdayOpen] = useState(false);
  const [saturdayOpenTime, setSaturdayOpenTime] = useState("09:00");
  const [saturdayCloseTime, setSaturdayCloseTime] = useState("18:00");
  const [saturdayError, setSaturdayError] = useState(false);

  const [sundayOpen, setSundayOpen] = useState(false);
  const [sundayOpenTime, setSundayOpenTime] = useState("09:00");
  const [sundayCloseTime, setSundayCloseTime] = useState("18:00");
  const [sundayError, setSundayError] = useState(false);

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
    setAppointmentTypeNameError(false);
    setAppointmentTypeNameErrorText("");
    setAppointmentTypeDurationError(false);
    setAppointmentTypeDurationErrorText("");
    setSelectedAppointmentTypeError(false);
    setSelectedAppointmentTypeErrorText("");

    setMondayError(false);
    setTuesdayError(false);
    setWednesdayError(false);
    setThursdayError(false);
    setFridayError(false);
    setSaturdayError(false);
    setSundayError(false);
  }

  function validateTimes(): boolean {
    var hasError = false;

    if (mondayOpen && mondayOpenTime > mondayCloseTime) {
      setMondayError(true)
      hasError = true;
    }
    if (tuesdayOpen && tuesdayOpenTime > tuesdayCloseTime) {
      setTuesdayError(true)
      hasError = true;
    }
    if (wednesdayOpen && wednesdayOpenTime > wednesdayCloseTime) {
      setWednesdayError(true)
      hasError = true;
    }
    if (thursdayOpen && thursdayOpenTime > thursdayCloseTime) {
      setThursdayError(true)
      hasError = true;
    }
    if (fridayOpen && fridayOpenTime > fridayCloseTime) {
      setFridayError(true)
      hasError = true;
    }
    if (saturdayOpen && saturdayOpenTime > saturdayCloseTime) {
      setSaturdayError(true)
      hasError = true;
    }
    if (sundayOpen && sundayOpenTime > sundayCloseTime) {
      setSundayError(true)
      hasError = true;
    }

    return hasError;
  }

  function getSchedules(): ScheduleModel[] {

    var result = new Array<ScheduleModel>();

    if (mondayOpen)
      result.push({
        weekday: WeekdayEnum.Monday,
        openingTime: mondayOpenTime,
        closingTime: mondayCloseTime,
      } as ScheduleModel);
    if (tuesdayOpen)
      result.push({
        weekday: WeekdayEnum.Tuesday,
        openingTime: tuesdayOpenTime,
        closingTime: tuesdayCloseTime,
      } as ScheduleModel);
    if (wednesdayOpen)
      result.push({
        weekday: WeekdayEnum.Wednesday,
        openingTime: wednesdayOpenTime,
        closingTime: wednesdayCloseTime,
      } as ScheduleModel);
    if (thursdayOpen)
      result.push({
        weekday: WeekdayEnum.Thursday,
        openingTime: thursdayOpenTime,
        closingTime: thursdayCloseTime,
      } as ScheduleModel);
    if (fridayOpen)
      result.push({
        weekday: WeekdayEnum.Friday,
        openingTime: fridayOpenTime,
        closingTime: fridayCloseTime,
      } as ScheduleModel);
    if (saturdayOpen)
      result.push({
        weekday: WeekdayEnum.Saturday,
        openingTime: saturdayOpenTime,
        closingTime: saturdayCloseTime,
      } as ScheduleModel);
    if (sundayOpen)
      result.push({
        weekday: WeekdayEnum.Sunday,
        openingTime: sundayOpenTime,
        closingTime: sundayCloseTime,
      } as ScheduleModel);

    return result;
  }

  function addLocationClick() {
    clearErrors();

    var hasError = validateTimes();
    if (hasError)
      setErrorMessage("Opening time must be before closing time!")

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

    var schedules = getSchedules();

    setLoading(true);
    postLocation(cityValue.trim(), addressValue.trim(), schedules)
      .then(async response => {
        var responseText = await response.text();
        if (response.status !== 200) {
          setErrorMessage(responseText !== "" ? responseText : response.statusText);
        }
        else {
          //add the location to the list manually to avoid an unnecessary fetch
          dispatch(addLocation({ id: responseText, city: cityValue, address: addressValue, schedules: schedules }));
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

    var hasError = validateTimes();
    if (hasError)
      setErrorMessage("Opening time must be before closing time!")

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

    var schedules = getSchedules();

    setLoading(true);
    updateLocation(locationValue, cityValue, addressValue, schedules)
      .then(async response => {
        var responseText = await response.text();
        if (response.status !== 200) {
          setErrorMessage(responseText !== "" ? responseText : response.statusText);
        }
        else {
          //update the location manually to avoid an unnecessary fetch
          dispatch(updateLocationById({ id: locationValue, updatedCity: cityValue, updatedAddress: addressValue, schedules: schedules }));
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

  function fetchAppointmentTypes(locationId: string) {
    setLoading(true);
    getAppointmentTypesBylocationId(locationId)
      .then(async response => {
        if (response.status !== 200) {
          var responseText = await response.text();
          setErrorMessage(responseText !== "" ? responseText : response.statusText);
        }
        else {
          setCurrentAppointmentTypes(mapJsonToAppointmentTypeModels(await response.json()));
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

  function addAppointmentTypeClick() {
    clearErrors();

    var hasError = false;

    if (appointmentTypeName.trim() === "") {
      hasError = true;
      setAppointmentTypeNameError(true);
      setAppointmentTypeNameErrorText("Please input a name!");
    }

    if (Number.isNaN(appointmentTypeDuration) || appointmentTypeDuration <= 0) {
      hasError = true;
      setAppointmentTypeDurationError(true);
      setAppointmentTypeDurationErrorText("Please input a valid duration!");
    }

    if (appointmentLocationValue === "") {
      hasError = true;
      setLocationError(true);
      setLocationErrorText("Please select a location to update!");
    }

    if (hasError)
      return;

    setLoading(true);
    postAppointmentType(appointmentTypeName, appointmentTypeDuration, appointmentLocationValue)
      .then(async response => {
        if (response.status !== 200) {
          var responseText = await response.text();
          setErrorMessage(responseText !== "" ? responseText : response.statusText);
        }
        else {
          setSuccessMessage("Appointment type successfully added!");
          fetchAppointmentTypes(appointmentLocationValue);
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

  function updateAppointmentTypeClick() {
    clearErrors();

    var hasError = false;

    if (appointmentTypeName.trim() === "") {
      hasError = true;
      setAppointmentTypeNameError(true);
      setAppointmentTypeNameErrorText("Please input a name!");
    }

    if (Number.isNaN(appointmentTypeDuration) || appointmentTypeDuration <= 0) {
      hasError = true;
      setAppointmentTypeDurationError(true);
      setAppointmentTypeDurationErrorText("Please input a valid duration!");
    }

    if (appointmentLocationValue.trim() === "") {
      hasError = true;
      setLocationError(true);
      setLocationErrorText("Please select a location to update!");
    }

    if (selectedAppointmentType.trim() === "") {
      hasError = true;
      setSelectedAppointmentTypeError(true);
      setSelectedAppointmentTypeErrorText("Please select an appointment type!");
    }

    if (hasError)
      return;

    setLoading(true);
    putAppointmentType(selectedAppointmentType, appointmentTypeName, appointmentTypeDuration, appointmentLocationValue)
      .then(async response => {
        if (response.status !== 200) {
          var responseText = await response.text();
          setErrorMessage(responseText !== "" ? responseText : response.statusText);
        }
        else {
          setSuccessMessage("Appointment type successfully updated!");
          fetchAppointmentTypes(appointmentLocationValue);
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

  function deleteAppointmentTypeClick() {
    clearErrors();

    var hasError = false;

    if (appointmentLocationValue.trim() === "") {
      hasError = true;
      setLocationError(true);
      setLocationErrorText("Please select a location to update!");
    }

    if (selectedAppointmentType.trim() === "") {
      hasError = true;
      setSelectedAppointmentTypeError(true);
      setSelectedAppointmentTypeErrorText("Please select an appointment type!");
    }

    if (hasError)
      return;

    setLoading(true);
    deleteAppointmentType(selectedAppointmentType)
      .then(async response => {
        if (response.status !== 200) {
          var responseText = await response.text();
          setErrorMessage(responseText !== "" ? responseText : response.statusText);
        }
        else {
          setSuccessMessage("Appointment type successfully deleted!");
          fetchAppointmentTypes(appointmentLocationValue);
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

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    clearErrors();
    setSelectedTab(newValue);
  };

  const handleAppointmentTabChange = (_: React.SyntheticEvent, newValue: number) => {
    clearErrors();
    setSelectedAppointmentType("");
    setSelectedAppointmentTab(newValue);
  };

  const handleLocationUpdateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    var location = locations.find(x => x.id === event.target.value) as LocationModel;

    clearErrors();
    setAddressValue(location.address)
    setCityValue(location.city)

    setMondayOpen(false);
    setTuesdayOpen(false);
    setWednesdayOpen(false);
    setThursdayOpen(false);
    setFridayOpen(false);
    setSaturdayOpen(false);
    setSundayOpen(false);

    for (var schedule of location.schedules)
      switch (schedule.weekday) {
        case WeekdayEnum.Monday:
          setMondayOpen(true);
          setMondayOpenTime(schedule.openingTime);
          setMondayCloseTime(schedule.closingTime);
          break;
        case WeekdayEnum.Tuesday:
          setTuesdayOpen(true);
          setTuesdayOpenTime(schedule.openingTime);
          setTuesdayCloseTime(schedule.closingTime);
          break;
        case WeekdayEnum.Wednesday:
          setWednesdayOpen(true);
          setWednesdayOpenTime(schedule.openingTime);
          setWednesdayCloseTime(schedule.closingTime);
          break;
        case WeekdayEnum.Thursday:
          setThursdayOpen(true);
          setThursdayOpenTime(schedule.openingTime);
          setThursdayCloseTime(schedule.closingTime);
          break;
        case WeekdayEnum.Friday:
          setFridayOpen(true);
          setFridayOpenTime(schedule.openingTime);
          setFridayCloseTime(schedule.closingTime);
          break;
        case WeekdayEnum.Saturday:
          setSaturdayOpen(true);
          setSaturdayOpenTime(schedule.openingTime);
          setSaturdayCloseTime(schedule.closingTime);
          break;
        case WeekdayEnum.Sunday:
          setSaturdayOpen(true);
          setSundayOpenTime(schedule.openingTime);
          setSaturdayCloseTime(schedule.closingTime);
          break;
        default:
          break;
      }

    setLocationValue(event.target.value);
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
          <Tab label="Appointments" />
        </Tabs>
      </Box>
      <TabPanel value={selectedTab} index={0}>
        <div className="splitDiv">
          <TextField value={cityValue} label="City" margin="dense" fullWidth autoFocus
            onChange={(event) => setCityValue(event.target.value)}
            error={cityError} helperText={cityErrorText}
            type="text" name="address" className="halfSplitDialogField" />
          <TextField value={addressValue} label="Address" margin="dense" fullWidth autoFocus
            error={addressError} helperText={addressErrorText}
            onChange={(event) => setAddressValue(event.target.value)}
            type="text" name="address" className="halfSplitDialogField" />
        </div>

        <Typography>
          Schedule
        </Typography>

        <div className="splitDiv">
          <FormControlLabel
            control={<Checkbox checked={mondayOpen} onChange={(event) => setMondayOpen(event.target.checked)} />}
            label="Monday"
          />
          <div>
            {mondayOpen ?
              <>
                <TextField sx={{ marginRight: "5px" }}
                  label="Opens at"
                  type="time"
                  value={mondayOpenTime}
                  error={mondayError}
                  onChange={(event) => setMondayOpenTime(event.target.value)}
                />
                <TextField
                  label="Closes at"
                  type="time"
                  value={mondayCloseTime}
                  error={mondayError}
                  onChange={(event) => setMondayCloseTime(event.target.value)}
                />
              </>
              :
              <></>
            }
          </div>
        </div>

        <div className="splitDiv">
          <FormControlLabel
            control={<Checkbox checked={tuesdayOpen} onChange={(event) => setTuesdayOpen(event.target.checked)} />}
            label="Tuesday"
          />
          <div>
            {tuesdayOpen ?
              <>
                <TextField sx={{ marginRight: "5px" }}
                  label="Opens at"
                  type="time"
                  value={tuesdayOpenTime}
                  error={tuesdayError}
                  onChange={(event) => setTuesdayOpenTime(event.target.value)}
                />
                <TextField
                  label="Closes at"
                  type="time"
                  value={tuesdayCloseTime}
                  error={tuesdayError}
                  onChange={(event) => setTuesdayCloseTime(event.target.value)}
                />
              </>
              :
              <></>
            }
          </div>
        </div>

        <div className="splitDiv">
          <FormControlLabel
            control={<Checkbox checked={wednesdayOpen} onChange={(event) => setWednesdayOpen(event.target.checked)} />}
            label="Wednesday"
          />
          <div>
            {wednesdayOpen ?
              <>
                <TextField sx={{ marginRight: "5px" }}
                  label="Opens at"
                  type="time"
                  value={wednesdayOpenTime}
                  error={wednesdayError}
                  onChange={(event) => setWednesdayOpenTime(event.target.value)}
                />
                <TextField
                  label="Closes at"
                  type="time"
                  value={wednesdayCloseTime}
                  error={wednesdayError}
                  onChange={(event) => setWednesdayCloseTime(event.target.value)}
                />
              </>
              :
              <></>
            }
          </div>
        </div>

        <div className="splitDiv">
          <FormControlLabel
            control={<Checkbox checked={thursdayOpen} onChange={(event) => setThursdayOpen(event.target.checked)} />}
            label="Thursday"
          />
          <div>
            {thursdayOpen ?
              <>
                <TextField sx={{ marginRight: "5px" }}
                  label="Opens at"
                  type="time"
                  value={thursdayOpenTime}
                  error={thursdayError}
                  onChange={(event) => setThursdayOpenTime(event.target.value)}
                />
                <TextField
                  label="Closes at"
                  type="time"
                  value={thursdayCloseTime}
                  error={thursdayError}
                  onChange={(event) => setThursdayCloseTime(event.target.value)}
                />
              </>
              :
              <></>
            }
          </div>
        </div>

        <div className="splitDiv">
          <FormControlLabel
            control={<Checkbox checked={fridayOpen} onChange={(event) => setFridayOpen(event.target.checked)} />}
            label="Friday"
          />
          <div>
            {fridayOpen ?
              <>
                <TextField sx={{ marginRight: "5px" }}
                  label="Opens at"
                  type="time"
                  value={fridayOpenTime}
                  error={fridayError}
                  onChange={(event) => setFridayOpenTime(event.target.value)}
                />
                <TextField
                  label="Closes at"
                  type="time"
                  value={fridayCloseTime}
                  error={fridayError}
                  onChange={(event) => setFridayCloseTime(event.target.value)}
                />
              </>
              :
              <></>
            }
          </div>
        </div>

        <div className="splitDiv">
          <FormControlLabel
            control={<Checkbox checked={saturdayOpen} onChange={(event) => setSaturdayOpen(event.target.checked)} />}
            label="Saturday"
          />
          <div>
            {saturdayOpen ?
              <>
                <TextField sx={{ marginRight: "5px" }}
                  label="Opens at"
                  type="time"
                  value={saturdayOpenTime}
                  error={saturdayError}
                  onChange={(event) => setSaturdayOpenTime(event.target.value)}
                />
                <TextField
                  label="Closes at"
                  type="time"
                  value={saturdayCloseTime}
                  error={saturdayError}
                  onChange={(event) => setSaturdayCloseTime(event.target.value)}
                />
              </>
              :
              <></>
            }
          </div>
        </div>

        <div className="splitDiv">
          <FormControlLabel
            control={<Checkbox checked={sundayOpen} onChange={(event) => setSundayOpen(event.target.checked)} />}
            label="Sunday"
          />
          <div>
            {sundayOpen ?
              <>
                <TextField sx={{ marginRight: "5px" }}
                  label="Opens at"
                  type="time"
                  value={sundayOpenTime}
                  error={sundayError}
                  onChange={(event) => setSundayOpenTime(event.target.value)}
                />
                <TextField
                  label="Closes at"
                  type="time"
                  value={sundayCloseTime}
                  error={sundayError}
                  onChange={(event) => setSundayCloseTime(event.target.value)}
                />
              </>
              :
              <></>
            }
          </div>
        </div>

        <div className="rightDiv" style={{ marginTop: 20 }}>
          <Button disabled={loading} onClick={addLocationClick} variant="contained" >Add</Button>
        </div>
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        <TextField value={locationValue} label="Select a location to modify" margin="dense" fullWidth autoFocus select
          onChange={handleLocationUpdateChange}
          error={locationError} helperText={locationErrorText}
          name="location">
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
            type="text" name="address" className="halfSplitDialogField" />
          <TextField value={addressValue} label="Address" margin="dense" fullWidth autoFocus
            error={addressError} helperText={addressErrorText}
            onChange={(event) => setAddressValue(event.target.value)}
            type="text" name="address" className="halfSplitDialogField" />
        </div>

        <Typography>
          Schedule
        </Typography>

        <div className="splitDiv">
          <FormControlLabel
            control={<Checkbox checked={mondayOpen} onChange={(event) => setMondayOpen(event.target.checked)} />}
            label="Monday"
          />
          <div>
            {mondayOpen ?
              <>
                <TextField sx={{ marginRight: "5px" }}
                  label="Opens at"
                  type="time"
                  value={mondayOpenTime}
                  error={mondayError}
                  onChange={(event) => setMondayOpenTime(event.target.value)}
                />
                <TextField
                  label="Closes at"
                  type="time"
                  value={mondayCloseTime}
                  error={mondayError}
                  onChange={(event) => setMondayCloseTime(event.target.value)}
                />
              </>
              :
              <></>
            }
          </div>
        </div>

        <div className="splitDiv">
          <FormControlLabel
            control={<Checkbox checked={tuesdayOpen} onChange={(event) => setTuesdayOpen(event.target.checked)} />}
            label="Tuesday"
          />
          <div>
            {tuesdayOpen ?
              <>
                <TextField sx={{ marginRight: "5px" }}
                  label="Opens at"
                  type="time"
                  value={tuesdayOpenTime}
                  error={tuesdayError}
                  onChange={(event) => setTuesdayOpenTime(event.target.value)}
                />
                <TextField
                  label="Closes at"
                  type="time"
                  value={tuesdayCloseTime}
                  error={tuesdayError}
                  onChange={(event) => setTuesdayCloseTime(event.target.value)}
                />
              </>
              :
              <></>
            }
          </div>
        </div>

        <div className="splitDiv">
          <FormControlLabel
            control={<Checkbox checked={wednesdayOpen} onChange={(event) => setWednesdayOpen(event.target.checked)} />}
            label="Wednesday"
          />
          <div>
            {wednesdayOpen ?
              <>
                <TextField sx={{ marginRight: "5px" }}
                  label="Opens at"
                  type="time"
                  value={wednesdayOpenTime}
                  error={wednesdayError}
                  onChange={(event) => setWednesdayOpenTime(event.target.value)}
                />
                <TextField
                  label="Closes at"
                  type="time"
                  value={wednesdayCloseTime}
                  error={wednesdayError}
                  onChange={(event) => setWednesdayCloseTime(event.target.value)}
                />
              </>
              :
              <></>
            }
          </div>
        </div>

        <div className="splitDiv">
          <FormControlLabel
            control={<Checkbox checked={thursdayOpen} onChange={(event) => setThursdayOpen(event.target.checked)} />}
            label="Thursday"
          />
          <div>
            {thursdayOpen ?
              <>
                <TextField sx={{ marginRight: "5px" }}
                  label="Opens at"
                  type="time"
                  value={thursdayOpenTime}
                  error={thursdayError}
                  onChange={(event) => setThursdayOpenTime(event.target.value)}
                />
                <TextField
                  label="Closes at"
                  type="time"
                  value={thursdayCloseTime}
                  error={thursdayError}
                  onChange={(event) => setThursdayCloseTime(event.target.value)}
                />
              </>
              :
              <></>
            }
          </div>
        </div>

        <div className="splitDiv">
          <FormControlLabel
            control={<Checkbox checked={fridayOpen} onChange={(event) => setFridayOpen(event.target.checked)} />}
            label="Friday"
          />
          <div>
            {fridayOpen ?
              <>
                <TextField sx={{ marginRight: "5px" }}
                  label="Opens at"
                  type="time"
                  value={fridayOpenTime}
                  error={fridayError}
                  onChange={(event) => setFridayOpenTime(event.target.value)}
                />
                <TextField
                  label="Closes at"
                  type="time"
                  value={fridayCloseTime}
                  error={fridayError}
                  onChange={(event) => setFridayCloseTime(event.target.value)}
                />
              </>
              :
              <></>
            }
          </div>
        </div>

        <div className="splitDiv">
          <FormControlLabel
            control={<Checkbox checked={saturdayOpen} onChange={(event) => setSaturdayOpen(event.target.checked)} />}
            label="Saturday"
          />
          <div>
            {saturdayOpen ?
              <>
                <TextField sx={{ marginRight: "5px" }}
                  label="Opens at"
                  type="time"
                  value={saturdayOpenTime}
                  error={saturdayError}
                  onChange={(event) => setSaturdayOpenTime(event.target.value)}
                />
                <TextField
                  label="Closes at"
                  type="time"
                  value={saturdayCloseTime}
                  error={saturdayError}
                  onChange={(event) => setSaturdayCloseTime(event.target.value)}
                />
              </>
              :
              <></>
            }
          </div>
        </div>

        <div className="splitDiv">
          <FormControlLabel
            control={<Checkbox checked={sundayOpen} onChange={(event) => setSundayOpen(event.target.checked)} />}
            label="Sunday"
          />
          <div>
            {sundayOpen ?
              <>
                <TextField sx={{ marginRight: "5px" }}
                  label="Opens at"
                  type="time"
                  value={sundayOpenTime}
                  error={sundayError}
                  onChange={(event) => setSundayOpenTime(event.target.value)}
                />
                <TextField
                  label="Closes at"
                  type="time"
                  value={sundayCloseTime}
                  error={sundayError}
                  onChange={(event) => setSundayCloseTime(event.target.value)}
                />
              </>
              :
              <></>
            }
          </div>
        </div>

        <div className="rightDiv" style={{ marginTop: 20 }}>
          <Button disabled={loading} onClick={updateLocationClick} variant="contained">Update</Button>
        </div>
      </TabPanel>
      <TabPanel value={selectedTab} index={2}>
        <TextField value={locationValue} label="Select a location to remove" margin="dense" fullWidth autoFocus select
          onChange={(event) => setLocationValue(event.target.value)}
          error={locationError} helperText={locationErrorText}
          name="location">
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

      <TabPanel value={selectedTab} index={3}>
        <Typography sx={{ marginBottom: "1em" }} fontSize={18} color="primary">
          Manage appointment types
        </Typography>

        <TextField value={appointmentLocationValue} label="Select a location" margin="dense" fullWidth autoFocus select
          onChange={(event) => { setAppointmentLocationValue(event.target.value); fetchAppointmentTypes(event.target.value) }}
          error={locationError} helperText={locationErrorText}
          name="location">
          {locations.map((location) => (
            <MenuItem key={location.city + ", " + location.address} value={location.id}>
              {location.city + ", " + location.address}
            </MenuItem>
          ))}
        </TextField>

        <Box className="selectorBox">
          <Tabs value={selectedAppointmentTab} onChange={handleAppointmentTabChange}>
            <Tab label="Add" />
            <Tab label="Modify" />
            <Tab label="Remove" />
          </Tabs>
        </Box>

        <TabPanel value={selectedAppointmentTab} index={0}>
          <div className="splitDiv">
            <TextField value={appointmentTypeName} label="Name" margin="dense" fullWidth autoFocus
              onChange={(event) => setAppointmentTypeName(event.target.value)}
              error={appointmentTypeNameError} helperText={appointmentTypeNameErrorText}
              type="text" name="name" className="halfSplitDialogField" />
            <TextField value={appointmentTypeDuration} label="Duration" margin="dense" fullWidth autoFocus
              error={appointmentTypeDurationError} helperText={appointmentTypeDurationErrorText}
              onChange={(event) => handleNumericInput(event, setAppointmentTypeDuration)}
              type="number" name="address" className="halfSplitDialogField" />
          </div>

          <div className="rightDiv" style={{ marginTop: 20 }}>
            <Button disabled={loading} onClick={addAppointmentTypeClick} variant="contained"> Add </Button>
          </div>
        </TabPanel>

        <TabPanel value={selectedAppointmentTab} index={1}>
          <TextField value={selectedAppointmentType} label="Select an appointment type" margin="dense" fullWidth autoFocus select
            onChange={(event) => setSelectedAppointmentType(event.target.value)}
            error={selectedAppointmentTypeError} helperText={selectedAppointmentTypeErrorText}
            name="appointmnetType">
            {currentAppointmentTypes.map((appointmentType) => (
              <MenuItem key={appointmentType.name + " - " + appointmentType.duration} value={appointmentType.id}>
                {appointmentType.name + " - " + appointmentType.duration + " minutes"}
              </MenuItem>
            ))}
          </TextField>

          <div className="splitDiv">
            <TextField value={appointmentTypeName} label="Name" margin="dense" fullWidth autoFocus
              onChange={(event) => setAppointmentTypeName(event.target.value)}
              error={appointmentTypeNameError} helperText={appointmentTypeNameErrorText}
              type="text" name="name" className="halfSplitDialogField" />
            <TextField value={appointmentTypeDuration} label="Duration" margin="dense" fullWidth autoFocus
              error={appointmentTypeDurationError} helperText={appointmentTypeDurationErrorText}
              onChange={(event) => handleNumericInput(event, setAppointmentTypeDuration)}
              type="number" name="address" className="halfSplitDialogField" />
          </div>

          <div className="rightDiv" style={{ marginTop: 20 }}>
            <Button disabled={loading} onClick={updateAppointmentTypeClick} variant="contained"> Modify </Button>
          </div>
        </TabPanel>

        <TabPanel value={selectedAppointmentTab} index={2}>
          <TextField value={selectedAppointmentType} label="Select an appointment type" margin="dense" fullWidth autoFocus select
            onChange={(event) => setSelectedAppointmentType(event.target.value)}
            error={selectedAppointmentTypeError} helperText={selectedAppointmentTypeErrorText}
            name="appointmnetType">
            {currentAppointmentTypes.map((appointmentType) => (
              <MenuItem key={appointmentType.name + " - " + appointmentType.duration} value={appointmentType.id}>
                {appointmentType.name + " - " + appointmentType.duration + " minutes"}
              </MenuItem>
            ))}
          </TextField>

          <div className="rightDiv" style={{ marginTop: 20 }}>
            <Button disabled={loading} onClick={deleteAppointmentTypeClick} variant="contained"> Delete </Button>
          </div>
        </TabPanel>
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
