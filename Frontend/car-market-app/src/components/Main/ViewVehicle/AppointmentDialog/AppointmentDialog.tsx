import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import Loading from '../../../Loading/Loading';
import { generateErrorMessage, generateSuccessMessage } from '../../../../common';
import { AppointmentTypeModel, mapJsonToAppointmentTypeModels } from '../../../../models/AppointmentTypeModel';
import { getAppointmentTypesBylocationId } from '../../../../services/appointmentTypesService';
import { notifyFetchFail } from '../../../../services/toastNotificationsService';
import "./AppointmentDialog.scss";
import { getAvailableIntervals, postAppointment } from '../../../../services/appointmentService';
import { DateDictionary } from '../../../../models/DateDictionaryModel';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AppointmentCreateModel } from '../../../../models/AppointmentModel';

export interface AppointmentDialogProps {
    reloadAppointmentCallback: Function,  //triggers another vehicle fetch
    locationId: string,
    vehicleId: string,
    isOpen: boolean,
    onClose: Function,
}

const AppointmentDialog: FC<AppointmentDialogProps> = (props: AppointmentDialogProps) => {

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [appointmentTypes, setAppointmentTypes] = useState(Array<AppointmentTypeModel>());
    const [lastNameValue, setLastNameValue] = useState("");
    const [firstNameValue, setFirstNameValue] = useState("");
    const [phoneValue, setPhoneValue] = useState("");
    const [appointmenTypeValue, setAppointmentTypeValue] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [intervalDictionary, setIntervalDictionary] = useState<DateDictionary>();
    const [availableIntervals, setAvailableIntervals] = useState<Array<Date>>();
    const [selectedInterval, setSelectedInterval] = useState<Date>();

    const [lastNameError, setLastNameError] = useState(false);
    const [lastNameErrorText, setLastNameErrorText] = useState("");

    const [firstNameError, setFirstNameError] = useState(false);
    const [firstNameErrorText, setFirstNameErrorText] = useState("");

    const [phoneError, setPhoneError] = useState(false);
    const [phoneErrorText, setPhoneErrorText] = useState("");

    const [appointmentTypeError, setAppointmentTypeError] = useState(false);
    const [appointmentTypeErrorText, setAppointmentTypeErrorText] = useState("");

    const [selectedIntervalError, setSelectedIntervalError] = useState(false);
    const [selectedIntervalErrorText, setSelectedIntervalErrorText] = useState("");

    useEffect(() => {
        if (props.locationId !== "") {
            setLoading(true);
            getAppointmentTypesBylocationId(props.locationId)
                .then(async response => {
                    if (response.status !== 200) {
                        setErrorMessage(await response.text());
                    }
                    else {
                        setAppointmentTypes(mapJsonToAppointmentTypeModels(await response.json()));
                    }
                })
                .catch((err) => {
                    notifyFetchFail(err);
                })
                .then(() => {
                    setLoading(false);
                });
        }

    }, [props.locationId]);


    useEffect(() => {
        setAppointmentTypeValue("");
        setAvailableIntervals(new Array<Date>());
        setIntervalDictionary({});
    }, [props.isOpen])

    function handleAppointmentTypeSelection(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setAppointmentTypeValue(event.target.value);
        setAvailableIntervals(new Array<Date>());
        setIntervalDictionary({});
        setSelectedDate(new Date(""));

        var type = appointmentTypes.find(x => x.id === event.target.value);

        setLoading(true)

        getAvailableIntervals(props.locationId, type?.duration || 5)
            .then(async response => {
                if (response.status !== 200) {
                    setErrorMessage(await response.text());
                }
                else {
                    setIntervalDictionary(await response.json());
                }
            })
            .catch((err) => {
                notifyFetchFail(err);
            })
            .then(() => {
                setLoading(false);
            });
    }

    function getFormattedDateString(date: Date | string | null): string {
        if (date === null)
            return ""

        var castDate = new Date(date);
        return `${castDate.getFullYear().toString()}-${(castDate.getMonth() + 1).toString().padStart(2, '0')}-${castDate.getDate().toString().padStart(2, '0')}`;
    }

    function getFormattedHourString(date: Date | string | null) {
        if (date === null)
            return ""

        var castDate = new Date(date);
        return `${castDate.getHours().toString().padStart(2, '0')}:${(castDate.getMinutes()).toString().padStart(2, '0')}`;
    }

    const shouldDisableDate = (date: Date) => {
        // Disable dates that are not in the availableDates dictionary
        if (intervalDictionary !== undefined) {
            return !intervalDictionary.hasOwnProperty(getFormattedDateString(date));
        }
        else
            return true;
    };

    const handleDateChange = (value: Date | null) => {
        if (value === null || intervalDictionary === undefined)
            setAvailableIntervals(new Array<Date>());
        else {
            setAvailableIntervals(intervalDictionary[getFormattedDateString(value)]);
            setSelectedDate(value);
        }
    }

    function clearMessages() {
        setErrorMessage("");
        setSuccessMessage("");

        setLastNameError(false);
        setLastNameErrorText("");

        setFirstNameError(false);
        setFirstNameErrorText("");

        setPhoneError(false);
        setPhoneErrorText("");

        setAppointmentTypeError(false);
        setAppointmentTypeErrorText("");
        
        setSelectedIntervalError(false);
        setSelectedIntervalErrorText("");
    }

    function validate(): boolean {
        var hasError = false;

        if (firstNameValue.trim() === "" || firstNameValue.trim().length <= 1) {
            setFirstNameError(true);
            setFirstNameErrorText("Please input a valid first name!");
            hasError = true;
        }
        if (lastNameValue.trim() === "" || lastNameValue.trim().length <= 1) {
            setLastNameError(true);
            setLastNameErrorText("Please input a valid last name!");
            hasError = true;
        }

        if (phoneValue.length < 9 || phoneValue.length > 10) {
            setPhoneError(true);
            setPhoneErrorText("Please input a valid phone number!");
            hasError = true;
        }

        if (appointmenTypeValue.trim() === ""){
            setAppointmentTypeError(true);
            setAppointmentTypeErrorText("Please select an appointment type!");
            hasError = true;
        }

        if (selectedInterval === undefined || selectedInterval === null){
            setSelectedIntervalError(true);
            setSelectedIntervalErrorText("Please choose a date and available interval!");
            hasError = true;
        }

        return !hasError;
    }

    function addAppointmentClick() {
        clearMessages();

        if (!validate())
            return;

        setLoading(true);

        var input = { 
            firstName: firstNameValue.trim(),
            lastName: lastNameValue.trim(),
            phone: phoneValue,
            date: selectedInterval,
            vehicleId: props.vehicleId,
            appointmentTypeId: appointmenTypeValue,
        } as AppointmentCreateModel;

        postAppointment(input)
            .then(async response => {
                if (response.status !== 200) {
                    setErrorMessage(await response.text());
                }
                else {
                    props.reloadAppointmentCallback();
                    setSelectedInterval(undefined);
                    setAvailableIntervals(new Array<Date>());
                    setSuccessMessage("Appointment booked!");
                    props.onClose();
                }
            })
            .catch((err) => {
                notifyFetchFail(err);
            })
            .then(() => {
                setLoading(false);
            });
    }

    return (
        <Dialog open={props.isOpen} onClose={() => props.onClose()} PaperProps={{ sx: { width: "40em", maxWidth: "40em" } }}>
            {loading ? <Loading /> : <></>}

            <DialogTitle className="formTitle">Make an appointment</DialogTitle>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DialogContent>

                    <div className="splitDiv">
                        <TextField value={lastNameValue} label="Last name*" margin="dense" fullWidth
                            onChange={(event) => setLastNameValue(event.target.value)}
                            name="lastName" className="halfSplitDialogField"
                            error={lastNameError} helperText={lastNameErrorText} />
                        <TextField value={firstNameValue} label="First name*" margin="dense" fullWidth
                            onChange={(event) => setFirstNameValue(event.target.value)}
                            name="firstName" className="halfSplitDialogField"
                            error={firstNameError} helperText={firstNameErrorText} />
                    </div>

                    <TextField value={phoneValue} label="Phone number*" margin="dense" fullWidth
                        onChange={(event) => setPhoneValue(event.target.value)}
                        type="number"
                        name="firstName"
                        error={phoneError} helperText={phoneErrorText} />

                    <TextField value={appointmenTypeValue} label="Select an appointment type" margin="dense" fullWidth autoFocus select
                        onChange={handleAppointmentTypeSelection}
                        error={appointmentTypeError} helperText={appointmentTypeErrorText}
                        name="appointmentType">
                        {appointmentTypes.map((appointmentType) => (
                            <MenuItem key={appointmentType.name + " - " + appointmentType.duration} value={appointmentType.id}>
                                {appointmentType.name + " - " + appointmentType.duration + " minutes"}
                            </MenuItem>
                        ))}
                    </TextField>

                    <div className="splitDiv">

                        <StaticDatePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                            shouldDisableDate={shouldDisableDate}
                            slotProps={{ actionBar: { actions: [], }, }}
                        />

                        <TextField value={selectedInterval} label="Select an interval" margin="dense" fullWidth autoFocus select
                            onChange={(event) => setSelectedInterval(new Date(event.target.value))}
                            error={selectedIntervalError} helperText={selectedIntervalErrorText}
                            name="appointmentType" sx={{ marginTop: "3em" }}
                            disabled={loading || availableIntervals === undefined || availableIntervals.length === 0}>
                            {availableIntervals !== undefined && availableIntervals.map((interval) => (
                                <MenuItem key={interval.toString()} value={interval.toString()}>
                                    {getFormattedHourString(interval)}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>

                </DialogContent>
            </LocalizationProvider>

            {generateErrorMessage(errorMessage)}
            {generateSuccessMessage(successMessage)}
            <DialogActions>
                <Button disabled={loading} onClick={() => props.onClose()} variant="contained">Close</Button>
                <Button disabled={loading} onClick={addAppointmentClick} variant="contained">Book</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AppointmentDialog;
