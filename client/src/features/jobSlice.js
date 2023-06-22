import { createSlice } from '@reduxjs/toolkit'

export const jobSlice = createSlice({
    name: 'job',
    initialState: {
        value: {
            _id:'',
            postedBy:'',
            companyLogo:'',
            companyName:'',
            createdAt:'',
            jobRole:'',
            keySkills:[],
            location:'',
            Experience:{min:0,max:0},
            jobDescription:'',
            salaryRange:{min:0,max:0}
        },
    },
    reducers: {
        jobDetails: (state, action) => {
            state.value = {...action.payload };
        }
    },
})

export const { jobDetails } = jobSlice.actions

export default jobSlice.reducer