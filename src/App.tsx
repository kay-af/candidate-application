import { CssBaseline } from "@mui/material";
import { Home } from "pages/home";
import { Provider } from "react-redux";
import { store } from "shared/store";

export const App = () => {
  return (
    <Provider store={store}>
      <CssBaseline />
      <Home />
    </Provider>
  );
};
