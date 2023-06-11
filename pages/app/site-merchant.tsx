import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery
} from "@mui/material";
import {NextPageWithLayout} from "../_app";
import SidebarLayout from "@/layouts/SidebarLayout";
import BuffWrapper from "@/components/wrapper/BuffWrapper";
import {useState} from "react";
import {makeStyles} from "tss-react/mui";
import ChangeNameserver from "@/content/SiteAgency/ChangeNameserver";
import SelectTheme from "@/content/SiteAgency/SelectTheme";
import InstallSite from "@/content/SiteAgency/InstallSite";
import Confirm from "@/content/SiteAgency/Confirm";
import {siteService} from "@/services/reportedPost.service";
import {enqueueSnackbar} from "notistack";
import {useRouter} from "next/router";

const steps = ['Change name servers', 'Select theme', 'Install site', 'Note and confirm'];

const SiteMerchant: NextPageWithLayout = () => {
  const {classes} = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const isLastStep = activeStep === steps.length - 1;
  const isMobile = useMediaQuery('(max-width:780px)')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [values, setValues] = useState<ISite>({
    template: null,
    hostname: "",
    siteName: "",
    description: ""
  } as ISite)
  const router = useRouter()

  const submitForm = async () => {
    setIsSubmitting(true)
    try {
      await siteService.createTemplate(values)
      enqueueSnackbar("Register site success!", {
        variant: "success"
      });
      router.push('/app/service-price')
    } catch (e) {
      enqueueSnackbar("Failed to register site", {
        variant: "error"
      });
    } finally {
      setIsSubmitting(false)
    }
  }

  function _renderStepContent(step) {
    switch (step) {
      case 0:
        return <ChangeNameserver setNextStep={handleNexStep}/>;
      case 1:
        return <SelectTheme setValues={setValues} handleNextPage={handleNexStep} handleBack={_handleBack}/>
      case 2:
        return <InstallSite
          values={values} setValues={setValues}
          handleNextPage={handleNexStep}
          handleBack={_handleBack}/>
      case 3:
        return <Confirm/>
      default:
        return <div>Not Found</div>;
    }
  }


  const handleNexStep = () => setActiveStep(activeStep + 1)

  function _handleBack() {
    setActiveStep(activeStep - 1);
  }

  return <BuffWrapper>
    <Typography variant={"h4"}>Register site merchant</Typography>
    <Paper sx={{my: 2, p: "20px 30px"}}>
      <Typography variant={"h4"}>
        Registration Instructions
      </Typography>
      <Divider sx={{my: 2}}/>
      <Stepper orientation={isMobile ? "vertical" : "horizontal"} activeStep={activeStep} className={classes.stepper}>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box my={2}>
        {_renderStepContent(activeStep)}
      </Box>
      <Box>
        {isLastStep &&
            <Box className={classes.buttons}>
                <Button variant={"outlined"} onClick={_handleBack}>
                    Back
                </Button>
                <Button
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={submitForm}
                >
                    Xác nhận
                </Button>
              {isSubmitting && (
                <CircularProgress
                  size={24}
                />
              )}
            </Box>
        }
      </Box>
    </Paper>
  </BuffWrapper>
}


SiteMerchant.getLayout = page => <SidebarLayout>{page}</SidebarLayout>
export default SiteMerchant

const useStyles = makeStyles()(
  (theme) => ({
    stepper: {
      padding: theme.spacing(3, 0, 5)
    },
    buttons: {
      marginTop: "20px",
      display: 'flex',
      justifyContent: 'flex-end',
      gap: "10px"
    },
  })
);