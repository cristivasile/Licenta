import { createSlice } from "@reduxjs/toolkit";
import { BodyTypeModel, mapJsonToBodyTypeModels } from "../models/BodyTypeModel";

function sortBodyTypes(input: BodyTypeModel[]): void {
    input.sort((x1, x2) => x1.name < x2.name ? -1 : 1);
}

export const bodyTypeSlice = createSlice({
    name: "vehicleState",
    initialState: {
        bodyTypes: new Array<BodyTypeModel>(),
    },
    reducers: {
        setBodyTypesFromJson: (state, action) => {
            state.bodyTypes = mapJsonToBodyTypeModels(action.payload);
            sortBodyTypes(state.bodyTypes);
        },
        addBodyType: (state, action) => {
            state.bodyTypes.push(action.payload);
            sortBodyTypes(state.bodyTypes);
        },
        removeBodyTypeByName: (state, action) => {
            state.bodyTypes = state.bodyTypes.filter(bodyType => bodyType.name !== action.payload.name);
        }
    },
});

export const { setBodyTypesFromJson, addBodyType, removeBodyTypeByName} = bodyTypeSlice.actions;
export default bodyTypeSlice.reducer;