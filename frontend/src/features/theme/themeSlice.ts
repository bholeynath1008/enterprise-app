import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type Theme = 'dark' | 'light';

const saved = (localStorage.getItem('fms_theme') as Theme) ?? 'dark';
function apply(t: Theme) {
  document.documentElement.classList.toggle('light', t === 'light');
  document.documentElement.classList.toggle('dark', t === 'dark');
}
apply(saved);

const themeSlice = createSlice({
  name: 'theme',
  initialState: { theme: saved as Theme },
  reducers: {
    toggleTheme(state) {
      const next: Theme = state.theme === 'dark' ? 'light' : 'dark';
      state.theme = next;
      localStorage.setItem('fms_theme', next);
      apply(next);
    },
    setTheme(state, { payload }: PayloadAction<Theme>) {
      state.theme = payload;
      localStorage.setItem('fms_theme', payload);
      apply(payload);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
export const selectTheme = (s: { theme: { theme: Theme } }) => s.theme.theme;
