import { configureStore } from "@reduxjs/toolkit";
import { HomeReducer } from "pages/home/home-reducer";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// Root redux store of the application
export const store = configureStore({
  reducer: {
    home: HomeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
