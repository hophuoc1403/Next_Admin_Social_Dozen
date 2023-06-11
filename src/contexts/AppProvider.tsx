import React from "react";
import ThemeProvider from "@/theme/ThemeProvider";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import CssBaseline from "@mui/material/CssBaseline";
import {SnackbarProvider} from "notistack";
import {ConfirmProvider} from "material-ui-confirm";

interface IAppLoaderProps {
  children: React.ReactNode;
}

const AppProvider = (props: IAppLoaderProps) => {
  const {children} = props;
  return <ThemeProvider>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <CssBaseline/>
      <SnackbarProvider
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <ConfirmProvider defaultOptions={{confirmationText: "Confirm", cancellationText: "Cancel"}}>
          {children}
        </ConfirmProvider>
      </SnackbarProvider>
    </LocalizationProvider>
  </ThemeProvider>
}

export default AppProvider;