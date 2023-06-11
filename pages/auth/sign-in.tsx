import { zodResolver } from '@hookform/resolvers/zod';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  ButtonBase,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  InputAdornment,
  Stack,
  styled,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '../components/shared/icons/GoogleIcon';
import AuthenticationLayout from '@/layouts/AuthenticationLayout';
import { useSnackbar } from 'notistack';
import { useRequest } from '@/hooks/useRequest';
import { authService } from '@/services/auth.service';
import { useAuthContext } from '@/contexts/AuthContext';
import LocalStorageService from '@/services/storage.service';
import { AUTH_KEYS } from '@/configs/keys.config';
import { useState } from 'react';
import jwt_decode from 'jwt-decode';
import { queriesSSOGoogleConfig } from '@/configs/oauth.config';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTheme as reduxTheme } from '@/hooks/useTheme';
import { ThemeConstant } from '@/constants/theme.constant';

const StyledButton = styled(ButtonBase)(({ theme }) => ({
  width: '100%',
  padding: 12,
  marginBottom: 16,
  borderRadius: '8px',
  fontWeight: 500,
  border: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down(454)]: {
    width: '100%',
    marginBottom: 8
  }
}));

const loginFormSchema = z.object({
  email: z.string().min(5, {
    message: 'Login field must be at least 5 characters'
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters'
  })
});

const Login: NextPage = () => {
  const {
    TOKEN,
    ACCESS_TOKEN,
    REFRESH_TOKEN,
    ACCESS_TOKEN_EXPIRES_IN,
    ACCESS_TOKEN_EXPIRES_AT
  } = AUTH_KEYS;
  const { setAccount } = useAuthContext();
  const router = useRouter();
  const [isOpenVerifyEmailWarning, setIsOpenVerifyEmailWarning] =
    useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = reduxTheme();
  const { palette } = useTheme();
  const [executeLogin, loginStatus] = useRequest<ILoginPayload>({
    request: (signInPayload) => authService.login(signInPayload),
    onResolve: async (response: any) => {
      console.log(response);
      const { access_token, refresh_token, access_token_expires_in } = response;
      const { exp }: any = jwt_decode(access_token);
      LocalStorageService.set(TOKEN, {
        [ACCESS_TOKEN]: access_token,
        [REFRESH_TOKEN]: refresh_token,
        [ACCESS_TOKEN_EXPIRES_IN]: access_token_expires_in,
        [ACCESS_TOKEN_EXPIRES_AT]: exp
      });
      setAccount({
        // @ts-ignore
        data: response?.user
      });

      router.push('/app/admin/manage/account');
    },
    onReject: (_error: any) => {
      enqueueSnackbar('Failed to sign in', {
        variant: 'error'
      });
    }
  });
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema)
  });

  const handleCollapseResendEmail = () => {
    setIsOpenVerifyEmailWarning(true);
  };

  const handleOnClickResendConfirmEmail = () => {
    router.push('/auth/confirm');
  };

  const onSubmit = handleSubmit(async (payload) => {
    await executeLogin(payload);
  });

  const onSignInWithSSO = () => {
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth${queriesSSOGoogleConfig}`;
  };

  return (
    <AuthenticationLayout
      route="/auth/sign-up"
      description="New Here?"
      title="Sign in to Social Dozen"
      routeName="Create an account"
    >
      <Head>
        <title>Login</title>
      </Head>
      {isOpenVerifyEmailWarning && (
        <Card sx={{ marginTop: 4 }}>
          <CardHeader
            avatar={<WarningIcon color={'warning'} />}
            title="Please confirm your email address!"
            action={
              <IconButton
                aria-label="close"
                onClick={handleCollapseResendEmail}
              >
                <CloseIcon />
              </IconButton>
            }
          />
          <CardContent sx={{ paddingTop: 0 }}>
            <Typography variant="body2" color="text.secondary">
              Please confirm your email we sent to verify your email address. If
              you did not get this email, click on Resend button below.
            </Typography>
          </CardContent>
          <CardActions sx={{ paddingBottom: 2 }}>
            <Button
              variant="contained"
              onClick={handleOnClickResendConfirmEmail}
            >
              Resend confirmation email
            </Button>
          </CardActions>
        </Card>
      )}
      <form onSubmit={onSubmit}>
        <Stack gap={2} mt={5}>
          <TextField
            id="email"
            label="Username"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email')}
            fullWidth
          />
          <TextField
            label="Password"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password')}
            fullWidth
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOff fontSize={'small'} />
                    ) : (
                      <Visibility fontSize={'small'} />
                    )}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Stack
            justifyContent={'space-between'}
            direction={'row'}
            alignItems={'center'}
          >
            <Stack alignItems={'center'} direction={'row'}>
              <Checkbox />
              <Typography>Remember password</Typography>
            </Stack>
            <Link
              href={'/auth/forget-password'}
              style={{ fontSize: 14, textAlign: 'left' }}
            >
              Forget password?
            </Link>
          </Stack>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={loginStatus === 'pending'}
          >
            Sign In
          </LoadingButton>
        </Stack>
      </form>

      <div
        style={{
          width: '100%',
          height: '15px',
          borderBottom: `1px solid ${
            theme === ThemeConstant.LIGHT ? 'black' : 'white'
          }`,
          textAlign: 'center',
          marginBlock: '30px'
        }}
      >
        <Typography
          variant={'body1'}
          fontWeight={600}
          style={{
            fontSize: '17px',
            padding: '0 10px',
            display: 'inline-block',
            backgroundColor: palette.background.default
          }}
        >
          Or
        </Typography>
      </div>

      <Stack
        direction="row"
        justifyContent="space-between"
        flexWrap="wrap"
        my={3}
      >
        <StyledButton
          onClick={() => {
            onSignInWithSSO();
          }}
        >
          <GoogleIcon sx={{ marginRight: 1, fontSize: '1.2rem' }} />
          Signin with Google
        </StyledButton>

        <StyledButton>
          <FacebookIcon
            sx={{ color: '#2475EF', marginRight: 1, fontSize: '1.2rem' }}
          />
          Signin with Facebook
        </StyledButton>
      </Stack>
    </AuthenticationLayout>
  );
};

export default Login;
