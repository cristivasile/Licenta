import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { FC, useState } from 'react';
import Loading from '../../../Loading/Loading';
import { generateErrorMessage, generateSuccessMessage } from '../../../../common';
import { sellVehicle } from '../../../../services/vehiclesService';
import { notifyFetchFail } from '../../../../services/toastNotificationsService';

export interface SellVehicleDialogProps {
    loadVehicleCallback: Function,  //triggers another vehicle fetch
    vehicleIdCallback: Function,
    isOpen: boolean,
    onClose: Function,
}

const SellVehicleDialog: FC<SellVehicleDialogProps> = (props: SellVehicleDialogProps) => {

    const [loading, setLoading] = useState(false);
    const [userName, setUsernameValue] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    function sellVehicleClick() {
        setErrorMessage("");
        setSuccessMessage("");

        if (userName === "") {
            setErrorMessage("Username cannot be empty!");
            return;
        }

        //disable buttons
        setLoading(true);
        sellVehicle(props.vehicleIdCallback(), userName, true)
            .then(async response => {
                if (response.status !== 200) {
                    setErrorMessage(await response.text());
                }
                else {
                    setSuccessMessage("Vehicle successfully marked as sold!");
                    setUsernameValue("");
                    props.loadVehicleCallback();
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
                <TextField value={userName} label="Purchaser username" margin="dense" fullWidth autoFocus
                    onChange={(event) => setUsernameValue(event.target.value)}
                    type="text" name="name" />
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
