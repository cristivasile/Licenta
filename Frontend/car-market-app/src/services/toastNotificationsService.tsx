import { toast } from "react-toastify";

const defaultErrorTimeout: number = 15000;
export function generateToastError(reason: String, timeout: number = defaultErrorTimeout){
    toast.error(reason, {
        position: "bottom-right",
        autoClose: timeout,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
}