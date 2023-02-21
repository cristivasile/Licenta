import {createSlice} from "@reduxjs/toolkit";
import { mapJsonToVehicleModels, VehicleModel } from "../models/VehicleModel";

export const vehicleSlice = createSlice({
    name: "vehiclesState",
    initialState: {
        vehicles: new Array<VehicleModel>(),
    },
    reducers: {
        setVehicles: (state, action) => {
            state.vehicles = mapJsonToVehicleModels(action.payload);
        }
    }
},);

export const {setVehicles} = vehicleSlice.actions;
export default vehicleSlice.reducer;