import { createSlice } from "@reduxjs/toolkit";
import { hasRecommendationsLocalStoragePath, roleLocalStoragePath, tokenLocalStoragePath, userLocalStoragePath } from "../constants";

function userIsLogged() {
    return localStorage.getItem(tokenLocalStoragePath) !== null;
}

function getLocalStorageString(key: string) {
    if (localStorage.getItem(key) === null) {
        return ""
    }
    else
        return localStorage.getItem(key);
}

function clearLocalStorage() {
    localStorage.setItem(tokenLocalStoragePath, "");
    localStorage.setItem(hasRecommendationsLocalStoragePath, JSON.stringify(false));
    localStorage.setItem(roleLocalStoragePath, "");
}

export const userSlice = createSlice({
    name: "userState",
    initialState: {
        isLogged: userIsLogged(),
        loggedUser: getLocalStorageString(userLocalStoragePath),
        token: getLocalStorageString(tokenLocalStoragePath),
        role: getLocalStorageString(roleLocalStoragePath),
        hasRecommendations: JSON.parse(getLocalStorageString(hasRecommendationsLocalStoragePath) || "false"),
    },
    reducers: {
        login: (state) => {
            state.isLogged = true;
        },
        logout: (state) => {
            state.isLogged = false;
            state.loggedUser = "";
            state.token = "";
            state.role = "";
            state.hasRecommendations = false;
            clearLocalStorage();
        },
        forcedLogout: (state) => {
            //state.loggedUser = state.loggedUser; do not reset username
            state.isLogged = false;
            state.token = "";
            state.role = "";
            clearLocalStorage();
        },
        setUser: (state, action) => {
            state.loggedUser = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setRole: (state, action) => {
            state.role = action.payload;
        },
        setHasRecommendations: (state, action) => {
            state.hasRecommendations = action.payload;
        }
    },
});

export const { login, logout, forcedLogout, setUser, setToken, setRole, setHasRecommendations } = userSlice.actions;
export default userSlice.reducer;