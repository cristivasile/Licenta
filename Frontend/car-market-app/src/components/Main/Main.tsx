import { FC } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import './Main.scss';
import LogoutIcon from '@mui/icons-material/Logout';
import { Button, Typography } from '@mui/material';
import { roleLocalStoragePath, tokenLocalStoragePath, userLocalStoragePath } from '../../constants';
import { forcedLogout, logout } from '../../redux/userStore';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Vehicles from './Vehicles/Vehicles';
import Error404 from '../Error404/Error404';
import jwt_decode from "jwt-decode";
import { generateToastError } from '../../services/toastNotificationsService';
import ViewVehicle from './ViewVehicle/ViewVehicle';
import { PrivateOutlet } from '../../App';

interface MainProps {
}

const Main: FC<MainProps> = (props: MainProps) => {
    const userName = useAppSelector((state) => state.user.loggedUser);
    const isLogged = useAppSelector((state) => state.user.isLogged);
    const token = useAppSelector((state) => state.user.token) || "";
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    //check JWT token expiration
    if (isLogged) {
        var decodedToken: any = jwt_decode(token);
        var now = new Date();

        //token has expired, log out
        if (decodedToken.exp * 1000 < now.getTime()) {
            dispatch(forcedLogout());
            localStorage.removeItem(tokenLocalStoragePath);
            localStorage.removeItem(roleLocalStoragePath);
            //do not remove user so the username can be displayed inside the login
            generateToastError("Your session has expired! Please log in again!");
            console.log("Token expired!");
        }
    }

    function goToAuth() {
        navigate("/auth");
    }

    function logoutFunction() {
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
                        {isLogged ?
                            <Typography fontSize={20}>
                                Hello,<span className="usernameSpan">{" " + userName}</span>!
                            </Typography>
                            :
                            <Typography fontSize={20}>
                                Please <button onClick={goToAuth} className="customLinkButton linkButton">log in</button> to access all features
                            </Typography>
                        }
                    </div>
                    <div className="buttonContainer">
                        {isLogged ?
                            <Button color="warning" variant="contained" size='small' onClick={logoutFunction}>
                                <LogoutIcon />
                            </Button>
                            :
                            <></>
                        }
                    </div>
                </div>
                <div className="content">
                    <Routes>
                        <Route path="" element={<Navigate to="vehicles" />} />
                        <Route path="vehicles" element={<Vehicles />} />
                        <Route path="vehicles/view" element={<PrivateOutlet />} >
                            <Route path=":id" element={<ViewVehicle />} />
                        </Route>
                        <Route path="*" element={<Error404 />} />  {/*Any other route goes to 404*/}
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default Main;