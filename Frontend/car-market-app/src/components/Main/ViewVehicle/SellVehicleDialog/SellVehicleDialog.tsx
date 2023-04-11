import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import Loading from '../../../Loading/Loading';
import { generateErrorMessage, generateSuccessMessage } from '../../../../common';
import { sellVehicle } from '../../../../services/vehiclesService';
import { notifyBadResultCode, notifyFetchFail } from '../../../../services/toastNotificationsService';
import { getUsernames } from '../../../../services/authenticationService';

export interface SellVehicleDialogProps {
    loadVehicleCallback: Function,  //triggers another vehicle fetch
    vehicleIdCallback: Function,
    isOpen: boolean,
    onClose: Function,
}

const SellVehicleDialog: FC<SellVehicleDialogProps> = (props: SellVehicleDialogProps) => {

    const [loading, setLoading] = useState(false);
    const [username, setUsernameValue] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [usernameSuggestions, setUsernameSuggestions] = useState(Array<string>());

    useEffect(() => {
        setLoading(true);
        getUsernames()
            .then(async response => {
                if (response.status !== 200) {
                    notifyBadResultCode(response.status);
                }
                else {
                    setUsernameSuggestions(await response.json())
                }
            })
            .catch((err) => {
                notifyFetchFail(err);
                return;
            })
            .then(() => {
                setLoading(false);
            });
    }, [])

    function sellVehicleClick() {
        setErrorMessage("");
        setSuccessMessage("");

        if (username === "") {
            setErrorMessage("Username cannot be empty!");
            return;
        }

        //disable buttons
        setLoading(true);
        sellVehicle(props.vehicleIdCallback(), username, true)
            .then(async response => {
                if (response.status !== 200) {
                    setErrorMessage(await response.text());
                }
                else {
                    setSuccessMessage("Vehicle successfully marked as sold!");
                    setUsernameValue("");
                    props.loadVehicleCallback(false);
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
        <Dialog open={props.isOpen} onClose={() => props.onClose()} PaperProps={{ sx: { width: "50em" } }}>
            {loading ? <Loading /> : <></>}

            <DialogTitle className="formTitle">Mark this vehicle as sold</DialogTitle>
            <DialogContent>
                <Autocomplete value={username} fullWidth freeSolo
                    options={usernameSuggestions} sx={{ marginTop: '8px' }}
                    onChange={(_, value) => 
                    setUsernameValue(value || '')}
                    renderInput={(params) =>
                    <TextField {...params} autoFocus
                        onChange={(event) => 
                        setUsernameValue(event.target.value || '')
                        }
                        label="Purchaser username" />} />
            </DialogContent>

            {generateErrorMessage(errorMessage)}
            {generateSuccessMessage(successMessage)}
            <DialogActions>
                <Button disabled={loading} onClick={() => props.onClose()} variant="contained">Close</Button>
                <Button disabled={loading} onClick={sellVehicleClick} variant="contained">Mark as sold</Button>
            </DialogActions>
        </Dialog>
    );
}

export default SellVehicleDialog;
