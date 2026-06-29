import React from 'react'
import { createSlice } from '@reduxjs/toolkit';


const modalSlice = createSlice({
  name: 'sideBar',
  initialState: {
      showModal:false,
      modalStack: [],
      selectedData:{},
      selectedForm:<></>,
      modalWidth: '', 
      modalLeft: '',
      backdropOnClose: true,   
  },
  reducers: {
    showModalHandler(state, action) {
      // state.selectedData = action.payload.selectedData;
      // state.showModal = action.payload.showModal;
      // state.selectedForm=action.payload.selectedForm;      
      // console.log(state.selectedData)
      // state.modalWidth = action.payload.modalWidth;
      // state.modalLeft=action.payload.modalLeft;
      // state.backdropOnClose =
      //   action.payload.backdropOnClose !== undefined
      //     ? action.payload.backdropOnClose
      //     : true;
      const modalDetails = {
        selectedData: action.payload.selectedData,
        selectedForm: action.payload.selectedForm,
        modalWidth: action.payload.modalWidth,
        modalLeft: action.payload.modalLeft,
        backdropOnClose:
          action.payload.backdropOnClose !== undefined
            ? action.payload.backdropOnClose
            : true,
      };

      // Push to modal stack
      state.modalStack.push(modalDetails);

      // Set the top modal as the current one
      state.selectedData = modalDetails.selectedData;
      state.selectedForm = modalDetails.selectedForm;
      state.modalWidth = modalDetails.modalWidth;
      state.modalLeft = modalDetails.modalLeft;
      state.backdropOnClose = modalDetails.backdropOnClose;
      state.showModal = true;
    },
    // hideModalHandler(state){
    //   state.selectedData = {};
    //   state.showModal = false;
    //   state.selectedForm=<></>;      
    //  // console.log(state.selectedData)
    // },
    hideModalHandler(state) {
      // Pop the top modal
      state.modalStack.pop();

      if (state.modalStack.length > 0) {
        const previousModal = state.modalStack[state.modalStack.length - 1];
        state.selectedData = previousModal.selectedData;
        state.selectedForm = previousModal.selectedForm;
        state.modalWidth = previousModal.modalWidth;
        state.modalLeft = previousModal.modalLeft;
        state.backdropOnClose = previousModal.backdropOnClose;
      } else {
        // No modals left
        state.selectedData = {};
        state.selectedForm = <></>;
        state.modalWidth = '';
        state.modalLeft = '';
        state.backdropOnClose = true;
        state.showModal = false;
      }
    },

    hideAllModalsHandler(state) {
      state.modalStack = [];
      state.selectedData = {};
      state.selectedForm = <></>;
      state.modalWidth = '';
      state.modalLeft = '';
      state.backdropOnClose = true;
      state.showModal = false;
    },
    setModalProperties(state, action) {
      const { modalWidth, modalLeft } = action.payload;
      state.modalWidth = modalWidth;
      state.modalLeft = modalLeft;
    },
  },
});

export const modalActions = modalSlice.actions;

export default modalSlice;