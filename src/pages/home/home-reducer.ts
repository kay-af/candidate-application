import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Job } from "shared/models/job";
import { JobFilter } from "shared/models/job-filter";
import { PaginatedResponse } from "shared/services/core";
import { JobService } from "shared/services/job-service";
import { RootState } from "shared/store";

/**
 * Types for the current state of fetched jobs data
 */
export interface JobState {
  data: PaginatedResponse<Job> | null;
  loading: boolean;
  error: string | null;
}

/**
 * Types for current state of the home page
 */
export interface HomeState {
  filters: JobFilter;
  jobs: JobState;
}

const initialHomeState: HomeState = {
  filters: {
    company: "",
    experience: [],
    location: [],
    roles: [],
    salary: [],
  },
  jobs: {
    data: null,
    loading: true,
    error: null,
  },
};

/**
 * Action to fetch jobs based on filters initially when there is no data
 */
export const fetchInitialJobs = createAsyncThunk(
  "home/initialJobs",
  async (_, { signal, getState, rejectWithValue }) => {
    const state = getState() as RootState;
    try {
      return await JobService.fetchJobs(
        state.home.filters,
        {
          page: 1,
          size: 20,
        },
        {
          abortSignal: signal,
        }
      );
    } catch (err) {
      rejectWithValue(null);
    }
  }
);

/**
 * Action to fetch more jobs based on filters when there is already some data
 */
export const fetchMoreJobs = createAsyncThunk(
  "home/moreJobs",
  async (_, { signal, getState, rejectWithValue }) => {
    const state = getState() as RootState;
    try {
      return await JobService.fetchJobs(
        state.home.filters,
        {
          page: state.home.jobs.data!.pagination.page + 1,
          size: state.home.jobs.data!.pagination.size,
        },
        {
          abortSignal: signal,
        }
      );
    } catch (err) {
      rejectWithValue(null);
    }
  }
);

/**
 * Defines the Home state and all the actions that can be performed from the Home page
 */
const homeSlice = createSlice({
  name: "home",
  initialState: initialHomeState,
  reducers: {
    setFilterCompany: (state, action: PayloadAction<string>) => {
      state.filters.company = action.payload;
    },
    setFilterExperience: (state, action: PayloadAction<string[]>) => {
      state.filters.experience = action.payload;
    },
    setFilterLocation: (state, action: PayloadAction<string[]>) => {
      state.filters.location = action.payload;
    },
    setFilterRoles: (state, action: PayloadAction<string[]>) => {
      state.filters.roles = action.payload;
    },
    setFilterSalary: (state, action: PayloadAction<string[]>) => {
      state.filters.salary = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInitialJobs.pending, (state) => {
      state.jobs.data = null;
      state.jobs.error = null;
      state.jobs.loading = true;
    });
    builder.addCase(fetchInitialJobs.fulfilled, (state, action) => {
      state.jobs.data = action.payload as PaginatedResponse<Job>;
      state.jobs.loading = false;
      state.jobs.error = null;
    });
    builder.addCase(fetchInitialJobs.rejected, (state, action) => {
      if (action.meta.aborted) return;
      state.jobs.error = "Error";
      state.jobs.loading = false;
    });

    builder.addCase(fetchMoreJobs.pending, (state) => {
      state.jobs.loading = true;
      state.jobs.error = null;
    });
    builder.addCase(fetchMoreJobs.fulfilled, (state, action) => {
      const response = action.payload as PaginatedResponse<Job>;
      state.jobs.data = {
        pagination: response.pagination,
        data: [...state.jobs.data!.data, ...response.data],
      };
      state.jobs.loading = false;
      state.jobs.error = null;
    });
    builder.addCase(fetchMoreJobs.rejected, (state, action) => {
      if (action.meta.aborted) return;
      state.jobs.error = "Error";
      state.jobs.loading = false;
    });
  },
});

export const HomeActions = homeSlice.actions;
export const HomeReducer = homeSlice.reducer;
