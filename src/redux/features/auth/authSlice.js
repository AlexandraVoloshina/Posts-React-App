import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from '../../../utils/axios';

const initialState = {
    user: null,
    token: null,
    isLoading: false,
    status: null,
}

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async ({ username, password }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/auth/register', {
                username,
                password,
            })
            if(data && data.token){
                window.localStorage.setItem('myAppToken', data.token)
            }
            return data
        } catch (error){
            console.error(error);
            return rejectWithValue(error.response.data); // Reject the promise with the error data
        }
    }
)

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ username, password }) => {
        try {
            const { data } = await axios.post('/auth/login', {
                username,
                password,
            })
            if(data.token){
                window.localStorage.setItem('myAppToken', data.token)
            }
            return data
        } catch (error){
            console.error(error);
        }
    }
)

export const isAuth = createAsyncThunk(
    'auth/me',
    async ({ rejectWithValue }) => {
        try {
            const { data } = await axios.get('/auth/me')
            if(data.token){
                window.localStorage.setItem('myAppToken', data.token)
            }
            return data
        } catch (error){
            console.error(error);
            return rejectWithValue(error.response.data); // Reject the promise with the error data
        }
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
            state.token = null
            state.isLoading = false
            state.status = null
        }
    },
    extraReducers: (builder) => {
        builder
        //Register user
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.status = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.status = action.payload.message;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = action.payload?.message || 'Something went wrong';
                state.isLoading = false;
            })
        //Login user
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.status = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.status = action.payload?.message;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = action.payload?.message || 'Something went wrong';
                state.isLoading = false;
            })
        //is Autorization
            .addCase(isAuth.pending, (state) => {
                state.isLoading = true;
                state.status = null;
            })
            .addCase(isAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.status = null;
                state.user = action.payload?.user;
                state.token = action.payload?.token;
            })
            .addCase(isAuth.rejected, (state, action) => {
                state.status = action.payload?.message || 'Something went wrong';
                state.isLoading = false;
            });
    }
})

export const checkIsAuth = (state) => Boolean(state.auth.token)

export const {logout} = authSlice.actions

export default authSlice.reducer;