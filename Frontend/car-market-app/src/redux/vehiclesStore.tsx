import {createSlice} from "@reduxjs/toolkit";
import { mapJsonToVehicleModels, VehicleModel } from "../models/VehicleModel";

export const vehicleSlice = createSlice({
    name: "vehiclesState",
    initialState: {
        vehicles: new Array<VehicleModel>(),
    },
    reducers: {
        setVehiclesFromJson: (state, action) => {
            state.vehicles = mapJsonToVehicleModels(action.payload);
        }
    }
},);

export const {setVehiclesFromJson} = vehicleSlice.actions;
export default vehicleSlice.reducer;