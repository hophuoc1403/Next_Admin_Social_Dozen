import { useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  lighten,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAppDispatch } from '@/hooks/redux.hook';
import { resetSelectedReducersState } from '@/redux/actions/reset.action';
import { authService } from '@/services/auth.service';
import LocalStorageService from '@/services/storage.service';
import { AUTH_KEYS } from '@/configs/keys.config';
import WorkHistoryRoundedIcon from '@mui/icons-material/WorkHistoryRounded';
import { useRouter } from 'next/router';
import { useAccounts } from '@/hooks/useAccounts';
import { useSites } from '@/hooks/useSites';

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`
);

function HeaderUserbox() {
  const { account, setIsSignedIn } = useAuthContext();
  const dispatch = useAppDispatch();
  const { resetAccount } = useAuthContext();
  const { isHostSite } = useAccounts();
  const { currentSite } = useSites();
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const router = useRouter();
  console.log(account);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleSignOut = () => {
    const { refresh_token }: IAuthToken = LocalStorageService.get(
      AUTH_KEYS.TOKEN,
      ''
    );
    authService.logout({ refreshToken: refresh_token }).then(async () => {
      await window.location.replace('/auth/sign-in');
      await new Promise((_) => setTimeout(_, 3000));
      setIsSignedIn(false);
      resetAccount();
      LocalStorageService.clear();
      dispatch(resetSelectedReducersState({}));
    });
  };
  return (
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Avatar
          variant="rounded"
          alt={account.firstName}
          src={'http://localhost:3001/' + account.picturePath}
        />
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabel variant="body1">{account.lastName}</UserBoxLabel>
            <UserBoxDescription variant="body2">
              {account.email}
            </UserBoxDescription>
          </UserBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
          <Avatar
            variant="rounded"
            alt={account.lastName}
            src={'http://localhost:3001/' + account.picturePath}
          />
          <UserBoxText>
            <UserBoxLabel variant="body1">{account.lastName}</UserBoxLabel>
            <UserBoxDescription variant="body2">
              {account.email}
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 1 }} component="nav">
          <Button
            color="primary"
            fullWidth
            onClick={() => {
              router.push('/app/profile');
              setOpen(false);
            }}
          >
            <ListItem>
              <AccountBoxTwoToneIcon fontSize="small" sx={{ mr: 1 }} />
              <ListItemText primary="My Profile" />
            </ListItem>
          </Button>
          <Divider />

          {!(isHostSite && currentSite.isDefault) && (
            <>
              <Button
                color="primary"
                fullWidth
                onClick={() => router.push('/app/orders')}
              >
                <ListItem>
                  <WorkHistoryRoundedIcon sx={{ mr: 1 }} />
                  <ListItemText primary="My Orders" />
                </ListItem>
              </Button>
              <Divider />
            </>
          )}
          <Button color="primary" fullWidth onClick={handleSignOut}>
            <ListItem>
              <LockOpenTwoToneIcon sx={{ mr: 1 }} />
              <ListItemText primary="Sign out" />
            </ListItem>
          </Button>
        </List>
      </Popover>
    </>
  );
}

export default HeaderUserbox;
