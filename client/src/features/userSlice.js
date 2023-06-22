import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        value: { id:'',username:'',email:'',recruiter:false,appliedJob:[],accesstoken:'',refreshtoken:'' },
    },
    reducers: {
        Login: (state, action) => {
            state.value = {...state.value,...action.payload};
        },
        Logout: (state) => {
            state.value= { id:'',username:'',email:'',recruiter:false,appliedJob:[],accesstoken:'',refreshtoken:'' }
        }
    },
})

export const { Login, Logout } = userSlice.actions

export default userSlice.reducer