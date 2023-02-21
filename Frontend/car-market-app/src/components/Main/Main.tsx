import { FC} from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import './Main.scss';
import LogoutIcon from '@mui/icons-material/Logout';
import { Button } from '@mui/material';
import { roleLocalStoragePath, tokenLocalStoragePath, userLocalStoragePath } from '../../constants';
import { logout } from '../../redux/user';
import { Navigate, Route, Routes } from 'react-router-dom';
import Vehicles from './Vehicles/Vehicles';
import Error404 from '../Error404/Error404';

interface MainProps { 
}

const Main: FC<MainProps> = (props: MainProps) => {
  const userName = useAppSelector((state) => state.user.loggedUser);
  const dispatch = useAppDispatch();

  function logoutFunction(){
    localStorage.removeItem(tokenLocalStoragePath);
    localStorage.removeItem(roleLocalStoragePath);
    localStorage.removeItem(userLocalStoragePath);

    //set values in redux
    dispatch(logout());
  }

  return (
    <div className="pageContainer">
        <div className="mainContainer">
            <div className="header">
                <div className="messageContainer">
                    Hello, <span className="usernameSpan">{" " + userName} </span> !
                </div>
                <div className="fillerDiv"/>
                <div className="buttonContainer">
                    <Button color="warning" variant="contained" size='small' onClick={logoutFunction}>
                        <LogoutIcon />
                    </Button>
                </div>
            </div>
            <div className="content">
            <Routes>
                <Route path="" element={<Navigate to="vehicles"/>}/>
                <Route path="vehicles" element={<Vehicles/>}/>
                <Route path="*" element={<Error404 />}/>  {/*Any other route goes to 404*/}
            </Routes>
            </div>
        </div>
    </div>
  );
}

export default Main;