import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import './Error404.scss';

interface Error404Props {}

const Error404: FC<Error404Props> = () => {
  
  const navigate = useNavigate();
  
  function goBack(){
    navigate("/main");
  }

  return(
  <div className="Error404">
    <div className="Content">
      Oh no! The page you are looking for does not exist. <button onClick={goBack} className="linkButton light large">Go back</button>
    </div>
  </div>
);}

export default Error404;
