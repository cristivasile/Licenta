import { apiUrl } from "../constants";

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
