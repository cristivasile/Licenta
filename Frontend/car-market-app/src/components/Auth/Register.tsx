import { Button, TextField } from '@mui/material';
import { FC, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateErrorMessage } from '../../common';
import { signUp } from '../../services/authenticationService';
import Loading from '../Loading/Loading';
import './Auth.scss';

interface RegisterProps { 
  userName: string;
  setUserFunction: Function;
}

const Register: FC<RegisterProps> = (props: RegisterProps) => {
  const [emailValue, setEmailValue] = useState("");
  const [usernameValue, setUsernameValue] = useState(props.userName);
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
  const [errorMessage, setErrorMessage] = useState("");    //used for API request errors

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function validate(){
    var hasError = false;

    if(emailValue === ""){
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

    if(repeatValue === ""){
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

  function clearErrors() {
    setErrorMessage("");
    setEmailError(false);
    setUsernameError(false);
    setPasswordError(false);
    setRepeatError(false);
    setEmailErrorText("");
    setUsernameErrorText("");
    setPasswordErrorText("");
    setRepeatErrorText("");
  }

  const hamdleRegister = (event: FormEvent) => {
    clearErrors();
    event.preventDefault();

    if (!validate()) //don't send a request if validation fails
      return;

    setLoading(true);

    signUp(usernameValue, passwordValue, emailValue)
      .then(async response => {
        if (response.status !== 200) {
          setErrorMessage(await response.text());
        }
        else{
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
      .then(response => {
        setLoading(false)
      });
  };

  function goToLogin() {
    props.setUserFunction(usernameValue);
    navigate("../login");
  }
  return (
    <div className="pageContainer">
      <div className="titleContainer" >
        Car Market App
      </div>
      {loading? <Loading/> : <></>}
      <div className="authContainer">
        <div className="formTitle">Register</div>
        <form onSubmit={hamdleRegister} className="authForm">
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
          <div className="inputDiv">
            <TextField value={passwordValue} label="Password*" margin="dense" fullWidth
              onChange={(event) => setPasswordValue(event.target.value)}
              type="password" placeholder="*******" name="password"
              error={passwordError} helperText={passwordErrorText} />
          </div>
          <div className="inputDiv">
            <TextField value={repeatValue} label="Repeat password*" margin="dense" fullWidth
              onChange={(event) => setRepeatValue(event.target.value)}
              type="password" placeholder="*******" name="repeat"
              error={repeatError} helperText={repeatErrorText} />
          </div>
          {generateErrorMessage(errorMessage)}
          <div className="buttonDiv">
            <Button disabled={loading} variant="contained" type="submit">Register</Button>
          </div>
        </form>
        <div> Already have an account? <button onClick={goToLogin} className="linkButton">Login</button></div>
      </div>
    </div>
  );
}

export default Register;
