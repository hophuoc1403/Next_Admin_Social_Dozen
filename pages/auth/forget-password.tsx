import React, { useState } from 'react';
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Head from 'next/head';
import {useRequest} from "@/hooks/useRequest";
import AuthenticationLayout from "@/layouts/AuthenticationLayout";
import {authService} from "@/services/auth.service";
import ReCAPTCHA from "react-google-recaptcha";
import {RECAPTCHA_SITE_KEY} from "@/configs/oauth.config";

const emailSchema = z.object({
  email: z.string().email('Email must be a valid email address'),
});

const ForgetPassword = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
  });

  const [executeSend, sendStatus] = useRequest<{
    email: string;
    recaptcha: string | null;
  }>({
    request: async payload => {
     await authService.forgetPassword(payload)
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

  function handleOnChangeRecaptcha(value: string | null) {
    setRecaptchaValue(value);
  }

  const onSubmit = handleSubmit(data => {
    executeSend({
      email: data.email,
      recaptcha: recaptchaValue || 'todo',
    });
  });

  return (
    <AuthenticationLayout route="/auth/sign-in" description="New Here?" title="Forgot password to Social Dozen" routeName="Login">
      <Head>
        <title>Forget Password</title>
      </Head>
      <form onSubmit={onSubmit}>
        <Stack gap={2} mt={5}>
          <TextField
            id="email"
            label="Email"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email')}
            fullWidth
          />
          <ReCAPTCHA
            style={{margin: '0 auto'}}
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={handleOnChangeRecaptcha}
          />
          <LoadingButton type="submit" variant="contained" loading={sendStatus === 'pending'}>
            Send
          </LoadingButton>
        </Stack>
      </form>
    </AuthenticationLayout>
  );
};

export default ForgetPassword;
