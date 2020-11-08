import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "../slices/userSlices";
const rootReducer = combineReducers({
    user: userSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;