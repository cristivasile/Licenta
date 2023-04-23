import { Button, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { generateErrorMessage, generateSuccessMessage } from '../../common';
import Loading from '../Loading/Loading';
import './Auth.scss';
import { confirmEmail } from '../../services/authenticationService';

interface ConfirmationProps {
    setUserCallback: Function,
}

const Confirmation: FC<ConfirmationProps> = (props: ConfirmationProps) => {

    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { token } = useParams();

    function handleConfirm() {
        setLoading(true);
        confirmEmail(token || "")
            .then(async response => {
                if (response.status !== 200) {
                    setErrorMessage(await response.text());
                }
                else {
                    goToLogin(await response.text());
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

    function goToMain() {
        navigate("/main");
    }

    function goToLogin(username: string) {
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
                <div className="formTitle">Confirm your email</div>
                <Typography fontSize={20} sx={{ marginTop: "1em", marginBottom: "1em" }}>
                    Please press the button to confirm your email
                </Typography>
                {generateErrorMessage(errorMessage)}
                <div className="buttonDiv">
                    <Button disabled={loading} variant="contained" onClick={() => handleConfirm()}>Confirm</Button>
                </div>
                <div> <button onClick={goToMain} className="linkButton">Go to main</button></div>
            </div>
        </div>
    );
}

export default Confirmation;
