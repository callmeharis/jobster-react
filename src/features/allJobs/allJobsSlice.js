import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { toast } from "react-toastify"
import customFetch from "../../utils/axios"

const initialFilterState = {
    search:'',
    searchStatus:'all',
    searchType:'all',
    sort:'latest',
    sortOptions:['latest', 'oldest', 'a-z', 'z-a']
}
const initialState = {
    isLoading:true,
    jobs:[],
    totalJobs:0,
    numberOfPages:1,
    page:1,
    stats:{},
    monthlyApplications:[],
    ...initialFilterState
}

export const getAllJobs = createAsyncThunk('allJobs/getJobs', async(_, thunkAPI)=>{
    let url = '/jobs'
    try {
        const resp = await customFetch.get(url)
        return resp.data;
    } catch (error) {
        return thunkAPI.rejectWithValue('There was an error')
    }
})

export const showStats = createAsyncThunk('allJobs/showStats', async(_, thunkAPI)=>{
    try {
        const resp = await customFetch.get('/jobs/stats');
        return resp.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.msg)
    }
})


const allJobsSlice = createSlice({
    name:'allJobs',
    initialState,
    reducers:{
        showLoading:(state)=>{
            state.isLoading = true
        },
        hideLoading:(state)=>{
            state.isLoading = false
        },
    },
    extraReducers:(builder)=>{
        builder.addCase(getAllJobs.pending, (state)=>{
            state.isLoading = true;
        }).addCase(getAllJobs.fulfilled, (state, {payload})=>{
            state.isLoading = false;
            state.jobs = payload.jobs;
        }).addCase(getAllJobs.rejected, (state, {payload})=>{
            state.isLoading = false;
            toast.error(payload)
        }).addCase(showStats.pending, (state)=>{
            state.isLoading = true;
        }).addCase(showStats.fulfilled, (state, {payload})=>{
            state.isLoading = false;
            state.stats = payload.defaultStats;
            state.monthlyApplications = payload.monthlyApplications;
        }).addCase(showStats.rejected, (state, {payload})=>{
            state.isLoading = false;
            toast.error(payload)
        })
    }
})
export const { showLoading, hideLoading } = allJobsSlice.actions
export default allJobsSlice.reducer;