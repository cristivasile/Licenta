import {store} from "../redux/store"
import { sessionExpired, unauthorized } from "../redux/userStore";

//if the response is 401 or 403 the user will be logged out
export const authenticatedFetch = async (input: RequestInfo | URL, init?: RequestInit | undefined) : Promise<Response> =>
{
    const result = await fetch(input, init);
    if (result.status === 401) {
        store.dispatch(sessionExpired());
        return Promise.reject("Token has expired!");
    }
    else if(result.status === 403){
        store.dispatch(unauthorized());
        return Promise.reject("Unaothorized!");
    }
    else {
        return result;
    }
}

