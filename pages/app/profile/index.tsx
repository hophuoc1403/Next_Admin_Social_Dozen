import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import Footer from '@/components/Footer';
import {Grid, Container} from '@mui/material';
import ProfileCover from '@/content/Management/Users/details/ProfileCover';
import UserSettings from "@/content/Management/Users/settings/UserSettings";

function UserProfile() {
  return (
    <>
      <Head>
        <title>User information</title>
      </Head>
      <Container sx={{mt: 3}} maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12} md={12}>
            <ProfileCover/>
          </Grid>
          <Grid item xs={12} md={12}>
            <UserSettings/>
          </Grid>
        </Grid>
      </Container>
      <Footer/>
    </>
  );
}

UserProfile.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default UserProfile;
