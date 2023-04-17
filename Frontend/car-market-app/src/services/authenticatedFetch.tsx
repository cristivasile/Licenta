import { store } from "../redux/store"
import { forcedLogout } from "../redux/userStore";
import { generateToastError } from "./toastNotificationsService";

const errorReasons = new Map<number, string>([
    [401, "Your session has expired. Please log in again!"], 
    [403, "You are unauthorised for this action!"]]);

//if the response is 401 or 403 the user will be logged out
export const authenticatedFetch = async (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> => {
    const result = await fetch(input, init);
    if (result.status === 401 || result.status === 403) {
        store.dispatch(forcedLogout()); //log the user out
        //notify reason
        generateToastError(errorReasons.get(result.status) || "");
        return Promise.reject("Token has expired!");
    }
    else {
        return result;
    }
}