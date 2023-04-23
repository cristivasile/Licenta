import { apiUrl } from "../constants";
import { store } from "../redux/store";
import { authenticatedFetch } from "./authenticatedFetch";

const adminRoleSet = new Set<string>(["admin", "sysadmin"]);
const sysadminRole = "sysadmin";
/**
 * Checks whether the current user is an admin
 * @param role the user's role
 */
export const isAdmin = (role: string): boolean => {
  if (adminRoleSet.has(role.toLowerCase()))
    return true;
  return false;
}

/**
 * Checks whether the current user is a sysadmin
 * @param role the user's role
 */
export const isSysAdmin = (role: string): boolean => {
  if (role.toLowerCase() === sysadminRole)
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

export const signUp = (username: string, password: string, email: string, websiteAddress: string): Promise<Response> => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, username: username, password: password, websiteConfirmationPageLink: websiteAddress + "/auth/confirmation/" })
      };

  return fetch(apiUrl + "/api/auth/signUp", requestOptions);
}

export const signUpAdmin = (username: string, password: string, email: string, websiteAddress: string): Promise<Response> => {
  const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token },
      body: JSON.stringify({ email: email, username: username, password: password, websiteConfirmationPageLink: websiteAddress + "/auth/confirmation/"})
    };

return authenticatedFetch(apiUrl + "/api/auth/signUpAdmin", requestOptions);
}

export const getUsernames = () : Promise<Response> => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + store.getState().user.token }
  };
  return authenticatedFetch(apiUrl + "/api/auth/getUsernames", requestOptions);
}

export const confirmEmail = (token: string) : Promise<Response> => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' } 
  };
  return fetch(apiUrl + "/api/auth/confirmEmail/" + token, requestOptions);
}

export const requestPasswordReset = (username: string, email: string, websiteAddress: string): Promise<Response> => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, username: username, websiteResetPasswordLink: websiteAddress + "/auth/resetPassword/"})
  };
  return fetch(apiUrl + "/api/auth/passwordResetRequest", requestOptions);
}

export const resetPassword = (username: string, newPassword: string, token: string): Promise<Response> => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username, newPassword: newPassword, token: token})
  };
  return fetch(apiUrl + "/api/auth/passwordReset", requestOptions);
}

