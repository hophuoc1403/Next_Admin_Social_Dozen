import {ThemeConstant} from "@/constants/theme.constant";
import {createSlice} from "@reduxjs/toolkit";

interface ThemeState {
  theme: ThemeConstant
}

const initialState: ThemeState = {
  theme: ThemeConstant.LIGHT
}

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    onToggleTheme: (state, action:{payload:{theme:ThemeConstant}}) => {
      state.theme = action.payload.theme
    }
  }
})

export const {onToggleTheme} = themeSlice.actions;

export default themeSlice.reducer;