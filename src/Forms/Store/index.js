import { configureStore } from "@reduxjs/toolkit";
import moduleSlice from "./module-slice";
import modalSlice from "./modal-Slice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import alertSlice from "./alert-slice";
 
import apiBaseReducer from "./apiBaseSlice";
// import filterSlice from "./filter-slice";
 

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, moduleSlice.reducer);
const apiBasePersistedReducer = persistReducer(persistConfig, apiBaseReducer); // ?? persist apiBase

export const store = configureStore({
  reducer: {
    sideBar: persistedReducer,
    // filter:filterSlice.reducer,
    modalProps: modalSlice.reducer,
    alertProps: alertSlice.reducer,
   
    apiBase: apiBasePersistedReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});

export const persistedstore = persistStore(store);
