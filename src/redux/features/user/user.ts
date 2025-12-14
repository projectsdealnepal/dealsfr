import authApi from "@/lib/interceptor";
import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import api from "../../../lib/axios";
import {
  GetUserResponse,
  UserLoginPayload,
  UserLoginResponse,
  UserRegisterPayload,
} from "./types";

export const registerUser = createAsyncThunk<
  { message: string },
  UserRegisterPayload,
  { rejectValue: string }
>("user/registerUser", async (userData, thunkAPI) => {
  try {
    const response = await api.post("/accounts/register/", userData, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || "Registration failed"
    );
  }
});

export const loginUser = createAsyncThunk<
  UserLoginResponse,
  UserLoginPayload,
  { rejectValue: string }
>("user/loginUser", async (loginData, thunkAPI) => {
  try {
    const response = await api.post<UserLoginResponse>(
      "/accounts/login/",
      loginData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    // Save tokens
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", response.data.data.access);
      localStorage.setItem("refresh_token", response.data.data.refresh);
      // Make sure cookies are accessible to the server
      Cookies.set("access_token", response.data.data.access, {
        path: "/",
        sameSite: "lax",
      });
      Cookies.set("refresh_token", response.data.data.refresh, {
        path: "/",
        sameSite: "lax",
      });
    }

    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || "Login failed"
    );
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "user/logoutUser",
  async (_, thunkAPI) => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        throw new Error("Login Error!");
      }

      await api.post(
        "/accounts/logout/",
        { refresh: refreshToken },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Logout failed"
      );
    }
  }
);

export const getUser = createAsyncThunk<
  GetUserResponse,
  void,
  { rejectValue: string }
>("user/getUser", async (_, thunkAPI) => {
  try {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await authApi.get(`${url}accounts/me/`, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Error while getting user detial"
    );
  }
});

//for getting the uuid for websocket connection
