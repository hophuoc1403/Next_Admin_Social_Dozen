import {ThemeConstant} from "@/constants/theme.constant";
import {Box, Typography} from "@mui/material";
import {useTheme} from "@/hooks/useTheme";

const NoData = () => {

  const {theme} = useTheme()

  return <Box width={"100%"} display={"flex"} py={10} flexDirection={"column"} sx={{margin:"0 auto"}} alignItems={"center"}>
    <img
      style={{width: "30%", minWidth: "300px"}}
      src={theme === ThemeConstant.LIGHT ? "/light-theme.svg" : "/dark-theme.svg"}
      alt="no-item"/>
    <Typography variant={"h4"}>No data</Typography>
  </Box>
}

export default NoData