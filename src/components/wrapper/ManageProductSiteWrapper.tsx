import React from "react";
import {Box} from "@mui/material";

const ManageProductSiteWrapper = ({children}:{children:React.ReactNode}) => {
  return <Box sx={{p:"20px"}}>
    {children}
  </Box>
}

export default ManageProductSiteWrapper