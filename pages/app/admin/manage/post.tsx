import SidebarLayout from '@/layouts/SidebarLayout';
import { Box, Button, IconButton, Paper, Typography } from '@mui/material';
import { useProducts } from '@/hooks/useProducts';
import BuffWrapper from '@/components/wrapper/BuffWrapper';
import { StyledTable } from '../../cart';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/redux.hook';
import { GridColDef } from '@mui/x-data-grid';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import AddProduct from '@/content/Management/Products/AddProduct';
import UpdateProduct from '@/content/Management/Products/UpdateProduct';
import NoData from '@/content/shared/NoData';
import { loadPost } from '@/redux/actions/site.action';
import { loadProducts } from '@/redux/actions/product.action';
import { DeleteOutline } from '@mui/icons-material';
import { productService } from '@/services/product.service';

const ManageProduct = () => {
  const { products, loading, pagination } = useProducts();
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [productId, setProductId] = useState<string>('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadProducts({}));
  }, []);

  const column: GridColDef<any>[] = [
    {
      field: 'name',
      align: 'left',
      headerName: 'Name',
      flex: 1,
      headerAlign: 'left',
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Typography>{params.row.user.lastName}</Typography>
      )
    },
    {
      field: 'description',
      align: 'left',
      headerName: 'Description',
      headerAlign: 'left',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Typography>{params.row.post.description}</Typography>
      )
    },
    {
      field: 'createdAt',
      align: 'left',
      headerName: 'Date',
      headerAlign: 'left',
      flex: 1,
      sortable: false,
      filterable: false
    },
    {
      field: 'action',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (param) => {
        return (
          <Box>
            <IconButton
              color="error"
              size={'small'}
              onClick={() => {
                productService.deletePost(param.row.id);
                dispatch(loadProducts({}));
              }}
            >
              <DeleteOutline fontSize={'small'} />
            </IconButton>
          </Box>
        );
      }
    }
  ];

  return (
    <>
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
            Manage Post
          </Typography>
          {products.length > 0 ? (
            <StyledTable
              columns={column}
              rows={products}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: pagination.itemsPerPage,
                    page: 0
                  }
                }
              }}
              onPaginationModelChange={(val) =>
                dispatch(
                  loadPost({
                    page: val.page + 1,
                    limit: pagination.itemsPerPage
                  })
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
      <AddProduct openAdd={openAdd} setOpenAdd={setOpenAdd} />
      <UpdateProduct
        id={productId}
        openUpdate={openUpdate}
        setOpenUpdate={setOpenUpdate}
      />
    </>
  );
};

ManageProduct.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;
export default ManageProduct;
