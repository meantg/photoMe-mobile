import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import UserModel from "../../../values/models/UserModel";

type UserState = {
    addresss: string,
    age : number,
    createdAt: Date,
    dateOfBirth: Date,
    id : string,
    userName: string,
    email: string;
    name: string;
    phone: string;
    role: string;
    gender: string;
} | null;

const initialState = null as UserState;

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState | null>) {
            if (action.payload === null) {
                return null;
            }
            const { ...userProps } = action.payload;
            return { ...userProps };
        }
    },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;