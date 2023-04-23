import { FC, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import Error404 from '../Error404/Error404';
import './Auth.scss';
import Login from './Login';
import Register from './Register';
import Confirmation from './Confirmation';
import PasswordResetRequest from './PasswordResetRequest';
import PasswordReset from './PasswordReset';

interface AuthProps {}

const Auth: FC<AuthProps> = () => {
  const [authUser, setAuthUser] = useState("");

  //get the user in case of timeout
  var loggedUser = useAppSelector((state) => state.user.loggedUser) || "";
  
  if(authUser === "" && loggedUser !== "")
    setAuthUser(loggedUser);

  const loginProps = {
    userName: authUser,
    setUserCallback: setAuthUser
  }

  const registerProps = loginProps;
  
  const confirmationProps = {
    setUserCallback: setAuthUser
  }

  const resetPasswordProps = confirmationProps;

  return (
    <div className="Auth">
      <Routes>
        <Route path="" element={<Navigate to="login"/>}/> {/*redirect empty auth to login page*/}
        <Route path="login" element={<Login {...loginProps} />}/>
        <Route path="register" element={<Register {...registerProps}/>}/>
        <Route path="confirmation/:token" element={<Confirmation {...confirmationProps}/>}/>
        <Route path="resetPassword/:username/:token" element={<PasswordReset {...resetPasswordProps}/>}/>
        <Route path="requestPasswordReset" element={<PasswordResetRequest/>}/>
        <Route path="*" element={<Error404 />}/>  {/*Any other route goes to 404*/}
      </Routes>
    </div>
);
}

export default Auth;
