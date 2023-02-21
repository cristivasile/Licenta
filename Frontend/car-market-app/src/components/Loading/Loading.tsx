import { FC } from "react";
import "./Loading.scss";

interface LoadingProps {}

const Loading: FC<LoadingProps> = () => {
  
  return (
    <div className="container">
      <div className="spinner dark">
      </div>
    </div>
);
}

export default Loading;