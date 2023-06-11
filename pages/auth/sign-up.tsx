import {zodResolver} from '@hookform/resolvers/zod';
import {LoadingButton} from '@mui/lab';
import {ButtonBase, Divider, InputAdornment, Stack, styled, TextField, Typography} from '@mui/material';
import {NextPage} from 'next';
import {useSnackbar} from 'notistack';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import React, {useState} from 'react';
import Head from 'next/head';
import {useRequest} from "@/hooks/useRequest";
import AuthenticationLayout from "@/layouts/AuthenticationLayout";
import GoogleIcon from "../components/shared/icons/GoogleIcon";
import FacebookIcon from "@mui/icons-material/Facebook";
import ReCAPTCHA from 'react-google-recaptcha';
import {authService} from "@/services/auth.service";
import {RECAPTCHA_SITE_KEY} from "@/configs/oauth.config";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";

const StyledButton = styled(ButtonBase)(({theme}) => ({
  width: '100%',
  padding: 12,
  marginBottom: 16,
  borderRadius: '8px',
  fontWeight: 500,
  border: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down(454)]: {
    width: '100%',
    marginBottom: 8,
  },
}));

const registerFormSchema = z
  .object({
    username: z.string().min(5, {
      message: 'Username must be at least 5 characters',
    }),
    email: z.string().email('Email must be a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const Register: NextPage = () => {
  const {enqueueSnackbar} = useSnackbar();
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const isVerifyRecaptcha = !!recaptchaValue;
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
  });

  function handleOnChangeRecaptcha(value: string | null) {
    setRecaptchaValue(value);
  }

  const [executeRegister, registerStatus] = useRequest<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    recaptcha: string | null;
  }>({
    request: async payload => {
      await authService.register(payload)
    },
    onResolve: () => {
      enqueueSnackbar('Register account successfully, please verify your email before signing in', {
        variant: 'success',
      });
    },
    onReject: (error: any) => {
      enqueueSnackbar(error.response.data.message, {variant: 'error'});
      reset();
    },
  });

  const onSubmit = handleSubmit(fieldsValue => {
    if (isVerifyRecaptcha) {
      executeRegister({...fieldsValue, recaptcha: recaptchaValue || ''});
    } else {
      enqueueSnackbar("Must verify recaptcha!", {variant: "error"})
    }
  });

  return (
    <AuthenticationLayout
      route="/auth/sign-in" routeName="Login"
      title="Sign Up" description="Have an account?">
      <Head>
        <title>Register</title>
      </Head>
      <form onSubmit={onSubmit}>
        <Stack gap={2} mt={5}>
          <TextField
            label="Username"
            error={!!errors.username}
            helperText={errors.username?.message}
            fullWidth
            {...register('username')}
          />
          <TextField
            label="Email"
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
            {...register('email')}
          />
          <TextField
            label="Password"
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment:<InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={(e) => e.preventDefault()}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }}
          />
          <TextField
            label="Confirm Password"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            fullWidth
            {...register('confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment:<InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  onMouseDown={(e) => e.preventDefault()}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }}
          />
          <ReCAPTCHA
            style={{margin: '0 auto'}}
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={handleOnChangeRecaptcha}
          />
          <LoadingButton type="submit" variant="contained" loading={registerStatus === 'pending'}>
            Sign Up
          </LoadingButton>
        </Stack>
      </form>

      <Divider sx={{marginTop: 4}}>
        <Typography variant={"body2"} color="text.disabled" px={1}>
          OR
        </Typography>
      </Divider>
      <Stack direction="row" justifyContent="space-between" flexWrap="wrap" my={3}>
        <StyledButton>
          <GoogleIcon sx={{marginRight: 1, fontSize: '1.2rem'}} />
          Signin with Google
        </StyledButton>
        <StyledButton>
          <FacebookIcon sx={{color: '#2475EF', marginRight: 1, fontSize: '1.2rem'}}/>
          Signin with Facebook
        </StyledButton>
      </Stack>
    </AuthenticationLayout>
  );
};

export default Register;
