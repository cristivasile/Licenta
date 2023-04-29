import { FC, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import './Auth.scss';
import { Button } from '@mui/material';
import { login, setHasRecommendations, setRole, setToken, setUser} from '../../redux/userStore';
import { useAppDispatch } from '../../hooks';
import { hasRecommendationsLocalStoragePath, roleLocalStoragePath, tokenLocalStoragePath, userLocalStoragePath } from '../../constants';
import Loading from '../Loading/Loading';
import { notifyFetchFail } from '../../services/toastNotificationsService';
import { generateErrorMessage } from '../../common';
import { logIn } from '../../services/authenticationService';

interface LoginProps { 
  userName: string;
  setUserCallback: Function;
}

const Login: FC<LoginProps> = (props: LoginProps) => {

  const [usernameValue, setUsernameValue] = useState(props.userName);
  const [passwordValue, setPasswordValue] = useState("");

  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorText, setPasswordErrorText] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorText, setUsernameErrorText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  function validate(){
    var hasError = false;
    if(usernameValue.trim() === ""){
      setUsernameError(true);
      setUsernameErrorText("User cannot be empty");
      hasError = true;
    }
    if(passwordValue.trim() === ""){
      setPasswordError(true);
      setPasswordErrorText("Password cannot be empty");
      hasError = true;
    }

    return !hasError;
  }

  function clearErrors() {
    setErrorMessage("");
    setUsernameError(false);
    setPasswordError(false);
    setUsernameErrorText("");
    setPasswordErrorText("");
  }

  const handleLogin = (event: FormEvent) => {

    clearErrors();
    event.preventDefault();

    if(!validate()) //don't send a request if validation fails
      return;

    //disable login button
    setLoading(true);

    logIn(usernameValue.trim(), passwordValue.trim())
      .then(async response => {
        if (response.status !== 200) {
          setErrorMessage(await response.text());
        }
        else{
          var json = await response.json();
          //set values in localstorage
          localStorage.setItem(tokenLocalStoragePath, json.accessToken);
          localStorage.setItem(roleLocalStoragePath, json.role);
          localStorage.setItem(userLocalStoragePath, usernameValue);
          localStorage.setItem(hasRecommendationsLocalStoragePath, JSON.stringify(json.hasRecommendations));

          //set values in redux
          dispatch(login());
          dispatch(setUser(usernameValue));
          dispatch(setRole(json.role));
          dispatch(setToken(json.accessToken));
          dispatch(setHasRecommendations(json.hasRecommendations));
          navigate("/main");
        }
      })
      .catch((err) => {
        notifyFetchFail(err);
      })
      .then(() => {
        setLoading(false)
      });
  };

  function goToMain(){
    navigate("/main");
  }

  function goToRegister() {
    props.setUserCallback(usernameValue);
    navigate("../register");
  }

  function goToReset() {
    navigate("../requestPasswordReset");
  }

  return (
    <div className="pageContainer">
      {loading? <Loading/> : <></>}
      <div className="titleContainer" >
        Car Market App
      </div>
      <div className="authContainer">
        <div className="formTitle">Login</div>
        <form onSubmit={handleLogin} className="authForm">
          <div className="inputDiv">
            <TextField value={usernameValue} label="Username *" margin="dense" fullWidth 
              onChange={(event) => setUsernameValue(event.target.value)}
              type="text" placeholder="Username" name="username" 
              error={usernameError} helperText={usernameErrorText}/>
          </div>
          <div className="inputDiv">
            <TextField value={passwordValue} label="Password *" margin="dense" fullWidth
              onChange={(event) => setPasswordValue(event.target.value)}
              type="password" placeholder="*******" name="password" 
              error={passwordError} helperText={passwordErrorText}/>
          </div>
          {generateErrorMessage(errorMessage)}
          <div className="buttonDiv">
            <Button disabled={loading} variant="contained" type="submit">Log in</Button>
          </div>
        </form>
        <div> <button onClick={goToMain} className="linkButton">Go to main</button></div>
        <div style={{marginTop:".5em"}}> Need an account? <button onClick={goToRegister} className="linkButton">Register</button></div>
        <div style={{marginTop:".5em"}}> Forgot your password? <button onClick={goToReset} className="linkButton">Reset it</button></div>
      </div>
    </div>
  );
}

export default Login;
