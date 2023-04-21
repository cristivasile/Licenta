import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, MenuItem, TextField, Typography } from "@mui/material";
import Loading from "../../../Loading/Loading";
import { generateErrorMessage, generateSuccessMessage } from "../../../../common";
import { FC, useState } from "react";
import { useAppSelector } from "../../../../hooks";
import { AppointmentModel } from "../../../../models/AppointmentModel";
import { deleteAppointment, getAppointmentsByLocationId } from "../../../../services/appointmentService";
import { notifyBadResultCode, notifyFetchFail } from "../../../../services/toastNotificationsService";
import DeleteIcon from "@mui/icons-material/Delete"
import "./ViewAppointmentsDialog.scss";

interface ViewAppointmentsDialogProps {
    isOpen: boolean,
    onClose: Function,
    navigateToVehicleCallback: Function,
}

const ViewAppointmentsDialog: FC<ViewAppointmentsDialogProps> = (props: ViewAppointmentsDialogProps) => {

    const [loading, setLoading] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [locationValue, setLocationValue] = useState("");
    const [appointments, setAppointments] = useState(new Array<AppointmentModel>())
    const [upcoming, setUpcoming] = useState(true);
    const locations = useAppSelector((state) => state.location.locations);

    const handleLocationChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setLocationValue(event.target.value);

        fetchAppointments(event.target.value, upcoming);
    }

    const handleUpcomingChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setUpcoming(checked)
        if (locationValue !== "")
            fetchAppointments(locationValue, checked);
    }

    function fetchAppointments(locationId: string, upcoming: boolean) {
        setLoading(true);
        getAppointmentsByLocationId(locationId, upcoming)
            .then(async response => {
                if (response.status !== 200) {
                    notifyBadResultCode(response.status);
                }
                else {
                    setAppointments(await response.json());
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

    function removeAppointment(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, appointmentId: string) {
        event.stopPropagation();
        deleteAppointment(appointmentId)
            .then(async response => {
                if (response.status !== 200) {
                    notifyBadResultCode(response.status);
                }
                else {
                    fetchAppointments(locationValue, upcoming)
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

    function getTimeString(date: Date): string {

        var castDate = new Date(date);
        return castDate.getHours().toString().padStart(2, '0') + ":" + castDate.getMinutes().toString().padStart(2, '0') 
        + " - " + castDate.getDay().toString().padStart(2, '0') + "/" + castDate.getMonth().toString().padStart(2, '0')
    }

    function handleAppointmentClick(vehicleId: string) {
        props.navigateToVehicleCallback(vehicleId);
        props.onClose();
    }
    return (
        <Dialog open={props.isOpen} onClose={() => props.onClose()} PaperProps={{ sx: { width: "50em", maxWidth: "50em" } }}>
            {loading ? <Loading /> : <></>}

            <DialogTitle className="formTitle">View appointments</DialogTitle>

            <DialogContent>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <TextField value={locationValue} label="Select a location" margin="dense" fullWidth autoFocus select
                        onChange={handleLocationChange}
                        name="location">
                        {locations.map((location) => (
                            <MenuItem key={location.city + ", " + location.address} value={location.id}>
                                {location.city + ", " + location.address}
                            </MenuItem>
                        ))}
                    </TextField>

                    <FormControlLabel sx={{ width: "15em", marginLeft: "1em" }}
                        control={<Checkbox checked={upcoming} onChange={(handleUpcomingChange)} />}
                        label="Upcoming only"
                    />
                </div>

                <div id="viewAppointmentsContainer">
                    {
                        appointments.length !== 0 ?
                            appointments.map((appointment) => (
                                <div className="viewAppointmentRow" onClick={() => handleAppointmentClick(appointment.vehicleId)}>
                                    <div className="verticalDivider" />
                                    <div className="viewAppointmentPersonalDetails">
                                        <div className="nameDiv">
                                            <Typography sx={{ fontWeight: "bold" }} color="primary">
                                                {appointment.lastName + " " + appointment.firstName}
                                            </Typography>
                                        </div>
                                        <div className="phoneDiv">
                                            <Typography>
                                                {appointment.phone}
                                            </Typography>
                                        </div>
                                    </div>
                                    <div className="viewAppointmentType">
                                        <div className="typeDiv">
                                            <Typography color="primary" sx={{ fontWeight: "bold" }}>
                                                {appointment.appointmentTypeName + ' (' + appointment.appointmentDuration + " min)"}
                                            </Typography>
                                        </div>
                                        <div className="durationDiv">
                                            <Typography>
                                                {getTimeString(appointment.date)}
                                            </Typography>
                                        </div>
                                    </div>
                                    <div className="viewAppointmentVehicle">
                                        <Typography color="primary" sx={{ fontWeight: "bold" }}>
                                            {appointment.vehicleBrand + " " + appointment.vehicleModel}
                                        </Typography>
                                    </div>
                                    <div className="deleteButtonContainer" >
                                        <IconButton aria-label="delete" color="warning" onClick={(event) => removeAppointment(event, appointment.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                </div>
                            ))
                            :
                            <div id="appointmentMessageContainer">
                                {locationValue !== "" ?
                                    <Typography color="primary" fontSize={20}>
                                        No appointments to show
                                    </Typography>
                                    :
                                    <Typography color="primary" fontSize={20}>
                                        Please select a location
                                    </Typography>
                                }
                            </div>

                    }
                </div>
            </DialogContent>


            {generateErrorMessage(errorMessage)}
            {generateSuccessMessage(successMessage)}
            <DialogActions>
                <Button disabled={loading} onClick={() => props.onClose()} variant="contained">Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ViewAppointmentsDialog;