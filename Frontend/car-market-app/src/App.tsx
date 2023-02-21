import { BrowserRouter as Router, Navigate, Outlet, Route, Routes} from "react-router-dom";
import './App.scss';
import Error404 from './components/Error404/Error404';
import { createTheme, ThemeProvider } from '@mui/material';
import { RootState } from './redux/store';
import { useAppSelector } from './hooks';
import Auth from "./components/Auth/Auth";
import Main from "./components/Main/Main";

function PrivateOutlet() {
  const isLogged = useAppSelector((state: RootState) => state.user.isLogged);
  return isLogged ? <Outlet /> : <Navigate to="/auth" />;
}

function App() {
  const materialTheme = createTheme({
    palette: {
      primary: {
        main: "#063970"
      },
      secondary: {
        main: "#40b2d4"
      } 
    }
  });

  return (
    <ThemeProvider theme={materialTheme}>
      <title>Test</title>
      <div className="App">
        <Router>
          <Routes>  
            <Route path="/" element={<Navigate to="main"/>}/>  {/*redirect empty route to main page*/}
            <Route path="/auth/*" element={<Auth />}/>
            <Route path="/main/*" element={<PrivateOutlet />}> {/*private main page route*/}
              <Route path="*" element={<Main/>}/>
            </Route>
            <Route path="*" element={<Error404 />}/>  {/*Any other route goes to 404*/}
          </Routes>
        </Router>
      </div>
    </ThemeProvider>

  );
}

export default App;
