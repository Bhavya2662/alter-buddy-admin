import { createSlice } from "@reduxjs/toolkit";
import { useAppSelector } from "../hooks";

interface BlogSliceProps {
  newModel: boolean;
}

const initialState: BlogSliceProps = {
  newModel: false,
};

const BlogSlice = createSlice({
  initialState,
  name: "blog",
  reducers: {},
});

export const BlogReducer = BlogSlice.reducer;
export const useBlogSlice = () =>
  useAppSelector((state) => {
    return state.blog;
  });
// export const {} = BlogSlice.actions;
