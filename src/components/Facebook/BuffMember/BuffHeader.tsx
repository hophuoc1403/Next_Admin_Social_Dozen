import {Box, Button, Stack, Typography} from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {makeStyles} from "tss-react/mui";
import SelectBox from "@/components/Facebook/BuffMember/SelectBox";
import AddIcon from '@mui/icons-material/Add';
import InventoryIcon from '@mui/icons-material/Inventory';
import HandymanIcon from '@mui/icons-material/Handyman';
import {useRouter} from "next/router";

export const BuffHeader = () => {

  const {classes} = useStyles()
  const router = useRouter()

  return <Box>
    <Box className={classes.container}>
      <FilterAltIcon/>
      <Typography variant={"body1"} sx={{fontWeight: 600}}>Nâng cao : </Typography>
      <Stack flexWrap={"wrap"} flexDirection={"row"} gap={2}>
        <SelectBox list={[{label: "30"}, {label: "20"}, {label: "40"}, {label: "50"}]} label={"Status"}/>
        <SelectBox list={[{label: "30"}, {label: "20"}, {label: "40"}, {label: "60"}]} label={"Server"}/>
      </Stack>
    </Box>
    <Box mt={2} display={"flex"} gap={2}>
      <Button variant={"contained"} sx={{display: "flex", alignItems: "center", gap: 0.4, backgroundColor: "#059669"}} onClick={() => router.push("/orders/add") }>
        <AddIcon/>
        <Typography variant={"h5"}>Thêm</Typography>
      </Button>
      <Button variant={"contained"} sx={{display: "flex", alignItems: "center", gap: 0.4}}>
        <InventoryIcon/>
        <Typography variant={"h5"}>Gộp đơn</Typography>
      </Button>
      <Button variant={"contained"} sx={{display: "flex", alignItems: "center", gap: 0.4,backgroundColor:"#f58646"}}>
        <HandymanIcon/>
        <Typography variant={"h5"}>Bảo hành</Typography>
      </Button>
    </Box>
  </Box>
}


const useStyles = makeStyles()(
  (theme) => ({
    "container": {
      marginTop: "20px",
      padding: "10px 15px",
      backgroundColor: theme.palette.background.paper,
      display: "flex",
      alignItems: "center",
      gap: "15px"
    }
  }))


