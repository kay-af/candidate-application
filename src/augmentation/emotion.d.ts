import { Theme as MuiTheme } from "@mui/material/styles";
import "@emotion/react";

/// To make emotion use material theme types
declare module "@emotion/react" {
  export interface Theme extends MuiTheme {}
}
