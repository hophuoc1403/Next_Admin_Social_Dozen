import React, {FC} from "react";
import {Box, Grid, Link, Stack, Theme, Typography, useMediaQuery} from "@mui/material";
import AuthSideContent from "@/layouts/AuthenticationLayout/AuthSideContent";

interface PropsTypes {
  children:React.ReactNode
  title: string;
  route: string;
  routeName: string;
  description: string;
}

const AuthenticationLayout:FC<PropsTypes> = props => {
  const { children, title, route, routeName, description } = props;
  const downMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  return (
    <Grid container height="100vh">
      {!downMd && (
        <Grid item md={6} xs={12} order={1}>
         <AuthSideContent />
        </Grid>
      )}

      <Grid item md={6} xs={12} order={2}>
        <Stack alignItems="center" justifyContent="center" height="100%">
          <Box maxWidth={550} width="100%" padding={4}>
            <Box textAlign="center">
              <Link href={"/"}>
                <img src="/logo.png" width={50} alt="Logo" />
              </Link>
              <Typography variant={"h1"} fontWeight={700} fontSize={24} mt={2} mb={1}>
                {title}
              </Typography>
              <Typography variant={"body2"} color="text.disabled" fontWeight={500}>
                {description} <Link href={route}>{routeName}</Link>
              </Typography>
            </Box>
            {children}
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default AuthenticationLayout