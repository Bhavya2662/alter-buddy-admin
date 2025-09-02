import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface LayoutSliceProps {
     nav: boolean;
}

const LayoutSliceInitial: LayoutSliceProps = {
     nav: true,
};

const LayoutSlice = createSlice({
     initialState: LayoutSliceInitial,
     name: "layout",
     reducers: {
          handleNavBar: (state) => {
               state.nav = !state.nav;
          },
     },
});

export const useLayoutSlice = () =>
     useSelector((state: RootState) => {
          return state.layout;
     });
export const LayoutReducer = LayoutSlice.reducer;
export const { handleNavBar } = LayoutSlice.actions;
