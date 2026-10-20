import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Game from "./Game";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    background: {
      default: 'beige'
    }
  }
});
const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Game />
    </ThemeProvider>
  </StrictMode>
);