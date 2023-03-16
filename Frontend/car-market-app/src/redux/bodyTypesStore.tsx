import { createSlice } from "@reduxjs/toolkit";
import { BodyTypeModel, mapJsonToBodyTypeModels } from "../models/BodyTypeModel";

export const bodyTypeSlice = createSlice({
    name: "featureState",
    initialState: {
        bodyTypes: new Array<BodyTypeModel>(),
    },
    reducers: {
        setBodyTypesFromJson: (state, action) => {
            state.bodyTypes = mapJsonToBodyTypeModels(action.payload);
        },
        addBodyType: (state, action) => {
            state.bodyTypes.push(action.payload);
        },
        removeBodyTypeByName: (state, action) => {
            state.bodyTypes = state.bodyTypes.filter(bodyType => bodyType.name !== action.payload.name);
        }
    },
});

export const { setBodyTypesFromJson, addBodyType, removeBodyTypeByName} = bodyTypeSlice.actions;
export default bodyTypeSlice.reducer;