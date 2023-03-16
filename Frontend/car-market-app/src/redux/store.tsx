import {configureStore} from '@reduxjs/toolkit';
import userReducer from './userStore';
import locationsReducer from './locationsStore';
import vehiclesReducer from './vehiclesStore';
import featuresReducer from './featuresStore';

export const store = configureStore({
    reducer: {
        user: userReducer,
        location: locationsReducer,
        vehicle: vehiclesReducer,
        feature: featuresReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch