import { FC, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import './Auth.scss';
import { Button } from '@mui/material';
import { login, setRole, setToken, setUser} from '../../redux/user';
import { useAppDispatch} from '../../hooks';
import { roleLocalStoragePath, tokenLocalStoragePath, userLocalStoragePath, apiUrl } from '../../constants';
import Loading from '../Loading/Loading';

interface LoginProps { 
  userName: string;
  setUserFunction: Function;
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

  const generateErrorMessage = () => (
    <div className="errorMessage">{errorMessage}</div>
  );

  function validate(){
    var hasError = false;
    if(usernameValue === ""){
      setUsernameError(true);
      setUsernameErrorText("User cannot be empty");
      hasError = true;
    }
    if(passwordValue === ""){
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

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usernameValue, password: passwordValue })
    };
    fetch(apiUrl + "/api/auth/login", requestOptions)
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

          //set values in redux
          dispatch(login());
          dispatch(setUser(usernameValue));
          dispatch(setRole(json.role));
          dispatch(setToken(json.accessToken));
          navigate("/main");
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

  function goToRegister() {
    props.setUserFunction(usernameValue);
    navigate("../register");
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
          {generateErrorMessage()}
          <div className="buttonDiv">
            <Button disabled={loading} variant="contained" type="submit">Log in</Button>
          </div>
        </form>
        <div> Need an account? <button onClick={goToRegister} className="linkButton">Register</button></div>
      </div>
    </div>
  );
}

export default Login;
