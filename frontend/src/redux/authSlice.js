import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch supervisor profile
export const fetchSupervisorData = createAsyncThunk(
  "auth/fetchSupervisorData",
  async (_, thunkAPI) => {
    try {
      // Mocked token for demo, replace with real login
      const token = localStorage.getItem("token") || "demo-token";

      const res = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: "Failed" });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupervisorData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSupervisorData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchSupervisorData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Error fetching data";
      });
  },
});

export default authSlice.reducer;
