import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "../hooks";

interface MentorSliceProps {
  specialists: string[];
  languages: string[];
  category: {
    label: string;
    id: string;
  }[];
}

const initialState: MentorSliceProps = {
  specialists: [],
  languages: [],
  category: [],
};

const MentorSlice = createSlice({
  initialState,
  name: "mentor",
  reducers: {
    setSpecialists: (state, action: PayloadAction<string>) => {
      const index = state.specialists.findIndex(
        (props) => props === action.payload
      );

      if (index !== -1) {
        // If category already exists, remove it
        state.specialists = state.specialists.filter(
          (props) => props !== action.payload
        );
      } else {
        // If category does not exist, add it
        state.specialists.push(action.payload);
      }
    },
    setLanguages: (state, action: PayloadAction<string>) => {
      const index = state.languages.findIndex(
        (props) => props === action.payload
      );

      if (index !== -1) {
        // If category already exists, remove it
        state.languages = state.languages.filter(
          (props) => props !== action.payload
        );
      } else {
        // If category does not exist, add it
        state.languages.push(action.payload);
      }
    },
    setCategory: (
      state,
      action: PayloadAction<{
        id: string;
        label: string;
      }>
    ) => {
      const index = state.category.findIndex(
        (props) => props.id === action.payload.id
      );

      if (index !== -1) {
        // If category already exists, remove it
        state.category = state.category.filter(
          (props) => props.id !== action.payload.id
        );
      } else {
        // If category does not exist, add it
        state.category.push(action.payload);
      }
    },
  },
});

export const MentorReducer = MentorSlice.reducer;
export const useMentorSlice = () =>
  useAppSelector((state) => {
    return state.mentor;
  });
export const { setSpecialists, setCategory, setLanguages } =
  MentorSlice.actions;
