import { createSlice } from "@reduxjs/toolkit";
import { FeatureModel, mapJsonToFeatureModels } from "../models/FeatureModel";

function sortFeatures(input: FeatureModel[]): void {
    input.sort((x1, x2) => x1.name < x2.name ? -1 : 1);
}

export const featureSlice = createSlice({
    name: "vehicleState",
    initialState: {
        features: new Array<FeatureModel>(),
    },
    reducers: {
        setFeaturesFromJson: (state, action) => {
            state.features = mapJsonToFeatureModels(action.payload);
            sortFeatures(state.features);
        },
        addFeature: (state, action) => {
            state.features.push(action.payload);
            sortFeatures(state.features);
        },
        removeFeatureById: (state, action) => {
            state.features = state.features.filter(feature => feature.id !== action.payload.id);
        },
        updateFeatureById: (state, action) => {
            for (let i = 0; i < state.features.length; i++)
                if (state.features[i].id === action.payload.id) {
                    state.features[i].name = action.payload.updatedName;
                }
            sortFeatures(state.features);
        }
    },
});

export const { setFeaturesFromJson, addFeature, removeFeatureById, updateFeatureById } = featureSlice.actions;
export default featureSlice.reducer;