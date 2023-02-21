import {configureStore} from '@reduxjs/toolkit';
import userReducer from './userStore';
import locationsReducer from './locationsStore';
import vehiclesReducer from './vehiclesStore';

export const store = configureStore({
    reducer: {
        user: userReducer,
        location: locationsReducer,
        vehicle: vehiclesReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch