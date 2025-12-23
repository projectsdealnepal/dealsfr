import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetUserResponse, UserLoginResponse } from "./types";
import { getUser, loginUser, logoutUser, registerUser } from "./user";

interface UserSliceInitialState {
  userStateLoading: boolean;

  userLoginData: UserLoginResponse | null;
  userLoginError: any | null;
  isAuthenticated: boolean;

  userRegisterData: { message: string } | null;
  userRegisterError: string | null;

  userLogoutError: string | null;

  userData: GetUserResponse | null;
  userError: string | null;

  //for websocket notifications
  initialLoad: boolean;
}

const initialState: UserSliceInitialState = {
  userStateLoading: false,

  userLoginData: null,
  userLoginError: null,
  isAuthenticated: false,

  userRegisterData: null,
  userRegisterError: null,

  userLogoutError: null,

  userData: null,
  userError: null,

  //for websocket notifications
  initialLoad: true,
};

const userSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    resetAllUserState: () => initialState,
    resetRegisterState: (state) => {
      state.userRegisterData = null;
      state.userRegisterError = null;
    },
    resetLoginState: (state) => {
      state.userLoginData = null;
      state.userLoginError = null;
      state.isAuthenticated = false;
    },
    resetLogoutState: (state) => {
      state.userLogoutError = null;
    },
    resetGetUserInfoState: (state) => {
      state.userData = null;
      state.userError = null;
    },

    //for websocket notifications
    setInitialLoad: (state, action: PayloadAction<boolean>) => {
      state.initialLoad = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.userStateLoading = true;
        state.userRegisterError = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<{ message: string }>) => {
          state.userStateLoading = false;
          state.userRegisterData = action.payload;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.userStateLoading = false;
        state.userRegisterError =
          (action.payload as string) || "Registration failed";
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.userStateLoading = true;
        state.userLoginError = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<UserLoginResponse>) => {
          state.userStateLoading = false;
          state.userLoginData = action.payload;
          state.isAuthenticated = true;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.userStateLoading = false;
        state.userLoginError = (action.payload) || "Login failed";
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.userStateLoading = true;
        state.userLogoutError = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.userStateLoading = false;
        state.userLoginData = null;
        state.userRegisterData = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.userStateLoading = false;
        state.userLogoutError = (action.payload as string) || "Logout failed";
      })

      // Get User
      .addCase(getUser.pending, (state) => {
        state.userStateLoading = true;
        state.userError = null;
      })
      .addCase(
        getUser.fulfilled,
        (state, action: PayloadAction<GetUserResponse>) => {
          state.userStateLoading = false;
          state.userData = action.payload;
        }
      )
      .addCase(getUser.rejected, (state, action) => {
        state.userStateLoading = false;
        state.userError =
          (action.payload as string) || "Failed to fetch user data";
      });
  },
});

export const {
  resetAllUserState,
  resetRegisterState,
  resetLoginState,
  resetLogoutState,
  resetGetUserInfoState,
  setInitialLoad,
} = userSlice.actions;

export default userSlice.reducer;
