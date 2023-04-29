import { Button, Checkbox, FormControlLabel, MenuItem, TextField, Typography } from '@mui/material';
import { FC, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateErrorMessage, generateSuccessMessage } from '../../common';
import { SignUpModel, signUp } from '../../services/authenticationService';
import Loading from '../Loading/Loading';
import './Auth.scss';
import { AgeGroupEnum, ageGroupEnumMap } from '../../models/enums/AgeGroupEnum';
import { SexEnum, sexEnumMap } from '../../models/enums/SexEnum';
import { RegionEnum, regionEnumMap } from '../../models/enums/RegionEnum';

interface RegisterProps {
  userName: string;
  setUserCallback: Function;
}

const Register: FC<RegisterProps> = (props: RegisterProps) => {
  const [emailValue, setEmailValue] = useState("");
  const [usernameValue, setUsernameValue] = useState(props.userName);
  const [passwordValue, setPasswordValue] = useState("");
  const [repeatValue, setRepeatValue] = useState("");

  const [hasDetailedInfo, setHasDetailedInfo] = useState(false);
  const [ageGroupValue, setAgeGroupValue] = useState(AgeGroupEnum.Young);
  const [regionValue, setRegionValue] = useState(RegionEnum.Urban);
  const [sexValue, setSexValue] = useState(SexEnum.Male);

  const ageGroups = Array.from(ageGroupEnumMap.entries());
  const regions = Array.from(regionEnumMap.entries());
  const sexes = Array.from(sexEnumMap.entries());

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
  const navigate = useNavigate();

  function validate() {
    var hasError = false;

    if (emailValue.trim() === "") {
      setEmailError(true);
      setEmailErrorText("Email cannot be empty");
      hasError = true;
    }
    if (usernameValue.trim() === "") {
      setUsernameError(true);
      setUsernameErrorText("User cannot be empty");
      hasError = true;
    }
    if (passwordValue.trim() === "") {
      setPasswordError(true);
      setPasswordErrorText("Password cannot be empty");
      hasError = true;
    }

    if (repeatValue.trim() === "") {
      setRepeatError(true);
      setRepeatErrorText("Repeated password cannot be empty");
      hasError = true;
    }
    else if (passwordValue.trim() !== repeatValue.trim()) {
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

  const handleRegister = (event: FormEvent) => {
    clearErrors();
    event.preventDefault();

    if (!validate()) //don't send a request if validation fails
      return;

    setLoading(true);

    var signUpInfo = {
      username: usernameValue.trim(),
      password: passwordValue.trim(),
      email: emailValue.trim(),
      hasDetailedInfo: hasDetailedInfo,
      ageGroup: ageGroupValue,
      sex: sexValue,
      region: regionValue,
      websiteAddress: window.location.origin,
    } as SignUpModel;

    signUp(signUpInfo)
      .then(async response => {
        if (response.status !== 200) {
          setErrorMessage(await response.text());
        }
        else {
          setSuccessMessage("A confirmation email has been sent to " + emailValue);
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
  };

  function goToMain() {
    navigate("/main");
  }

  function goToLogin() {
    props.setUserCallback(usernameValue);
    navigate("../login");
  }

  return (
    <div className="pageContainer">
      <div className="titleContainer" >
        Car Market App
      </div>
      {loading ? <Loading /> : <></>}
      <div className="authContainer" style={{ width: "26em" }}>
        <div className="formTitle">Register</div>
        <form onSubmit={handleRegister} className="authForm">
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
          <div className="inputDiv" style={{ marginTop: "1em", marginBottom: ".5em" }}>
            <FormControlLabel
              control={<Checkbox checked={hasDetailedInfo} onChange={(event) => setHasDetailedInfo(event.target.checked)} />}
              label={<Typography sx={{ textAlign: "left" }}>[OPTIONAL] I want to give some info about myself in order to get recommendations</Typography>}
            />
          </div>
          <div className="inputDiv" style={{display: "flex", flexDirection:"row", justifyContent:"space-between"}}>
            {hasDetailedInfo ?
              <>
                <TextField value={ageGroupValue} label="Age group" margin="dense" select sx={{width: "32%"}}
                  onChange={(event) => setAgeGroupValue(event.target.value as AgeGroupEnum)}>
                  {ageGroups.map((entry) => (
                    <MenuItem key={entry[0]} value={entry[1]}>
                      {entry[0]}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField value={regionValue} label="Region" margin="dense" select sx={{width: "32%"}}
                  onChange={(event) => setRegionValue(event.target.value as RegionEnum)}>
                  {regions.map((entry) => (
                    <MenuItem key={entry[0]} value={entry[1]}>
                      {entry[0]}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField value={sexValue} label="Sex" margin="dense" select sx={{width: "32%"}}
                  onChange={(event) => setSexValue(event.target.value as SexEnum)}>
                  {sexes.map((entry) => (
                    <MenuItem key={entry[0]} value={entry[1]}>
                      {entry[0]}
                    </MenuItem>
                  ))}
                </TextField>
              </>
              :
              <></>
            }
          </div>
          {generateErrorMessage(errorMessage)}
          {generateSuccessMessage(successMessage)}
          <div className="buttonDiv">
            <Button disabled={loading} variant="contained" type="submit">Register</Button>
          </div>
        </form>
        <div> <button onClick={goToMain} className="linkButton">Go to main</button></div>
        <div> Already have an account? <button onClick={goToLogin} className="linkButton">Login</button></div>
      </div>
    </div>
  );
}

export default Register;
