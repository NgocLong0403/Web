import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        login: {
            currentUser: null,
            isFetching: false,
            error: false
        },
        register: {
            isFetching: false,
            error: false,
            success: false
        },
        forgotPassword: {
            isFetching: false,
            currentEmail: false,
            error: false,
        },
        newPassword: {
            isFetching: false,
            passwordReset: false,
            error: false,
        }
    },
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        loginFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        registerStart: (state) => {
            state.register.isFetching = true;
        },
        registerSuccess: (state) => {
            state.register.isFetching = false;
            state.register.error = false;
            state.register.success = true;
        },
        registerFailed: (state) => {
            state.register.isFetching = false;
            state.register.error = true;
            state.register.success = false;
        },
        logOutSuccess: (state) => {
            state.login.isFetching = false;
            state.login.currentUser = null;
            state.login.error = false;
        },
        logOutFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        logOutStart: (state) => {
            state.login.isFetching = true;
        },
        forgotPasswordStart: (state) => {
            state.forgotPassword.isFetching = true;
        },
        forgotPasswordSuccess: (state, action) => {
            state.forgotPassword.isFetching = false;
            state.forgotPassword.currentEmail = action.payload;
            state.forgotPassword.error = false;
        },
        forgotPasswordFailed: (state) => {
            state.forgotPassword.isFetching = false;
            state.forgotPassword.error = true;
        },
        resetPasswordStart: (state) => {

        },
        reserPasswordSuccess: (state) => {

        },
        resetPasswordFailed: (state) => {

        },

    }
});

export const {
    loginStart,
    loginFailed,
    loginSuccess,
    registerStart,
    registerSuccess,
    registerFailed,
    logOutStart,
    logOutSuccess,
    logOutFailed,
    forgotPasswordStart,
    forgotPasswordSuccess,
    forgotPasswordFailed,
    resetPasswordStart,
    reserPasswordSuccess,
    resetPasswordFailed
} = authSlice.actions;

export default authSlice.reducer;