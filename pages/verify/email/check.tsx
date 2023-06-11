import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
import {useSnackbar} from 'notistack';
import {accountService} from "@/services/account.service";

const Check = ({verifyToken}: { verifyToken: string }) => {
  const router = useRouter();
  const {enqueueSnackbar} = useSnackbar();

  useEffect(function handleVerifyAccountWithToken() {
    accountService
      .verifyAccount({verifyToken})
      .then(() => {
        enqueueSnackbar('Verify account successfully!', {
          variant: 'success',
        });
      })
      .catch(() => {
        enqueueSnackbar('Verify account failed!', {
          variant: 'error',
        });
      })
      .finally(() => {
        router.push('/auth/sign-in');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <></>;
};

export const getServerSideProps = async ({query}) => {
  return {
    props: {
      verifyToken: query.verify_token,
    },
  };
};

export default Check;
