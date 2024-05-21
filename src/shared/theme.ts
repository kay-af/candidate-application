import { createTheme } from "@mui/material";

/**
 * Material theme to match the required design closely
 */
export const theme = createTheme({
  typography: {
    fontFamily: ["Lexend", "sans-serif"].join(", "),
    fontWeightLight: "300",
    fontWeightRegular: "400",
    fontWeightMedium: "500",
    fontWeightBold: "700",
    fontSize: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          textTransform: "unset",
          borderRadius: "8px",
          minHeight: "48px",
          margin: 0,
          fontSize: "16px",
          fontWeight: "400",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        type: "text",
        autoComplete: "off",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-input": {
            fontSize: "14px !important",
            padding: "14.94px 16px !important",
            borderColor: "#CCC !important",
            "&::placeholder": {
              fontWeight: 300,
              color: "black",
              opacity: 0.3,
            },
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#B3B3B3 !important",
          },
          "&:focus-within .MuiOutlinedInput-notchedOutline": {
            borderColor: "#66A3FF !important",
          },
        },
      },
    },
  },
});
