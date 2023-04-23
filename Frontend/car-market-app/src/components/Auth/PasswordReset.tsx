import { Button, TextField, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { generateErrorMessage, generateSuccessMessage } from '../../common';
import Loading from '../Loading/Loading';
import './Auth.scss';
import { requestPasswordReset, resetPassword } from '../../services/authenticationService';

interface PasswordResetProps {
    setUserCallback: Function;
}

const PasswordReset: FC<PasswordResetProps> = (props: PasswordResetProps) => {

    const { username, token } = useParams();

    const [passwordValue, setPasswordValue] = useState("");
    const [repeatedPasswordValue, setRepeatedPasswordValue] = useState("");

    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorText, setPasswordErrorText] = useState("");
    const [repeatedPasswordError, setRepeatedPasswordError] = useState(false);
    const [repeatedPasswordErrorText, setRepeatedPasswordText] = useState("");

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function clearMessages() {
        setSuccessMessage("");
        setErrorMessage("");

        setPasswordError(false);
        setPasswordErrorText("");

        setRepeatedPasswordError(false);
        setRepeatedPasswordText("");
    }

    function handleReset() {
        clearMessages();
        var hasError = false;

        if (passwordValue.trim() === "") {
            setPasswordError(true);
            setPasswordErrorText("Password cannot be empty");
            hasError = true;
          }
      
          if(repeatedPasswordValue.trim() === ""){
            setRepeatedPasswordError(true);
            setRepeatedPasswordText("Repeated password cannot be empty");
            hasError = true;
          }
          else if (passwordValue.trim() !== repeatedPasswordValue.trim()) {
            setErrorMessage("Repeated password does not match!");
            hasError = true;
          }

        if (hasError)
            return;

        setLoading(true);
        resetPassword(username || "", passwordValue.trim(), token || "")
            .then(async response => {
                if (response.status !== 200) {
                    setErrorMessage(await response.text());
                }
                else {
                    goToLogin();
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
        props.setUserCallback(username);
        navigate("/auth/login");
    }

    return (
        <div className="pageContainer">
            <div className="titleContainer" >
                Car Market App
            </div>
            {loading ? <Loading /> : <></>}
            <div className="authContainer wide">
                <div className="formTitle">Confirm password reset</div>

                <div className="inputDiv">
                    <TextField value={passwordValue} label="New password*" margin="dense" fullWidth
                        onChange={(event) => setPasswordValue(event.target.value)}
                        type="password" placeholder="*******" name="password"
                        error={passwordError} helperText={passwordErrorText} />
                </div>
                <div className="inputDiv">
                    <TextField value={repeatedPasswordValue} label="Repeat new password*" margin="dense" fullWidth
                        onChange={(event) => setRepeatedPasswordValue(event.target.value)}
                        type="password" placeholder="*******" name="repeat"
                        error={repeatedPasswordError} helperText={repeatedPasswordErrorText} />
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

export default PasswordReset;
