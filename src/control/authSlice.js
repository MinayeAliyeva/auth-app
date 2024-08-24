import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  access_token: localStorage.getItem("access_token") || null,
  refresh_token: localStorage.getItem("refresh_token") || null,
  csrf_token: localStorage.getItem("csrf_token") || null,
  loading: false,
  error: null,
};

// Sign Up
export const signUp = createAsyncThunk(
  "auth/signUp",
  async (
    { first_name, last_name, username, email, phone, password, re_password },
    thunkAPI
  ) => {
    try {
      const response = await axios.post(
        "https://react-login-t7p7.onrender.com/api/register/",
        {
          first_name,
          last_name,
          username,
          email,
          phone,
          password,
          re_password,
        }
      );
      const { access_token, refresh_token, csrf_token } = response.data.tokens;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("csrf_token", csrf_token);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Login
export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await axios.post(
        "https://react-login-t7p7.onrender.com/api/login/",
        {
          username,
          password,
        }
      );
      const { access_token, refresh_token, csrf_token } = response.data.tokens;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("csrf_token", csrf_token);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Logout
export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await axios.post("https://react-login-t7p7.onrender.com/api/logout/");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("csrf_token");
    return true;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Token Refresh
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, thunkAPI) => {
    try {
      const response = await axios.post(
        "https://react-login-t7p7.onrender.com/api/token/refresh/",
        {
          refresh_token: localStorage.getItem("refresh_token"),
        }
      );
      const { access_token } = response.data;
      localStorage.setItem("access_token", access_token);
      return { access_token };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.username;
        state.access_token = action.payload.tokens.access_token;
        state.refresh_token = action.payload.tokens.refresh_token;
        state.csrf_token = action.payload.tokens.csrf_token;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.username;
        state.access_token = action.payload.tokens.access_token;
        state.refresh_token = action.payload.tokens.refresh_token;
        state.csrf_token = action.payload.tokens.csrf_token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.access_token = null;
        state.refresh_token = null;
        state.csrf_token = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.access_token = action.payload.access_token;
      });
  },
});

export default authSlice.reducer;
