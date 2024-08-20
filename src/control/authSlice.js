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


//SignUp
export const signUp = createAsyncThunk(
  "auth/signUp",
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await axios.post("http://localhost:3000/users", {
        username,
        password,
        tokens: {
          access_token: "eyJhbGciOiJIUzI1NiIsInR...",
          refresh_token: "dGVzdF9yZWZyZXNoX3Rva2Vu",
          csrf_token: "csrf_token_value",
        },
      });
      console.log(response.data);
      const { access_token, refresh_token, csrf_token } = response.data.tokens;
      console.log("csrf_token", csrf_token);
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      localStorage.setItem("csrfToken", csrf_token);
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
      const { data } = await axios.get("http://localhost:3000/users");
      const loginUser = data.find((user) => {
        return user.username == username && user.password == password;
      });


      console.log("userExists", loginUser);
      if (loginUser) {
        const { access_token, refresh_token, csrf_token } = loginUser.tokens;
        console.log("login access_token", access_token);
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);
        localStorage.setItem("csrfToken", csrf_token);
      }
      return loginUser;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
//Logout
export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const { data } = await axios.get("http://localhost:3000/users");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("csrf_token");
    return true;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

//
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
        console.log('action',action.payload);
        console.log("action", action.payload);
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

  },
});

export default authSlice.reducer;
