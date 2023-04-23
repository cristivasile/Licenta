import { Button, TextField, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { generateErrorMessage, generateSuccessMessage } from '../../common';
import Loading from '../Loading/Loading';
import './Auth.scss';
import { requestPasswordReset } from '../../services/authenticationService';

interface PasswordResetRequestProps {
}

const PasswordResetRequest: FC<PasswordResetRequestProps> = (_: PasswordResetRequestProps) => {

    const [emailValue, setEmailValue] = useState("");
    const [usernameValue, setUsernameValue] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [emailErrorText, setEmailErrorText] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [usernameErrorText, setUsernameErrorText] = useState("");

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function clearMessages() {
        setSuccessMessage("");
        setErrorMessage("");

        setEmailError(false);
        setEmailErrorText("");

        setUsernameError(false);
        setUsernameErrorText("");
    }

    function handleReset() 
    {
        clearMessages();
        var hasError = false;

        if (usernameValue === null || usernameValue.trim() === ""){
            hasError = true;
            setUsernameError(true);
            setUsernameErrorText("User cannot be empty!");
        }

        if (emailValue === null || emailValue.trim() === ""){
            hasError = true;
            setEmailError(true);
            setEmailErrorText("Email cannot be empty!");
        }

        if (hasError)
            return;

        setLoading(true);
        requestPasswordReset(usernameValue.trim(), emailValue.trim(), window.location.origin)
            .then(async response => {
                if (response.status !== 200) {
                    setErrorMessage(await response.text());
                }
                else {
                    setSuccessMessage("A confirmation email has been sent to " + emailValue)
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

    function goToLogin() {
        navigate("/auth/login");
    }

    return (
        <div className="pageContainer">
            <div className="titleContainer" >
                Car Market App
            </div>
            {loading ? <Loading /> : <></>}
            <div className="authContainer wide">
                <div className="formTitle">Reset your password</div>

                <div className="inputDiv">
                    <TextField value={emailValue} label="Email*" margin="dense" fullWidth
                        onChange={(event) => setEmailValue(event.target.value)}
                        type="text" placeholder="email@email.email" name="email"
                        error={emailError} helperText={emailErrorText} />
                </div>
                <div className="inputDiv">
                    <TextField value={usernameValue} label="Username*" margin="dense" fullWidth
                        onChange={(event) => setUsernameValue(event.target.value)}
                        type="text" placeholder="username" name="username"
                        error={usernameError} helperText={usernameErrorText} />
                </div>

                {generateSuccessMessage(successMessage)}
                {generateErrorMessage(errorMessage)}
                <div className="buttonDiv">
                    <Button disabled={loading} variant="contained" onClick={() => handleReset()}>Reset</Button>
                </div>
                <div> Changed your mind? <button onClick={goToLogin} className="linkButton">Go to login</button></div>
            </div>
        </div>
    );
}

export default PasswordResetRequest;
