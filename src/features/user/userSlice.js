import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { addUserToLocalStorage, getUserFromLocalStorage, removeUserFromLocalStorage } from "../../utils/localStorage";
import { loginUserThunk, registerUserThunk, updateUserThunk } from './userThunk'

const initialState = {
    isLoading:false,
    isSidebarOpen: false,
    user: getUserFromLocalStorage()
}

export const registerUser = createAsyncThunk("user/register", async(user, thunkAPI)=>{
    return registerUserThunk('/auth/register', user, thunkAPI);
})
export const loginUser = createAsyncThunk("user/login", async(user, thunkAPI)=>{
    return loginUserThunk('/auth/login', user, thunkAPI)
})
export const updateUser = createAsyncThunk("user/updateUser", async(user, thunkAPI)=>{
    return updateUserThunk('/auth/updateUser', user, thunkAPI)
})

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        logoutUser:(state, {payload})=>{
            state.user = null;
            state.isSidebarOpen = false;
            removeUserFromLocalStorage();
            if (payload) {
                toast.success(payload)
            }
        },
        toggleSidebar:(state)=>{
            state.isSidebarOpen = !state.isSidebarOpen
        }  
    },
    extraReducers:(builder)=>{
        builder.addCase(registerUser.pending, (state)=>{
            state.isLoading = true;
        }).addCase(registerUser.fulfilled, (state, { payload })=>{
            state.isLoading = false;
            const { user } = payload;
            state.user = user;
            addUserToLocalStorage(user)
            toast.success(`Hello there ${user.name}`)
        }).addCase(registerUser.rejected, (state, { payload })=>{
            state.isLoading = false;
            toast.error(payload)
        }).addCase(loginUser.pending, (state)=>{
            state.isLoading = true;
        }).addCase(loginUser.fulfilled, (state, { payload })=>{
            state.isLoading = false;
            const { user } = payload;
            state.user = user;
            addUserToLocalStorage(user)
            toast.success(`Welcome back ${user.name}`)
        }).addCase(loginUser.rejected, (state, { payload })=>{
            state.isLoading = false;
            toast.error(payload)
        }).addCase(updateUser.pending, (state)=>{
            state.isLoading = true;
        }).addCase(updateUser.fulfilled, (state, { payload })=>{
            const { user } = payload;
            state.isLoading = false;
            state.user = user;
            addUserToLocalStorage(user)
            toast.success(`User Updated`)
        }).addCase(updateUser.rejected, (state, { payload })=>{
            state.isLoading = false;
            toast.error(payload)
        })
    }
})

export const { toggleSidebar, logoutUser } = userSlice.actions;
export default userSlice.reducer;