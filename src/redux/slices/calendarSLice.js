import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const getDataAction = createAsyncThunk(
    'getDataAction',
    async () => {
        try{
            const response = await axios.get('https://dpg.gg/test/calendar.json')
            const data = await response.data
            console.log(data)
            return data
        } catch(e) {
            console.error(e);
        }
    }
)

const calendarSlice = createSlice({
    name: 'calendarSlice',
    initialState: {
        date: {}
    },
    reducers: {

    }, 
    extraReducers: builder => {
        builder.addCase(getDataAction.fulfilled, (state, action) => {
            state.date = action.payload
        })
    }
})


export const {} = calendarSlice.actions
export default calendarSlice.reducer