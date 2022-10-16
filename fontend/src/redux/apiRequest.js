import axios from "axios";
import { forgotPasswordSuccess, loginFailed, loginStart, loginSuccess, logOutFailed, logOutStart, logOutSuccess, registerFailed, registerStart, registerSuccess, reserPasswordSuccess, resetPasswordFailed, resetPasswordStart } from "./authSlice";
import { deleteUserFalse, deleteUserStart, deleteUserSuccess, getUserFailed, getUserStart, getUserSuccess } from "./userSlice";
import { forgotPasswordStart, } from "./authSlice";

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("/v1/auth/login", user);
        dispatch(loginSuccess(res.data));
        navigate("/");
    } catch (err) {
        dispatch(loginFailed());
    }
};

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        await axios.post("/v1/auth/register", user);
        dispatch(registerSuccess());
        navigate("/login");
    } catch (err) {
        dispatch(registerFailed());
    }
};

export const getAllUsers = async (accessToken, dispatch, axiosJWT) => {
    dispatch(getUserStart());
    try {
        const res = await axiosJWT.get("/v1/user", {
            headers: { token: `Bearer ${accessToken}` },
        })
        dispatch(getUserSuccess(res.data));
    } catch (err) {
        dispatch(getUserFailed());
    }
};
export const changePassword = async (newPassword, dispatch, navigate, id) => {
    dispatch(resetPasswordStart());
    try {
        const res = await axios.post("/v1/auth/reset-password/" + id.id, { password: newPassword })
        dispatch(reserPasswordSuccess())
        navigate("/login")
    } catch (error) {
        dispatch(resetPasswordFailed());
    }
}
export const deleteUser = async (accessToken, dispatch, id, axiosJWT) => {
    dispatch(deleteUserStart());
    try {
        const res = await axiosJWT.delete("/v1/user/" + id, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(deleteUserSuccess(res.data));
    } catch (err) {
        dispatch(deleteUserFalse(err.response.data));
    }
};

export const logOut = async (dispatch, id, navigate, accessToken, axiosJWT) => {
    dispatch(logOutStart());
    try {
        await axiosJWT.post("/v1/auth/logout", id, {
            headers: { token: `Bearer ${accessToken}` }
        })
        dispatch(logOutSuccess());
        navigate("/login");
    } catch (err) {
        dispatch(logOutFailed());
    }
};

export const forgotPassword = async (email, dispatch, navigate) => {
    dispatch(forgotPasswordStart());
    try {
        await axios.post("/v1/auth/forgot-password", email);
        dispatch(forgotPasswordSuccess());
        navigate("/reset")
    } catch (err) {

    }
};



