import { createSlice } from "@reduxjs/toolkit";
import { FeatureModel, mapJsonToFeatureModels } from "../models/FeatureModel";

export const featureSlice = createSlice({
    name: "featureState",
    initialState: {
        features: new Array<FeatureModel>(),
    },
    reducers: {
        setFeaturesFromJson: (state, action) => {
            state.features = mapJsonToFeatureModels(action.payload);
        },
        addFeature: (state, action) => {
            state.features.push(action.payload);
        },
        removeFeatureById: (state, action) => {
            state.features = state.features.filter(feature => feature.id !== action.payload.id);
        },
        updateFeatureById: (state, action) => {
            for (let i = 0; i < state.features.length; i++)
                if (state.features[i].id === action.payload.id) {
                    state.features[i].name = action.payload.updatedName;
                }
        }
    },
});

export const { setFeaturesFromJson, addFeature, removeFeatureById, updateFeatureById } = featureSlice.actions;
export default featureSlice.reducer;