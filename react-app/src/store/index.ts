import { configureStore } from '@reduxjs/toolkit'
import timesheetReducer from './timesheetSlice'
import userReducer from './userSlice'

const store = configureStore({
  reducer: {
    timesheet: timesheetReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store