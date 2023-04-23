import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import './Error404.scss';
import { Typography } from '@mui/material';

interface Error404Props {}

const Error404: FC<Error404Props> = () => {
  
  const navigate = useNavigate();
  
  function goBack(){
    navigate("/main");
  }

  return(
  <div className="Error404">
    <div className="Content">
      <Typography fontSize={30}>
        Oh no! The page you are looking for does not exist. <button onClick={goBack} className="linkButton light large">Go to main</button>
      </Typography>
    </div>
  </div>
);}

export default Error404;
