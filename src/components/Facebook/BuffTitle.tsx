import {Typography} from "@mui/material";

const BuffTitle = ({title}: { title: string }) => {
  return <Typography sx={{
    fontSize: "20px",
    fontWeight: "bold"
  }} variant={"body1"}>Danh sách đơn hàng Buff {title} - Facebook</Typography>
}

export default BuffTitle