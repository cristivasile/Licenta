import { createSlice } from "@reduxjs/toolkit";

export const filtersSlice = createSlice({
    name: "filtersState",
    initialState: {
        vehiclesPerPage: 5,
        selectedPage: 1,
        brandFilter: "",
        modelFilter: "",
        bodyTypeFilter: "",
        maxMileageFilter: NaN,
        minPriceFilter: NaN,
        maxPriceFilter: NaN,
        minPowerFilter: NaN,
        maxPowerFilter: NaN,
        minYearFilter: NaN,
        transmissionFilter: '',
        sortType: '',
        sortAscending: true,
    },
    reducers: {
        setVehiclesPerPage: (state, action) => {
            state.vehiclesPerPage = action.payload;
        },
        setSelectedPage: (state, action) => {
            state.selectedPage = action.payload;
        },
        setBrandFilter: (state, action) => {
            state.brandFilter = action.payload;
        },
        setModelFilter: (state, action) => {
            state.modelFilter = action.payload;
        },
        setBodyTypeFilter: (state, action) => {
            state.bodyTypeFilter = action.payload;
        },
        setMaxMileageFilter: (state, action) => {
            state.maxMileageFilter = action.payload;
        },
        setMinPriceFilter: (state, action) => {
            state.minPriceFilter = action.payload;
        },
        setMaxPriceFilter: (state, action) => {
            state.maxPriceFilter = action.payload;
        },
        setMinPowerFilter: (state, action) => {
            state.minPowerFilter = action.payload;
        },
        setMaxPowerFilter: (state, action) => {
            state.maxPowerFilter = action.payload;
        },
        setMinYearFilter: (state, action) => {
            state.minYearFilter = action.payload;
        },
        setTransmissionFilter: (state, action) => {
            state.transmissionFilter = action.payload;
        },
        setSortTypeFilter: (state, action) => {
            state.sortType = action.payload;
        },
        setSortAscending: (state, action) => {
            state.sortAscending = action.payload;
        }
    },
});

export const { setVehiclesPerPage, setSelectedPage, setBrandFilter, setModelFilter, setBodyTypeFilter, setMaxMileageFilter, setMinPriceFilter,
    setMaxPriceFilter, setMinPowerFilter, setMaxPowerFilter, setMinYearFilter, setTransmissionFilter, setSortTypeFilter, setSortAscending }
    = filtersSlice.actions;
export default filtersSlice.reducer;