import { Box, Button, Dialog, DialogActions, DialogTitle, MenuItem, Tab, Tabs, TextField } from '@mui/material';
import { FC, useState } from 'react';
import { generateErrorMessage, generateSuccessMessage, TabPanel } from '../../../common';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { addBodyType, removeBodyTypeByName } from '../../../redux/bodyTypesStore';
import { postBodyType, removeBodyType } from '../../../services/bodyTypeService.';
import Loading from '../../Loading/Loading';

interface ManageBodyTypesDialogProps {
    isOpen: boolean,
    onClose: Function,
}

const ManageBodyTypesDialog: FC<ManageBodyTypesDialogProps> = (props: ManageBodyTypesDialogProps) => {

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [nameValue, setNameValue] = useState("");
    const [selectedBodyTypeValue, setSelectedBodyTypeValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);

    const [nameError, setNameError] = useState(false);
    const [nameErrorText, setNameErrorText] = useState("");
    const [selectedBodyTypeError, setSelectedBodyTypeError] = useState(false);
    const [selectedBodyTypeErrorText, setSelectedBodyTypeErrorText] = useState("");

    const bodyTypes = useAppSelector((state) => state.bodyType.bodyTypes);
    const dispatch = useAppDispatch();

    function clearErrors() {
        setErrorMessage("");
        setSuccessMessage("");

        setNameError(false);
        setNameErrorText("");
        setSelectedBodyTypeError(false);
        setSelectedBodyTypeErrorText("");
    }

    function addBodyTypeClick() {
        clearErrors();

        if (nameValue.trim() === "") {
            setNameError(true);
            setNameErrorText("Please input a body type name!");
            return;
        }

        setLoading(true);

        postBodyType(nameValue)
            .then(async response => {
                var responseText = await response.text();
                if (response.status !== 200) {
                    setErrorMessage(responseText !== "" ? responseText : response.statusText);
                }
                else {
                    //add the feature to the list manually to avoid an unnecessary fetch
                    dispatch(addBodyType({ name: nameValue }));
                    setSuccessMessage("Body type successfully added!");
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

    function removeBodyTypeClick() {
        clearErrors();

        if (selectedBodyTypeValue === "") {
            setSelectedBodyTypeError(true);
            setSelectedBodyTypeErrorText("Please select a body type to delete!");
            return;
        }

        setLoading(true);
        removeBodyType(selectedBodyTypeValue)
            .then(async response => {
                var responseText = await response.text();
                if (response.status !== 200) {
                    setErrorMessage(responseText !== "" ? responseText : response.statusText);
                }
                else {
                    //remove the feature from the list manually to avoid an unnecessary fetch
                    setSelectedBodyTypeValue('');
                    dispatch(removeBodyTypeByName({ name: selectedBodyTypeValue }));
                    setSuccessMessage("Body type successfully removed!");
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

            <DialogTitle className="formTitle">Manage body types</DialogTitle>
            <Box className="selectorBox">
                <Tabs value={selectedTab} onChange={handleTabChange}>
                    <Tab label="Add" />
                    <Tab label="Remove" />
                </Tabs>
            </Box>
            <TabPanel value={selectedTab} index={0}>
                <TextField value={nameValue} label="Body type" margin="dense" fullWidth autoFocus
                    onChange={(event) => setNameValue(event.target.value)}
                    error={nameError} helperText={nameErrorText}
                    type="text" name="name"/>
                <div className="rightDiv" style={{ marginTop: 20 }}>
                    <Button disabled={loading} onClick={addBodyTypeClick} variant="contained" >Add</Button>
                </div>
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
                <TextField value={selectedBodyTypeValue} label="Select a body type to remove" margin="dense" fullWidth autoFocus select
                    onChange={(event) => setSelectedBodyTypeValue(event.target.value)}
                    error={selectedBodyTypeError} helperText={selectedBodyTypeErrorText}
                    name="location">
                    {bodyTypes.map((bodyType) => (
                        <MenuItem key={bodyType.name} value={bodyType.name}>
                            {bodyType.name}
                        </MenuItem>
                    ))}
                </TextField>
                <div className="rightDiv" style={{ marginTop: 20 }}>
                    <Button disabled={loading} onClick={removeBodyTypeClick} variant="contained">Remove</Button>
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

export default ManageBodyTypesDialog;
