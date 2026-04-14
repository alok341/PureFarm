import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Get freshness score for a product
export const getFreshness = createAsyncThunk(
  "ai/getFreshness",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/ai/freshness/${productId}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get demand prediction (farmer only)
export const getDemandPrediction = createAsyncThunk(
  "ai/getDemandPrediction",
  async (productId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.get(`${API_URL}/ai/predict-demand/${productId}`, config);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get price suggestion (farmer only)
export const getPriceSuggestion = createAsyncThunk(
  "ai/getPriceSuggestion",
  async ({ productId, demandScore }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.post(
        `${API_URL}/ai/suggest-price`,
        { productId, demandScore },
        config
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get farmer dashboard insights
export const getFarmerInsights = createAsyncThunk(
  "ai/getFarmerInsights",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.get(`${API_URL}/ai/farmer-insights`, config);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  freshness: null,
  demand: null,
  price: null,
  farmerInsights: null,
  loading: false,
  error: null,
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    clearAIState: (state) => {
      state.freshness = null;
      state.demand = null;
      state.price = null;
      state.farmerInsights = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Freshness
      .addCase(getFreshness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFreshness.fulfilled, (state, action) => {
        state.loading = false;
        state.freshness = action.payload;
      })
      .addCase(getFreshness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Demand Prediction
      .addCase(getDemandPrediction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDemandPrediction.fulfilled, (state, action) => {
        state.loading = false;
        state.demand = action.payload;
      })
      .addCase(getDemandPrediction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Price Suggestion
      .addCase(getPriceSuggestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPriceSuggestion.fulfilled, (state, action) => {
        state.loading = false;
        state.price = action.payload;
      })
      .addCase(getPriceSuggestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Farmer Insights
      .addCase(getFarmerInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFarmerInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.farmerInsights = action.payload;
      })
      .addCase(getFarmerInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAIState } = aiSlice.actions;
export default aiSlice.reducer;