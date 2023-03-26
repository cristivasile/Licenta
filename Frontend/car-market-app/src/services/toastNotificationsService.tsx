import { toast } from "react-toastify";

const defaultErrorTimeout: number = 5000;
/**
 * Generates a toast error card.
 * @param reason the error reason
 * @param timeout optional timeout, should be 'false' or a number
 */
export function generateToastError(reason: String, timeout: any = defaultErrorTimeout) {
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

/**
 * Notifies the user that a fetch operation has failed i.e. an Exception was raised.
 * @param err The error message in the raised exception
 * @param timeout The timeout, should be false or a number
 */
export function notifyFetchFail(err: Error, timeout: any = defaultErrorTimeout) {
    if (err.message === "Failed to fetch") {
        generateToastError("The server did not respond!", timeout);
    }
    else {
        generateToastError("An unexpected error happened!", timeout);
        console.log(err.message);
    }
}

/**
 * Notifies the user that a fetch operation has returned an error code.
 * @param resultCode The result code received
 * @param timeout The timeout, should be false or a number
 */
export function notifyBadResultCode(resultCode: number, timeout: any = defaultErrorTimeout){
    generateToastError("The server returned " + resultCode + "!", timeout);
}