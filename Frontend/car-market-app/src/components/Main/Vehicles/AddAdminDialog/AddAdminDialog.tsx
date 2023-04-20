import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import Loading from "../../../Loading/Loading";
import { generateErrorMessage, generateSuccessMessage } from "../../../../common";
import { FC, FormEvent, useState } from "react";
import { signUpAdmin } from "../../../../services/authenticationService";

interface AddAdminDialogProps {
    isOpen: boolean,
    onClose: Function,
}

const AddAdminDialog: FC<AddAdminDialogProps> = (props: AddAdminDialogProps) => {
    const [emailValue, setEmailValue] = useState("");
    const [usernameValue, setUsernameValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [repeatValue, setRepeatValue] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [emailErrorText, setEmailErrorText] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [usernameErrorText, setUsernameErrorText] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorText, setPasswordErrorText] = useState("");
    const [repeatError, setRepeatError] = useState(false);
    const [repeatErrorText, setRepeatErrorText] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [loading, setLoading] = useState(false);

    function validate() {
        var hasError = false;

        if (emailValue === "") {
            setEmailError(true);
            setEmailErrorText("Email cannot be empty");
            hasError = true;
        }
        if (usernameValue === "") {
            setUsernameError(true);
            setUsernameErrorText("User cannot be empty");
            hasError = true;
        }
        if (passwordValue === "") {
            setPasswordError(true);
            setPasswordErrorText("Password cannot be empty");
            hasError = true;
        }

        if (repeatValue === "") {
            setRepeatError(true);
            setRepeatErrorText("Repeated password cannot be empty");
            hasError = true;
        }
        else if (passwordValue !== repeatValue) {
            setErrorMessage("Repeated password does not match!");
            hasError = true;
        }

        return !hasError;
    }

    function clearMessages() {
        setErrorMessage("");
        setSuccessMessage("");
        setEmailError(false);
        setUsernameError(false);
        setPasswordError(false);
        setRepeatError(false);
        setEmailErrorText("");
        setUsernameErrorText("");
        setPasswordErrorText("");
        setRepeatErrorText("");
    }

    const handleRegister = (event: FormEvent) => {
        clearMessages();
        event.preventDefault();

        if (!validate()) //don't send a request if validation fails
            return;

        setLoading(true);

        signUpAdmin(usernameValue, passwordValue, emailValue)
            .then(async response => {
                if (response.status !== 200) {
                    var responseText = await response.text();
                    setErrorMessage(responseText !== "" ? responseText : response.statusText);
                }
                else {
                    setSuccessMessage("Admin successfully created!");
                }
            })
            .catch((err) => {
                if (err.message === "Failed to fetch") {
                    setErrorMessage("The server is currently unavailable");
                }
                else {
                    setErrorMessage("An unexpected error happened");
                }
            })
            .then(() => {
                setLoading(false)
            });
    };


    return (
        <Dialog open={props.isOpen} onClose={() => props.onClose()} PaperProps={{ sx: { width: "50em" } }}>
            {loading ? <Loading /> : <></>}

            <DialogTitle className="formTitle">Manage features</DialogTitle>

            <DialogContent>
                <TextField value={emailValue} label="Email*" margin="dense" fullWidth
                    onChange={(event) => setEmailValue(event.target.value)}
                    type="text" placeholder="email@email.email" name="email"
                    error={emailError} helperText={emailErrorText} />
                <TextField value={usernameValue} label="Username*" margin="dense" fullWidth
                    onChange={(event) => setUsernameValue(event.target.value)}
                    type="text" placeholder="username" name="username"
                    error={usernameError} helperText={usernameErrorText} />
                <TextField value={passwordValue} label="Password*" margin="dense" fullWidth
                    onChange={(event) => setPasswordValue(event.target.value)}
                    type="password" placeholder="*******" name="password"
                    error={passwordError} helperText={passwordErrorText} />
                <TextField value={repeatValue} label="Repeat password*" margin="dense" fullWidth
                    onChange={(event) => setRepeatValue(event.target.value)}
                    type="password" placeholder="*******" name="repeat"
                    error={repeatError} helperText={repeatErrorText} />
            </DialogContent>


            {generateErrorMessage(errorMessage)}
            {generateSuccessMessage(successMessage)}
            <DialogActions>
                <Button disabled={loading} onClick={() => props.onClose()} variant="contained">Close</Button>
                <Button disabled={loading} onClick={handleRegister} variant="contained">Create</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddAdminDialog;