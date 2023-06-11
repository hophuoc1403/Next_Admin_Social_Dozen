import { NextPageWithLayout } from '../../../_app';
import {
  Box,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import SidebarLayout from '@/layouts/SidebarLayout';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/redux.hook';
import { useOrders } from '@/hooks/useOrders';
import { useAccounts } from '@/hooks/useAccounts';
import { useSnackbar } from 'notistack';
import { tagService } from '@/services/tags.service';
import { loadTags } from '@/redux/actions/order.action';
import { GridColDef } from '@mui/x-data-grid';
import moment from 'moment/moment';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';
import BuffWrapper from '@/components/wrapper/BuffWrapper';
import { StyledTable } from '../../cart';
import NoData from '@/content/shared/NoData';
import OrderDetailModal from '@/content/Order/OrderDetailModal';
import { useSites } from '@/hooks/useSites';
import { useConfirm } from 'material-ui-confirm';
import { loadPost } from '@/redux/actions/site.action';
import { siteService } from '@/services/reportedPost.service';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { DeleteOutline } from '@mui/icons-material';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

const Tags: NextPageWithLayout = () => {
  const { orders, loading, pagination } = useOrders();
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();
  const [nameTagVal, setNameTagVal] = useState('');

  useEffect(() => {
    dispatch(loadTags({}));
  }, []);

  const handleAdd = async () => {
    await tagService.addTags(nameTagVal);
    enqueueSnackbar('Add tag success', { variant: 'success' });
    dispatch(loadTags({}));
  };

  const column: GridColDef<any>[] = [
    {
      field: 'name',
      align: 'left',
      // width: 200,
      flex: 1,
      headerAlign: 'left',
      headerName: 'Name'
    },
    {
      field: 'createdAt',
      align: 'left',
      // width: 200,
      flex: 1,
      headerAlign: 'left',
      headerName: 'Create date'
    },
    {
      field: 'filter',
      headerName: 'Actions',
      width: 170,
      renderCell: (params) => {
        return (
          <Box display={'flex'} gap={1}>
            <IconButton>
              {' '}
              <BorderColorIcon
                onClick={async () => {
                  let name = prompt("Enter updated tag's name");
                  if (name) {
                    await tagService.updateTag(params.row.id, name);
                    dispatch(loadTags({}));
                  }
                }}
                fontSize={'small'}
              />
            </IconButton>
            <IconButton color={'error'} size={'small'} onClick={() => {}}>
              <DeleteOutline />
            </IconButton>
          </Box>
        );
      },
      align: 'left',
      headerAlign: 'left'
    }
  ];

  return (
    <BuffWrapper>
      <Paper sx={{ p: '20px 30px' }}>
        <Typography
          mb={2}
          variant={'body1'}
          sx={{
            fontSize: '20px',
            fontWeight: 'bold'
          }}
        >
          Manage Tags
        </Typography>
        <Stack flexDirection={'row'}>
          <TextField
            value={nameTagVal}
            onChange={(e) => setNameTagVal(e.target.value)}
            size={'small'}
            label={'add tag'}
          />
          <LoadingButton onClick={handleAdd}>Add</LoadingButton>
        </Stack>
        {orders.length > 0 ? (
          <StyledTable
            columns={column}
            rows={orders}
            initialState={{
              pagination: {
                paginationModel: { pageSize: pagination.itemsPerPage, page: 0 }
              }
            }}
            onPaginationModelChange={(val) =>
              dispatch(
                loadPost({ page: val.page + 1, limit: pagination.itemsPerPage })
              )
            }
            rowCount={pagination.totalItems}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            paginationMode={'server'}
            loading={loading}
          />
        ) : (
          !loading && <NoData />
        )}
      </Paper>
    </BuffWrapper>
  );
};

Tags.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Tags;
