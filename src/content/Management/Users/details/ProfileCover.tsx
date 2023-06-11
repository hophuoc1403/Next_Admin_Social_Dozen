import {Avatar, Box, Button, Card, CardMedia, IconButton, Modal, Stack, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';

import {AccountCircleOutlined, CameraAltOutlined, DateRangeOutlined, EmailOutlined} from '@mui/icons-material'
import moment from "moment";
import {useAuthContext} from "@/contexts/AuthContext";
import {useState} from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import {accountService} from "@/services/account.service";
import {useSnackbar} from "notistack";

const Input = styled('input')({
  display: 'none'
});

const AvatarWrapper = styled(Card)(
  ({theme}) => ({
    position: "relative",
    overflow: "visible",
    display: "inline-block",
    marginTop: `-${theme.spacing(7)}`,
    marginLeft: `${theme.spacing(2)}`,
    "& .MuiAvatar-root": {
      width: `${theme.spacing(14)}`,
      height: `${theme.spacing(14)}`,
    }
  })
);

const ButtonUploadWrapper = styled(Box)(
  ({theme}) => `
    position: absolute;
    width: ${theme.spacing(3.5)};
    height: ${theme.spacing(3.5)};
    bottom: -${theme.spacing(1)};
    right: -${theme.spacing(1)};

    .MuiIconButton-root {
      border-radius: 100%;
      background: ${theme.colors.primary.main};
      color: ${theme.palette.primary.contrastText};
      box-shadow: ${theme.colors.shadows.primary};
      width: ${theme.spacing(3.5)};
      height: ${theme.spacing(3.5)};
      padding: 0;
  
      &:hover {
        background: ${theme.colors.primary.dark};
      }
    }
`
);

const CardCover = styled(Card)(
  ({theme}) => `
    position: relative;

    .MuiCardMedia-root {
      height: ${theme.spacing(26)};
    }
`
);

const ModalStyle = styled(Box)(({theme}) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.default,
  border: '2px solid #000',
  boxShadow: '24px',
  padding: '25px 20px',
  width: 'max-content',
}));

const ProfileCover = () => {
  const {account, setAccount} = useAuthContext();
  const [openedModal, setOpenedModal] = useState<boolean>(false);
  const [previewImg, setPreviewImg] = useState<any>('');
  const [fileAvatar, setFileAvatar] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const {enqueueSnackbar} = useSnackbar();

  const handleUploadAvatar = async (e: any) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      const {result} = e.target;
      if (result) {
        setPreviewImg(result);
      }
    };
    if (file) {
      fileReader.readAsDataURL(file);
    }
    await new Promise(_ => setTimeout(_, 1000));
    if (file !== null) {
      setOpenedModal(true);
      setFileAvatar(file);
    }
  };

  const handleChangeAvatar = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('avatar', fileAvatar);
      const response: any = await accountService.uploadAvatar(formData);
      if (response.success) {
        setAccount(response)
        await new Promise(_ => setTimeout(_, 1000));

      } else {
        return enqueueSnackbar('Update avatar failed', {
          variant: 'error',
        });
      }
      enqueueSnackbar('Update avatar successful', {
        variant: 'success',
      });
      setOpenedModal(false);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      enqueueSnackbar('Update avatar failed', {
        variant: 'error',
      });
    }
  };

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openedModal}
        onClose={() => setOpenedModal(false)}
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
      >
        <ModalStyle>
          <img
            style={{width: '400px', height: '400px', objectFit: 'cover', borderRadius: '10px'}}
            src={previewImg}
            alt="Avatar"
          />
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: 25}}>
            <Button
              size="medium"
              color="error"
              variant="contained"
              onClick={() => {
                setOpenedModal(false);
                setPreviewImg(null);
              }}
            >
              Cancel
            </Button>
            <LoadingButton
              onClick={handleChangeAvatar}
              loading={loading}
              size="medium"
              variant="contained"
              style={{marginLeft: 20}}
            >
              Upload
            </LoadingButton>
          </div>
        </ModalStyle>
      </Modal>

      <CardCover>
        <CardMedia style={{height: 150}} image={'/static/images/placeholders/covers/automation-bg.jpg'}/>
      </CardCover>
      <AvatarWrapper>
        <Avatar
          variant="rounded"
          alt={account.lastName} src={"http://localhost:3001/" + account.picturePath}/>
        <ButtonUploadWrapper>
          {/*<Input*/}
          {/*  onChange={(avatar: any) => {*/}
          {/*    handleUploadAvatar(avatar);*/}
          {/*  }}*/}
          {/*  max-size="1000"*/}
          {/*  accept="image/*"*/}
          {/*  id="icon-button-file"*/}
          {/*  name="icon-button-file"*/}
          {/*  type="file"*/}
          {/*/>*/}
          <label htmlFor="icon-button-file">
            <IconButton component="span" color="primary">
              <CameraAltOutlined fontSize={"small"}/>
            </IconButton>
          </label>
        </ButtonUploadWrapper>
      </AvatarWrapper>
      <Stack spacing={"4px"} py={2} pl={2}>
        <Typography gutterBottom variant="h3">
          {account.lastName}
        </Typography>
        <Box display={"flex"} alignItems={"center"} gap={1}>
          <AccountCircleOutlined color={"disabled"} fontSize={"small"}/>
          <Typography variant="subtitle2">
            {account.lastName}
          </Typography>
        </Box>
        <Box display={"flex"} alignItems={"center"} gap={1}>
          <EmailOutlined color={"disabled"} fontSize={"small"}/>
          <Typography variant="subtitle2">
            {account.email}
          </Typography>
        </Box>
        <Box display={"flex"} alignItems={"center"} gap={1}>
          <DateRangeOutlined color={"disabled"} fontSize={"small"}/>
          <Typography variant="subtitle2">
            Joined {moment(account.createdAt).format("LL")}
          </Typography>
        </Box>
      </Stack>
    </>
  );
};

export default ProfileCover;
