import React, { useState } from 'react';
import {InputAdornment, Stack, TextField} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Head from 'next/head';
import {useRequest} from "@/hooks/useRequest";
import AuthenticationLayout from "@/layouts/AuthenticationLayout";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useRouter} from "next/router";
import {accountService} from "@/services/account.service";

const setPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const ForgetPassword = () => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof setPasswordSchema>>({
    resolver: zodResolver(setPasswordSchema),
  });
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const  {verify_token} = router.query

  const [executeSend, sendStatus] = useRequest<{
    newPassword: string;
    confirmPassword: string;
  }>({
    request: async payload => {
      await accountService.changePasswordWithToken({...payload,verifyToken:verify_token as string})
    },
    onResolve: () => {
      enqueueSnackbar('A confirmation email was sent, please check your inbox to reset your password', {
        variant: 'success',
      });
      reset();
    },
    onReject: (error: any) => {
      enqueueSnackbar(error.response.data.message, {
        variant: 'error',
      });
    },
  });

  const onSubmit = handleSubmit(data => {
    executeSend({
      newPassword: data.password,
      confirmPassword: data.confirmPassword,
    });
  });

  return (
    <AuthenticationLayout route="/auth/sign-in" description="New Here?" title="Reset your password" routeName="Login">
      <Head>
        <title>Reset Password</title>
      </Head>
      <form onSubmit={onSubmit}>
        <Stack gap={2} mt={5}>
          <TextField
            label="New Password"
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
            label="Confirm New Password"
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
          <LoadingButton type="submit" variant="contained" loading={sendStatus === 'pending'}>
            Reset
          </LoadingButton>
        </Stack>
      </form>
    </AuthenticationLayout>
  );
};

export default ForgetPassword;
