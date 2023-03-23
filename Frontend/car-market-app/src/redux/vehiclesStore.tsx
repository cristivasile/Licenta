import {createSlice} from "@reduxjs/toolkit";
import { mapJsonToShortVehicleModels, SimplifiedVehicleModel } from "../models/VehicleModel";

export const vehicleSlice = createSlice({
    name: "vehiclesState",
    initialState: {
        vehicles: new Array<SimplifiedVehicleModel>(),
    },
    reducers: {
        setVehiclesFromJson: (state, action) => {
            state.vehicles = mapJsonToShortVehicleModels(action.payload);
        }
    }
},);

export const {setVehiclesFromJson} = vehicleSlice.actions;
export default vehicleSlice.reducer;