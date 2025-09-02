import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface AccountSliceProps {
  authenticated: boolean;
  token: string | null;
}

const initialState: AccountSliceProps = {
  authenticated: false,
  token: null,
};

const AccountSlice = createSlice({
  initialState,
  name: "account",
  reducers: {
    handleAuthentication: (state, action: PayloadAction<string>) => {
      state.authenticated = false;
      state.token = action.payload;
      localStorage.setItem("ADMIN", state.token);
    },
    removeAuthentication: (state) => {
      state.authenticated = false;
      state.token = null;
      localStorage.removeItem("ADMIN");
    },
  },
});

export const useAccountSlice = () =>
  useSelector((state: RootState) => {
    return state.account;
  });
export const AccountReducer = AccountSlice.reducer;
export const { handleAuthentication, removeAuthentication } =
  AccountSlice.actions;
