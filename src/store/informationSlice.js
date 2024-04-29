import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'author',
    initialState: {
        information: {},
    },
    reducers: {
        setInformation: (state, action) => {
            state.information = action.payload
        },
    },
})
// each case under reducers becomes an action
export const { setInformation } = userSlice.actions
export default userSlice.reducer