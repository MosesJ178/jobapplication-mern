import { createSlice } from '@reduxjs/toolkit'

export const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        value: {
            username: '', email: '', phoneNumber: 0, company: '', keySkills: [],
            employmentType: '', roleType: '', location: '', recruiter: false
        },
    },
    reducers: {
        Updateprofile: (state, action) => {
            state.value = {...state.value,...action.payload };
        }
    },
})

export const { Updateprofile } = profileSlice.actions

export default profileSlice.reducer