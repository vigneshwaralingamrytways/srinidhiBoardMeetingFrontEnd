import React from 'react'
import { createSlice } from '@reduxjs/toolkit';


const alertSlice = createSlice({
  name: 'sideBar',
  initialState: {
      showAlert:false,
      alertMessage:"",
      alertVariant:""
   //   selectedForm:<></>
  },
  reducers: {
    showAlertHandler(state, action) {
      //state.selectedData = action.payload.selectedData;
      state.alertMessage=action.payload.alertMessage;
      state.showAlert = action.payload.showAlert;
      state.alertVariant=action.payload.alertVariant
      //console.log(state.selectedData)
    }
  },
});

export const alertActions = alertSlice.actions;

export default alertSlice;