import {styled, Typography} from '@mui/material';
import { Box } from '@mui/system';
import { FC } from 'react';

const StyledProvider = styled(Box)(({ theme }) => ({
  outline: 0,
  padding: 24,
  height: '100%',
  display: 'flex',
  overflow: 'hidden',
  position: 'relative',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.background.paper,
  '& .focusRing___1airF.carousel__slide-focus-ring': {
    outline: 'none !important',
  },
}));


const AuthSideContent: FC = () => {
  return (
    <StyledProvider
    >
          <SlideComponent
            img="/login_banner.svg"
            title="Graph and analytics"
            descripiton="View your big dataset on graph and chart."
          />
    </StyledProvider>
  );
};

export default AuthSideContent;

function SlideComponent({ img, title, descripiton }: { img?: string; title?: string; descripiton?: string }) {
  return (
    <Box sx={{ padding: 4, textAlign: 'center' }}>
      <img alt="slide" src={img} style={{ maxWidth: 300 }} />
      <Typography variant={"h1"} fontWeight={700} mt={3}>
        {title}
      </Typography>
      <Typography variant={"body1"}>{descripiton}</Typography>
    </Box>
  );
}
