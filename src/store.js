import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./control/authSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
