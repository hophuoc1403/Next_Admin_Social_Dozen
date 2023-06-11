import {Box} from "@mui/system";
import {Button, Grid, Stack, Step, StepLabel, Stepper, TextField, Typography} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {useState} from "react";
import DoneIcon from '@mui/icons-material/Done';
import {useSites} from "@/hooks/useSites";

const steps = ["Access domain DNS management", "Edit DNS", "Delete all old NAMESERVERS", "Enter Cloudflare's NAMESERVERS", "Save changes"]

interface ChangeNameserverProps {
  setNextStep : () => void
}

const ChangeNameserver = ({setNextStep} : ChangeNameserverProps) => {

  const [isCopyCrain, setIsCopyCrain] = useState(false)
  const {currentSite} = useSites()

  return <Box>
    <Grid container spacing={4}>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <Typography variant={"h4"} mb={2}>Process</Typography>
        <Box sx={{padding: "10px", border: "1px solid #757575", borderRadius: "10px"}}>
          <Stepper orientation={"vertical"} activeStep={5}>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Typography mt={1} variant={"body2"}>Updating Nameservers may take up to 24 hours</Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <Typography variant={"h4"} mb={2}>Current site </Typography>
        <Box sx={{padding: "10px", border: "1px solid #757575", borderRadius: "10px"}}>
          <Stack flexDirection={"row"} gap={2} alignItems={"center"}>
            <img src={"https://sabommo.net/assets/images/cloudflare.png"} alt={"cloud image"} width={50} height={50}/>
            <TextField value={currentSite.siteName} size={"small"}/>
            {isCopyCrain ? <DoneIcon/> :
              <ContentCopyIcon
                fontSize={"small"} style={{cursor: "pointer"}}
                onClick={() => {
                  setIsCopyCrain(true)
                  navigator.clipboard.writeText("craig.ns.cloudflare.com")
                  setTimeout(() => {
                    setIsCopyCrain(false)
                  }, 5000)
                }}/>}
          </Stack>

        </Box>
      </Grid>
    </Grid>
    <Box display={"flex"} justifyContent={"flex-end"}>
      <Button
        variant="contained"
        color="primary"
        onClick={setNextStep}
      >
        Next
      </Button>
    </Box>
  </Box>
}

export default ChangeNameserver