import {
  Avatar,
  Chip,
  IconButton,
  Paper,
  Switch,
  Typography
} from '@mui/material';
import { useAppDispatch } from '@/hooks/redux.hook';
import { useSnackbar } from 'notistack';
import { useAccounts } from '@/hooks/useAccounts';
import { GridColDef } from '@mui/x-data-grid';
import { useEffect } from 'react';
import BuffWrapper from '@/components/wrapper/BuffWrapper';
import { StyledTable } from '../../cart';
import NoData from '@/content/shared/NoData';
import { NextPageWithLayout } from '../../../_app';
import SidebarLayout from '@/layouts/SidebarLayout';
import { activateAccount, loadAccount } from '@/redux/actions/account.action';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { DeleteOutline } from '@mui/icons-material';
import { accountService } from '@/services/account.service';
import { useAuthContext } from '@/contexts/AuthContext';

const Account: NextPageWithLayout = () => {
  const { accounts, loading, pagination } = useAccounts();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { account } = useAuthContext();

  useEffect(() => {
    dispatch(loadAccount({}));
  }, []);

  const handleActive = async (id: string) => {
    try {
      dispatch(activateAccount(id));
      enqueueSnackbar('Active account success!', {
        variant: 'success'
      });
    } catch (e) {
      enqueueSnackbar('Active account failed!', {
        variant: 'error'
      });
    }
  };

  const handleDeleteAccount = async (id: number) => {
    try {
      await accountService.deleteAccount(id);
      enqueueSnackbar('Delete account success!', {
        variant: 'success'
      });
      dispatch(loadAccount({}));
    } catch (e) {
      enqueueSnackbar('Delete account failed!', {
        variant: 'error'
      });
    }
  };

  const column: GridColDef<IAccount>[] = [
    {
      field: 'avatar',
      align: 'left',
      width: 100,
      headerAlign: 'left',
      headerName: 'Avatar',
      renderCell: (params) => (
        <Avatar
          src={'http://localhost:3001/' + params.row.picturePath}
          variant={'rounded'}
          alt={"user's image"}
        />
      )
    },
    {
      field: 'email',
      align: 'left',
      flex: 1,
      headerAlign: 'left',
      headerName: 'Email'
    },
    {
      field: 'lastName',
      align: 'left',
      // width: 200,
      flex: 1,
      headerAlign: 'left',
      headerName: 'Last name'
    },
    {
      field: 'firstName',
      align: 'left',
      // width: 200,
      flex: 1,
      headerAlign: 'left',
      headerName: 'First name'
    },
    {
      field: 'location',
      align: 'left',
      // width: 200,
      flex: 1,
      headerAlign: 'left',
      headerName: 'Location'
    },
    {
      field: 'occupation',
      align: 'left',
      // width: 200,
      flex: 1,
      headerAlign: 'left',
      headerName: 'Occupation'
    },
    {
      field: 'role',
      align: 'left',
      width: 180,
      headerAlign: 'left',
      headerName: 'Roles',
      renderCell: (params) => (
        <>
          <Typography mr={1} variant={'body1'}>
            <Chip
              size={'small'}
              color={params.row.role === 'admin' ? 'primary' : 'default'}
              label={params.row.role}
            />
          </Typography>
        </>
      )
    },
    {
      field: 'filter',
      align: 'left',
      width: 180,
      headerAlign: 'left',
      headerName: 'Actions',
      renderCell: (params) => (
        <>
          <IconButton>
            <BorderColorIcon />
          </IconButton>

          <IconButton
            color={'error'}
            onClick={() => handleDeleteAccount(params.row.id)}
          >
            <DeleteOutline />
          </IconButton>
        </>
      )
    }
  ];
  return (
    <BuffWrapper>
      {accounts.length > 1 ? (
        <Paper sx={{ p: '20px 30px' }}>
          <Typography
            mb={2}
            variant={'body1'}
            sx={{
              fontSize: '20px',
              fontWeight: 'bold'
            }}
          >
            Manage Account
          </Typography>
          <StyledTable
            columns={column}
            rows={accounts.filter((item) => item.id !== account.id)}
            initialState={{
              pagination: {
                paginationModel: { pageSize: pagination.itemsPerPage, page: 0 }
              }
            }}
            onPaginationModelChange={(val) =>
              dispatch(
                loadAccount({
                  page: +val.page + 1,
                  limit: pagination.itemsPerPage
                })
              )
            }
            rowCount={pagination.totalItems}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            paginationMode={'server'}
            rowHeight={70}
            loading={loading}
          />
        </Paper>
      ) : (
        !loading && <NoData />
      )}
    </BuffWrapper>
  );
};

Account.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;
export default Account;
