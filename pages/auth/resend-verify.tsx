import React, { useState } from 'react';
import { Stack, TextField } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import Head from 'next/head';
import AuthenticationLayout from "@/layouts/AuthenticationLayout";
import {useRequest} from "@/hooks/useRequest";
import ReCAPTCHA from "react-google-recaptcha";
import {RECAPTCHA_SITE_KEY} from "@/configs/oauth.config";
import {authService} from "@/services/auth.service";

const resendFormSchema = z.object({
  email: z.string().email('Email must be a valid email address').nonempty(),
});

const AuthResendPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof resendFormSchema>>({
    resolver: zodResolver(resendFormSchema),
  });

  const [executeResendConfirmEmail, resendConfirmEmailStatus] = useRequest<{
    email: string;
    recaptcha: string | null;
  }>({
    request: async payload => {
      await authService.resendVerifyEmail(payload)
    },
    onResolve: () => {
      enqueueSnackbar('Resend confirmation email successfully, please check your email!', {
        variant: 'success',
      });
    },
    onReject: (error: any) => {
      enqueueSnackbar(error.response.data.message, { variant: 'error' });
      reset();
    },
  });

  function handleOnChangeRecaptcha(value: string | null) {
    setRecaptchaValue(value);
  }

  const onSubmit = handleSubmit(fieldsValue => {
    executeResendConfirmEmail({
      email:fieldsValue.email!,
      recaptcha: recaptchaValue || '',
    });
  });

  return (
    <AuthenticationLayout
      route="/auth/sign-in"
      title="Resend confirmation email"
      routeName="Login"
      description="Redirect to login page?"
    >
      <Head>
        <title>Resend verify email</title>
      </Head>
      <form onSubmit={onSubmit}>
        <Stack gap={2} mt={5}>
          <TextField
            id="email"
            label="Email"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email',{required:true})}
            fullWidth
          />
          <ReCAPTCHA
            style={{margin: '0 auto'}}
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={handleOnChangeRecaptcha}
          />
          <LoadingButton type="submit" variant="contained" loading={resendConfirmEmailStatus === 'pending'}>
            Resend
          </LoadingButton>
        </Stack>
      </form>
    </AuthenticationLayout>
  );
};

export default AuthResendPage;
