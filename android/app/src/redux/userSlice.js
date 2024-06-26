import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import {getAuth,signInWithEmailAndPassword} from 'firebase/auth'



export const login =createAsyncThunk('user/login',async({username,password})=> {

    try {
        const auth =getAuth();
        const userCredential =await signInWithEmailAndPassword(auth,username,password)
        const user=userCredential.user;
        const token = user.stsTokenManager.accessToken;

        const userData={
            token,
            user:user,


        }
        return userData
        } catch (error) {
        console.log("userSlice 21 line",error)
        throw error
    }
})

const initialState = {
    email: null,
    password: null,
    isLoading: false,
    isAuth: false,
    token: null,
    user: null,
    error: null,

}

export const userSlice = createSlice({

    name: 'user',
    initialState,
    reducers: {
        setEmail: (state,action) => {
            state.email=action.payload
        },
        setPassword: (state,action) => {
            state.password=action.payload
        },
        setisLoading: (state,action) => {
            state.isLoading=action.payload
        },
        extraReducer:(builder)=>{
            builder
            .addCase(login.pending,(state)=>{
                state.isLoading =true;
                state.isAuth=false
            })
            .addCase(login.fulfilled,(state)=>{
                state.isLoading =false;
                state.isAuth=true
                state.user = action.payload.user;
                state.token = action.payload.token;


            })
            .addCase(login.rejected,(state,action)=>{
                state.isLoading =false;
                state.isAuth=false;
                state.error= action.error.message;
            })
        

        }
    }
})

export const { setEmail,setPassword,setisLoading} = userSlice.actions

export default userSlice.reducer;