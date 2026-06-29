import { createSlice } from '@reduxjs/toolkit';

const moduleSlice = createSlice({
  name: 'sideBar',
  initialState: {
    processId: "",
    moduleId: "",
    activityId: "",
    functionPath: "",
    functionTittle: "",
    sidebardata: [],
    showsideBar: false
  },
  reducers: {
    // ? Safe update: preserves previous values if not provided
    selectModuleId(state, action) {
      const payload = action.payload;
      state.processId = payload.processId ?? state.processId;
      state.moduleId = payload.moduleId ?? state.moduleId;
      state.activityId = payload.activityId ?? state.activityId;
      state.functionPath = payload.functionPath ?? state.functionPath;
      state.functionTittle = payload.functionTittle ?? state.functionTittle;
    },

    // ? Optional: update only activityId
    selectActivityId(state, action) {
      state.activityId = action.payload.activityId;
    },

    // Optional: update sidebardata
    setSideBarData(state, action) {
      state.sidebardata = action.payload;
    },

    // Optional: toggle sidebar visibility
    toggleSidebar(state) {
      state.showsideBar = !state.showsideBar;
    }
  },
});

export const moduleActions = moduleSlice.actions;
export default moduleSlice;
