import { apiUrl } from "../constants";
import { store } from "../redux/store";
import { authenticatedFetch } from "./authenticatedFetch";

const adminRoleSet = new Set<string>(["admin", "sysadmin"]);
/**
 * Checks whether the current user is an admin
 * @param role the user's role
 */
export const isAdmin = (role: string): boolean => {
  if (adminRoleSet.has(role.toLowerCase()))
    return true;
  return false;
}

export const logIn = (username: string, password: string): Promise<Response> => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password })
      };
  return fetch(apiUrl + "/api/auth/login", requestOptions);
}

export const signUp = (username: string, password: string, email: string): Promise<Response> => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, username: username, password: password })
      };

  return fetch(apiUrl + "/api/auth/signUp", requestOptions);
}

export const getUsernames = () : Promise<Response> => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token }
  };
  return authenticatedFetch(apiUrl + "/api/auth/getUsernames", requestOptions);
}