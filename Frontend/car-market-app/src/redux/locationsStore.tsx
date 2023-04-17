import { createSlice } from "@reduxjs/toolkit";
import { LocationModel, mapJsonToLocationModels } from "../models/LocationModel";

export const locationsSlice = createSlice({
    name: "locationState",
    initialState: {
        locations: new Array<LocationModel>(),
    },
    reducers: {
        setLocationsFromJson: (state, action) => {
            state.locations = mapJsonToLocationModels(action.payload);
        },
        addLocation: (state, action) => {
            state.locations.push(action.payload);
        },
        removeLocationById: (state, action) => {
            state.locations = state.locations.filter(location => location.id !== action.payload.id);
        },
        updateLocationById: (state, action) => {
            for (let i = 0; i < state.locations.length; i++)
                if (state.locations[i].id === action.payload.id) {
                    state.locations[i].address = action.payload.updatedAddress;
                    state.locations[i].city = action.payload.updatedCity;
                    state.locations[i].schedules = action.payload.schedules;
                }
        }
    },
});

export const { setLocationsFromJson, addLocation, removeLocationById, updateLocationById } = locationsSlice.actions;
export default locationsSlice.reducer;