import React, {Fragment} from "react";
import {Box, CircularProgress} from "@mui/material";
interface LoadingWrapperProps {
  isLoading?: boolean;
  children?: React.ReactNode;
}
export default function LoadingWrapper({isLoading = true, children}) {
  return (isLoading ? <Box sx={{ display: 'flex', width: "100%", height: "100%", justifyContent: 'center', alignItems: 'center' }}><CircularProgress /> </Box> : <Fragment>{children}</Fragment> )
}