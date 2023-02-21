import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import React, { FC, useState } from 'react';
import { apiUrl } from '../../../constants';
import { useAppSelector } from '../../../hooks';
import { postLocation } from '../../../services/locationsService';
import Loading from '../../Loading/Loading';
import './AddLocationDialog.scss';

interface AddLocationDialogProps {
  isOpen: boolean,
  onClose: Function,
}

const AddLocationDialog: FC<AddLocationDialogProps> = (props: AddLocationDialogProps) => {

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [addressValue, setAddressValue] = useState("");
  const [loading, setLoading] = useState(false);
  const token = useAppSelector((state) => state.user.token);

  const generateErrorMessage = () => (
    <div className="errorMessage leftMargin">{errorMessage}</div>
  );
  const generateSuccessMessage = () => (
    <div className="successMessage leftMargin">{successMessage}</div> 
  );

  function addLocation(){
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if(addressValue === ""){
      setErrorMessage("Address cannot be empty!");
      return;
    }

    postLocation(addressValue, token)
      .then(async response => {
        if (response.status !== 200) {
          var text = await response.text();
          setErrorMessage(text !== "" ? text : response.statusText);
        }
        else{
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

  return(
    <Dialog open={props.isOpen} onClose={() => props.onClose()} PaperProps={{sx: {width: "50em"}}}>
      {loading? <Loading/> : <></>}
      <DialogTitle className="formTitle">Add a new location</DialogTitle>
      <DialogContent>
      <TextField value={addressValue} label="Address" margin="dense" fullWidth autoFocus
                onChange={(event) => setAddressValue(event.target.value)}
                type="text" name="address" className="locationDialogField"/>
      </DialogContent>
      {generateErrorMessage()}
      {generateSuccessMessage()}
      <DialogActions>
        <Button disabled={loading} onClick={() => props.onClose()} variant="contained">Cancel</Button>
        <Button disabled={loading} onClick={addLocation} variant="contained">Add</Button>
      </DialogActions>
  </Dialog>
  );
}



export default AddLocationDialog;
