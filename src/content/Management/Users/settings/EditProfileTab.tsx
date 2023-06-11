import {
  Grid,
  Typography,
  CardContent,
  Card,
  Box,
  Divider,
  FormControl, TextField, InputLabel, OutlinedInput, InputAdornment, IconButton, FormHelperText,
} from '@mui/material';
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod"
import {useEffect, useState} from "react";
import {useAuthContext} from "@/contexts/AuthContext";
import {useRequest} from "@/hooks/useRequest";
import {accountService} from "@/services/account.service";
import {useSnackbar} from "notistack";
import LoadingButton from "@mui/lab/LoadingButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";

const infoFormSchema = z.object({
  username: z.string().min(5, {message: 'Username must be at least 5 characters'}),
  email: z.string().email('Email must be a valid email address'),
  displayName: z.string().min(5, {message: 'Display name must be at least 5 characters'})
});

const changePasswordFormSchema = z.object({
  currentPassword: z.string().min(8, 'Password must be at least 8 characters'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

function EditProfileTab() {
  const {account, setAccount} = useAuthContext();
  const {enqueueSnackbar} = useSnackbar();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    setValue,
    handleSubmit: handleChangeInfo,
    formState: {errors},
  } = useForm<z.infer<typeof infoFormSchema>>({
    resolver: zodResolver(infoFormSchema),
  });

  const {
    register: changePasswordRegister,
    handleSubmit: handleChangePassword,
    reset,
    formState: {errors: changePasswordErrors},
  } = useForm<z.infer<typeof changePasswordFormSchema>>({
    resolver: zodResolver(changePasswordFormSchema),
  });

  const onChangeInfo = handleChangeInfo(data => {
    executeChangeInfo({displayName: data.displayName})
  })

  const onChangePassword = handleChangePassword(data => {
    const payload = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    }
    executeChangePassword(payload)
  })

  useEffect(() => {
    setValue("email", account.email)
    setValue("username", account.username)
    setValue("displayName", account.displayName)
  }, [account])

  const [executeChangeInfo, changeInfoStatus] = useRequest<{
    displayName: string
  }>(
    {
      request: async (payload) => await accountService.updateProfile(payload).then((res: any) => {
        setAccount(res)
      })
      ,
      onResolve: () => {
        enqueueSnackbar('Update user information successfully', {
          variant: 'success',
        });
      },
      onReject: (error: any) => {
        enqueueSnackbar(error.response.data.message, {variant: 'error'});
      }
    }
  )

  const [executeChangePassword, changePasswordStatus] = useRequest<{
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,

  }>(
    {
      request: async (payload) => await accountService.changePassword(payload)
      ,
      onResolve: () => {
        enqueueSnackbar('Change password successfully', {
          variant: 'success',
        });
        reset()
      },
      onReject: (error: any) => {
        enqueueSnackbar(error.response.data.message, {variant: 'error'});
      }
    }
  )

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Personal Details
              </Typography>
              <Typography variant="subtitle2">
                Manage informations related to your personal details
              </Typography>
            </Box>

          </Box>
          <Divider/>
          <CardContent sx={{p: 3}}>
            <form action="#" onSubmit={onChangeInfo}>
              <Box display={"flex"} flexDirection={"column"} gap={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      {...register("username")}
                      id="username"
                      label="Username"
                      error={!!errors.username}
                      helperText={errors.username?.message}
                      disabled
                      fullWidth
                      InputLabelProps={{shrink: true}}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      {...register("email")}
                      id="email"
                      label="Email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      disabled
                      fullWidth
                      InputLabelProps={{shrink: true}}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      {...register("displayName")}
                      id="display-name"
                      label="Display Name"
                      error={!!errors.displayName}
                      helperText={errors.displayName?.message}
                      fullWidth
                      InputLabelProps={{shrink: true}}
                    />
                  </Grid>
                </Grid>
                <Box mt={2} display={"flex"} justifyContent={"flex-end"}>
                  <LoadingButton type={"submit"} loading={changeInfoStatus === 'pending'} variant={"contained"}>Save
                    Changes</LoadingButton>
                </Box>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        {/*<Card>*/}
        {/*  <Box*/}
        {/*    p={3}*/}
        {/*    display="flex"*/}
        {/*    alignItems="center"*/}
        {/*    justifyContent="space-between"*/}
        {/*  >*/}
        {/*    <Box>*/}
        {/*      <Typography variant="h4" gutterBottom>*/}
        {/*        Change password*/}
        {/*      </Typography>*/}

        {/*    </Box>*/}

        {/*  </Box>*/}
        {/*  <Divider/>*/}
        {/*  <CardContent sx={{p: 3}}>*/}

        {/*    <form action="#" onSubmit={onChangePassword}>*/}
        {/*      <Box display={"flex"} flexDirection={"column"} gap={2}>*/}
        {/*        <Grid container spacing={2}>*/}
        {/*          <Grid item xs={12} md={6}>*/}

        {/*            <FormControl fullWidth variant="outlined">*/}
        {/*              <InputLabel htmlFor="outlined-adornment-current-password">Current Password</InputLabel>*/}
        {/*              <OutlinedInput*/}
        {/*                {...changePasswordRegister("currentPassword")}*/}
        {/*                id="outlined-adornment-current-password"*/}
        {/*                type={showCurrentPassword ? 'text' : 'password'}*/}
        {/*                label="Current Password"*/}
        {/*                endAdornment={*/}
        {/*                  <InputAdornment position="end">*/}
        {/*                    <IconButton*/}
        {/*                      aria-label="toggle password visibility"*/}
        {/*                      onClick={() => setShowCurrentPassword((show) => !show)}*/}
        {/*                      onMouseDown={(e: any) => e.preventDefault()}*/}
        {/*                      edge="end"*/}
        {/*                    >*/}
        {/*                      {showCurrentPassword ? <VisibilityOff fontSize={"small"}/> :*/}
        {/*                        <Visibility fontSize={"small"}/>}*/}
        {/*                    </IconButton>*/}
        {/*                  </InputAdornment>*/}
        {/*                }*/}
        {/*              />*/}
        {/*              <FormHelperText error={!!changePasswordErrors.currentPassword}>*/}
        {/*                {changePasswordErrors.currentPassword ? String(changePasswordErrors.currentPassword.message) : ''}*/}
        {/*              </FormHelperText>*/}
        {/*            </FormControl>*/}

        {/*          </Grid>*/}
        {/*          <Grid item xs={12} md={6}>*/}
        {/*            <FormControl fullWidth variant="outlined">*/}
        {/*              <InputLabel htmlFor="outlined-adornment-new-password">New Password</InputLabel>*/}
        {/*              <OutlinedInput*/}
        {/*                {...changePasswordRegister("newPassword")}*/}
        {/*                id="outlined-adornment-new-password"*/}
        {/*                type={showNewPassword ? 'text' : 'password'}*/}
        {/*                label="New Password"*/}
        {/*                endAdornment={*/}
        {/*                  <InputAdornment position="end">*/}
        {/*                    <IconButton*/}
        {/*                      aria-label="toggle password visibility"*/}
        {/*                      onClick={() => setShowNewPassword((show) => !show)}*/}
        {/*                      onMouseDown={(e: any) => e.preventDefault()}*/}
        {/*                      edge="end"*/}
        {/*                    >*/}
        {/*                      {showNewPassword ? <VisibilityOff fontSize={"small"}/> :*/}
        {/*                        <Visibility fontSize={"small"}/>}*/}
        {/*                    </IconButton>*/}
        {/*                  </InputAdornment>*/}
        {/*                }*/}
        {/*              />*/}
        {/*              <FormHelperText error={!!changePasswordErrors.newPassword}>*/}
        {/*                {changePasswordErrors.newPassword ? String(changePasswordErrors.newPassword.message) : ''}*/}
        {/*              </FormHelperText>*/}
        {/*            </FormControl>*/}

        {/*          </Grid>*/}
        {/*          <Grid item xs={12} md={6}>*/}
        {/*            <FormControl fullWidth variant="outlined">*/}
        {/*              <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm Password</InputLabel>*/}
        {/*              <OutlinedInput*/}
        {/*                {...changePasswordRegister("confirmPassword")}*/}
        {/*                id="outlined-adornment-confirm-password"*/}
        {/*                type={showConfirmPassword ? 'text' : 'password'}*/}
        {/*                label="Confirm Password"*/}
        {/*                endAdornment={*/}
        {/*                  <InputAdornment position="end">*/}
        {/*                    <IconButton*/}
        {/*                      aria-label="toggle password visibility"*/}
        {/*                      onClick={() => setShowConfirmPassword((show) => !show)}*/}
        {/*                      onMouseDown={(e: any) => e.preventDefault()}*/}
        {/*                      edge="end"*/}
        {/*                    >*/}
        {/*                      {showConfirmPassword ? <VisibilityOff fontSize={"small"}/> :*/}
        {/*                        <Visibility fontSize={"small"}/>}*/}
        {/*                    </IconButton>*/}
        {/*                  </InputAdornment>*/}
        {/*                }*/}
        {/*              />*/}
        {/*              <FormHelperText error={!!changePasswordErrors.confirmPassword}>*/}
        {/*                {changePasswordErrors.confirmPassword ? String(changePasswordErrors.confirmPassword.message) : ''}*/}
        {/*              </FormHelperText>*/}
        {/*            </FormControl>*/}
        {/*          </Grid>*/}
        {/*        </Grid>*/}
        {/*        <Box mt={2} display={"flex"} justifyContent={"flex-end"}>*/}
        {/*          <LoadingButton type={"submit"} loading={changePasswordStatus === 'pending'} variant={"contained"}>Change*/}
        {/*            password</LoadingButton>*/}
        {/*        </Box>*/}
        {/*      </Box>*/}
        {/*    </form>*/}
        {/*  </CardContent>*/}
        {/*</Card>*/}
      </Grid>
    </Grid>
  );
}

export default EditProfileTab;
