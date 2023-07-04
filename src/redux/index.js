import { configureStore } from "@reduxjs/toolkit";
import calendarReducer from "./slices/calendarSLice";


export const store = configureStore({
    reducer: {
        date: calendarReducer
    }
})