import {Box, Button, Grid, Stack, TextField, Typography} from "@mui/material";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {makeStyles} from "tss-react/mui";
import {Dispatch, SetStateAction} from "react";


const installSiteSchema = z
  .object({
    hostname: z.string().nonempty(),
    siteName: z.string().nonempty(),
    description: z.string().nonempty(),
    // keywords: z.string().nonempty()
  });

interface InstallSiteProps {
  handleNextPage: () => void
  handleBack: () => void
  setValues:Dispatch<SetStateAction<any>>
  values:ISite
}

const InstallSite = ({handleBack, handleNextPage,setValues,values}: InstallSiteProps) => {

  const {classes} = useStyles()

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<z.infer<typeof installSiteSchema>>({
    resolver: zodResolver(installSiteSchema),
  });

  const onSubmit = handleSubmit(async fieldsValue => {
    if (fieldsValue) {
      setValues(state => ({...state,...fieldsValue}))
      handleNextPage()
    }
  });


  return <Box>
    <form  onSubmit={onSubmit}>
      <Stack gap={3}>
        <Grid container spacing={3}>
          <Grid item sm={12} md={6} xl={6}>
            <Typography variant={"body2"} className={classes.label}>Domain</Typography>
            <TextField
              defaultValue={values.hostname}
              error={!!errors.hostname}
              helperText={errors.hostname?.message}
              {...register('hostname')}
              size={"small"}
              fullWidth
              placeholder={"Enter domain like domain.com"}
            />
          </Grid>
          <Grid item sm={12} md={6} xl={6}>
            <Typography variant={"body2"} className={classes.label}>Site name</Typography>
            <TextField
              defaultValue={values.siteName}
              error={!!errors.siteName}
              helperText={errors.siteName?.message}
              {...register('siteName')}
              size={"small"}
              fullWidth
              placeholder={"Enter site name"}
            />
          </Grid>
        </Grid>
        <Box>
          <Typography variant={"body2"} className={classes.label}>Site description</Typography>
          <TextField
            defaultValue={values.description}
            error={!!errors.description}
            helperText={errors.description?.message}
            {...register('description')}
            size={"small"}

            fullWidth
            placeholder={"Enter site description "}
            multiline
            minRows={5}
            maxRows={20}
          />
          <Typography variant={"body2"} mt={1} className={classes.label}>
            Recommended length of description is 150-160 characters</Typography>
        </Box>
        {/*<Box>*/}
        {/*  <Typography variant={"body2"} className={classes.label}>Keywords</Typography>*/}
        {/*  <TextField*/}
        {/*    defaultValue={values.keywords}*/}
        {/*    error={!!errors.keywords}*/}
        {/*    helperText={errors.keywords?.message}*/}
        {/*    {...register('keywords')}*/}
        {/*    size={"small"}*/}

        {/*    fullWidth*/}
        {/*    placeholder={"Nhập từ khoá tìm kiếm site"}*/}
        {/*    multiline*/}
        {/*    minRows={5}*/}
        {/*    maxRows={20}*/}
        {/*  />*/}
        {/*</Box>*/}
      </Stack>
      <Box display={"flex"} mt={2} justifyContent={"flex-end"} gap={2}>
        <Button variant={"outlined"} onClick={handleBack}>
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
        >
          Next
        </Button>
      </Box>
    </form>
  </Box>
}


const useStyles = makeStyles()(
  () => ({
    label: {
      marginBottom: "10px"
    }
  })
);

export default InstallSite