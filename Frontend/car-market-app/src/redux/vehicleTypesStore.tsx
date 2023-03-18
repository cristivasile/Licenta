import { createSlice } from "@reduxjs/toolkit";
import { mapJsonDictToVehicleTypeModels, VehicleTypeModel } from "../models/VehicleTypeModel";

export const vehicleTypeSlice = createSlice({
    name: "vehicleState",
    initialState: {
        vehicleTypes: new Array<VehicleTypeModel>(),
    },
    reducers: {
        setVehicleTypesFromJson: (state, action) => {
            state.vehicleTypes = mapJsonDictToVehicleTypeModels(action.payload);
        }
    },
});

export const { setVehicleTypesFromJson} = vehicleTypeSlice.actions;
export default vehicleTypeSlice.reducer;