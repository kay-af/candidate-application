import { CssBaseline, ThemeProvider } from "@mui/material";
import { Home } from "pages/home/home";
import { Provider } from "react-redux";
import { store } from "shared/store";
import { theme } from "shared/theme";

export const App = () => {
  return (
    <Provider store={store}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    </Provider>
  );
};
