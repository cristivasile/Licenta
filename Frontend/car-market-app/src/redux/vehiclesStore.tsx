import {createSlice} from "@reduxjs/toolkit";
import { mapJsonToVehicleModels, ShortVehicleModel } from "../models/VehicleModel";

export const vehicleSlice = createSlice({
    name: "vehiclesState",
    initialState: {
        vehicles: new Array<ShortVehicleModel>(),
    },
    reducers: {
        setVehiclesFromJson: (state, action) => {
            state.vehicles = mapJsonToVehicleModels(action.payload);
        }
    }
},);

export const {setVehiclesFromJson} = vehicleSlice.actions;
export default vehicleSlice.reducer;