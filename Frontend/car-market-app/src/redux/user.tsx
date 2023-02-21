import {createSlice} from "@reduxjs/toolkit";
import { roleLocalStoragePath, tokenLocalStoragePath, userLocalStoragePath } from "../constants";

function userIsLogged() {
    return localStorage.getItem(tokenLocalStoragePath) !== null;
}

function getLocalStorageString(key: string){
    if (localStorage.getItem(key) === null) {
        return ""
    }
    else
        return localStorage.getItem(key);
}

export const userSlice = createSlice({
    name: "userState",
    initialState: {
        isLogged: userIsLogged(),
        loggedUser: getLocalStorageString(userLocalStoragePath),
        token: getLocalStorageString(tokenLocalStoragePath),
        role: getLocalStorageString(roleLocalStoragePath),
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
        },
        setUser: (state, action) => {
            state.loggedUser = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setRole: (state, action) => {
            state.role = action.payload;
        }
    },
});

export const {login, logout, setUser, setToken, setRole} = userSlice.actions;
export default userSlice.reducer;