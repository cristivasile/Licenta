import { Box, Button, Dialog, DialogActions, DialogTitle, MenuItem, Tab, Tabs, TextField } from '@mui/material';
import { FC, useState } from 'react';
import { generateErrorMessage, generateSuccessMessage, TabPanel } from '../../../common';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { addFeature, removeFeatureById, updateFeatureById } from '../../../redux/featuresStore';
import { postFeature, removeFeature, updateFeature } from '../../../services/featuresService';
import Loading from '../../Loading/Loading';

interface ManageFeaturessDialogProps {
    isOpen: boolean,
    onClose: Function,
}

const ManageFeaturesDialog: FC<ManageFeaturessDialogProps> = (props: ManageFeaturessDialogProps) => {

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [nameValue, setNameValue] = useState("");
    const [selectedFeatureValue, setSelectedFeatureValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);

    const [nameError, setNameError] = useState(false);
    const [nameErrorText, setNameErrorText] = useState("");
    const [selectedFeatureError, setSelectedFeatureError] = useState(false);
    const [selectedFeatureErrorText, setSelectedFeatureErrorText] = useState("");

    const features = useAppSelector((state) => state.feature.features);
    const dispatch = useAppDispatch();

    function clearErrors() {
        setErrorMessage("");
        setSuccessMessage("");

        setNameError(false);
        setNameErrorText("");
        setSelectedFeatureError(false);
        setSelectedFeatureErrorText("");
    }

    function addFeatureClick() {
        clearErrors();

        if (nameValue.trim() === "") {
            setNameError(true);
            setNameErrorText("Please input a feature name!");
            return;
        }

        setLoading(true);

        postFeature(nameValue)
            .then(async response => {
                var responseText = await response.text();
                if (response.status !== 200) {
                    setErrorMessage(responseText !== "" ? responseText : response.statusText);
                }
                else {
                    //add the feature to the list manually to avoid an unnecessary fetch
                    dispatch(addFeature({ id: responseText, name: nameValue }));
                    setSuccessMessage("Feature successfully added!");
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

    function removeFeatureClick() {
        clearErrors();

        if (selectedFeatureValue === "") {
            setSelectedFeatureError(true);
            setSelectedFeatureErrorText("Please select a feature to delete!");
            return;
        }

        setLoading(true);
        removeFeature(selectedFeatureValue)
            .then(async response => {
                var responseText = await response.text();
                if (response.status !== 200) {
                    setErrorMessage(responseText !== "" ? responseText : response.statusText);
                }
                else {
                    //remove the feature from the list manually to avoid an unnecessary fetch
                    setSelectedFeatureValue('');
                    dispatch(removeFeatureById({ id: selectedFeatureValue }));
                    setSuccessMessage("Feature successfully removed!");
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

    function updateFeatureClick() {
        clearErrors();

        var hasError = false;
        if (nameValue.trim() === "") {
            hasError = true;
            setNameError(true);
            setNameErrorText("Please input an updated feature name!");
        }

        if (selectedFeatureValue === "") {
            hasError = true;
            setSelectedFeatureError(true);
            setSelectedFeatureErrorText("Please select a feature to update!");
            return;
        }

        if (hasError)
            return;

        setLoading(true);
        updateFeature(selectedFeatureValue, nameValue)
            .then(async response => {
                var responseText = await response.text();
                if (response.status !== 200) {
                    setErrorMessage(responseText !== "" ? responseText : response.statusText);
                }
                else {
                    //update the location manually to avoid an unnecessary fetch
                    dispatch(updateFeatureById({ id: selectedFeatureValue, updatedName: nameValue }));
                    setSuccessMessage("Feature successfully updated!");
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

            <DialogTitle className="formTitle">Manage features</DialogTitle>
            <Box className="selectorBox">
                <Tabs value={selectedTab} onChange={handleTabChange}>
                    <Tab label="Add" />
                    <Tab label="Modify" />
                    <Tab label="Remove" />
                </Tabs>
            </Box>
            <TabPanel value={selectedTab} index={0}>
                <TextField value={nameValue} label="Feature name" margin="dense" fullWidth autoFocus
                    onChange={(event) => setNameValue(event.target.value)}
                    error={nameError} helperText={nameErrorText}
                    type="text" name="name" />
                <div className="rightDiv" style={{ marginTop: 20 }}>
                    <Button disabled={loading} onClick={addFeatureClick} variant="contained" >Add</Button>
                </div>
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
                <TextField value={selectedFeatureValue} label="Select a feature to modify" margin="dense" fullWidth autoFocus select
                    onChange={(event) => setSelectedFeatureValue(event.target.value)}
                    error={selectedFeatureError} helperText={selectedFeatureErrorText}
                    name="location">
                    {features.map((feature) => (
                        <MenuItem key={feature.name} value={feature.id}>
                            {feature.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField value={nameValue} label="Feature name" margin="dense" fullWidth autoFocus
                    onChange={(event) => setNameValue(event.target.value)}
                    error={nameError} helperText={nameErrorText}
                    type="text" name="name"/>
                <div className="rightDiv" style={{ marginTop: 20 }}>
                    <Button disabled={loading} onClick={updateFeatureClick} variant="contained">Update</Button>
                </div>
            </TabPanel>
            <TabPanel value={selectedTab} index={2}>
                <TextField value={selectedFeatureValue} label="Select a feature to remove" margin="dense" fullWidth autoFocus select
                    onChange={(event) => setSelectedFeatureValue(event.target.value)}
                    error={selectedFeatureError} helperText={selectedFeatureErrorText}
                    name="location">
                    {features.map((feature) => (
                        <MenuItem key={feature.name} value={feature.id}>
                            {feature.name}
                        </MenuItem>
                    ))}
                </TextField>
                <div className="rightDiv" style={{ marginTop: 20 }}>
                    <Button disabled={loading} onClick={removeFeatureClick} variant="contained">Remove</Button>
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

export default ManageFeaturesDialog;
