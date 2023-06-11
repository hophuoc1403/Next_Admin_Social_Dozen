import AppDialog from "@/components/AppDialog";

import {
  Box, Button, IconButton,
  Paper,
  Stack,
  Table, TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {useAppDispatch} from "@/hooks/redux.hook";
import {updateProduct} from "@/redux/actions/product.action";
import {useRequest} from "@/hooks/useRequest";
import {useSnackbar} from "notistack";
import {useProducts} from "@/hooks/useProducts";
import AddIcon from '@mui/icons-material/Add';

const addProductFormSchema = z.object({
  name: z.string().refine(value => value.length > 0, {
    message: 'Name is required',
  }),
  description: z.string().refine(value => value.length > 0, {
    message: 'Description is required',
  }),
});

interface UpdateProductProps {
  id: string;
  openUpdate: boolean;
  setOpenUpdate: any
}

const UpdateProduct = ({id, openUpdate, setOpenUpdate}: UpdateProductProps) => {
  const {products} = useProducts();
  const dispatch = useAppDispatch()
  const {enqueueSnackbar} = useSnackbar();
  const [specifications, setSpecifications] = useState<{
    index: number,
    k: string, v: string
  }[]>([])
  const [nameSpecifications, setNameSpecifications] = useState<string>("")
  const [descriptionSpecifications, setDescriptionSpecifications] = useState<string>("")

  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<z.infer<typeof addProductFormSchema>>({
    resolver: zodResolver(addProductFormSchema),
  });

  useEffect(() => {
    const product = products.find(product => product._id === id)
    setValue("name", product?.name)
    setValue("description", product?.description)
    const specifications = product?.specs.map((item, index) => {
      return {
        index,
        k: item.k,
        v: item.v
      }
    })
    setSpecifications(specifications)
  }, [id])

  const onSubmit = handleSubmit(data => {
    const payload = {
      updateValues: {
        name: data.name,
        description: data.description,
        specs: specifications.map(item => {
          return {k: item.k, v: item.v}
        })
      },
      id
    }
    if (specifications.length > 0) {
      executeUpdateProduct(payload)
    }
  })

  const [executeUpdateProduct, updateProductStatus] = useRequest<{
    updateValues: {
      name: string;
      description: string;
      specs: {k: string, v: string}[];
    }, id: string
  }>(
    {
      request: async (payload) => dispatch(updateProduct(payload))
      ,
      onResolve: () => {
        enqueueSnackbar('Product updated successfully', {
          variant: 'success',
        });
        setOpenUpdate(false)
      },
      onReject: (error: any) => {
        enqueueSnackbar(error.response.data.message, {variant: 'error'});
      }
    }
  )

  const handleDeleteSpecifications = (index: number) => {
    setSpecifications(specifications.filter(item => item.index !== index))
  }

  const handleAddSpecifications = () => {
    setSpecifications([{
      index: Number(Date.now().toString()),
      k: nameSpecifications,
      v: descriptionSpecifications
    }, ...specifications])
    setNameSpecifications("")
    setDescriptionSpecifications("")
  }

  return (
    <AppDialog
      maxWidth={""}
      open={openUpdate}
      title={"Update product"}
      onClose={() => setOpenUpdate(false)}
      onEnter={() => onSubmit()}
      onCancel={() => setOpenUpdate(false)}
      loading={updateProductStatus}
    >
      <form action="#">
        <Stack spacing={2}>
          <TextField
            fullWidth
            InputLabelProps={{shrink: true}}
            label="Name"
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register('name')}
          />
          <TextField
            rows={3}
            multiline
            label="Description"
            error={!!errors.description}
            helperText={errors.description?.message}
            {...register('description')}
            fullWidth
            InputLabelProps={{shrink: true}}
          />
          <Box>
            <Typography>
              Specifications:
            </Typography>
            <Box display={"flex"} gap={1} my={2}>
              <TextField
                size={"small"}
                fullWidth
                label="Name"
                value={nameSpecifications}
                onChange={(e: any) => setNameSpecifications(e.target.value)}
              />
              <TextField
                fullWidth
                size={"small"}
                label="Description"
                value={descriptionSpecifications}
                onChange={(e: any) => setDescriptionSpecifications(e.target.value)}
              />
              <Box display={"flex"}>
                <Button
                  disabled={nameSpecifications === "" || descriptionSpecifications === ""}
                  size={"small"}
                  variant={"contained"}
                  onClick={handleAddSpecifications}
                ><AddIcon/></Button>
              </Box>
            </Box>
            <Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{textTransform: "capitalize"}} align="left">Name </TableCell>
                      <TableCell style={{textTransform: "capitalize"}} align="left">Description</TableCell>
                      <TableCell style={{textTransform: "capitalize"}} align="left">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {specifications && specifications.map((specification, index: number) => (
                      <TableRow
                        key={index}
                      >
                        <TableCell align="left">{specification.k}</TableCell>
                        <TableCell align="left">{specification.v}</TableCell>
                        <TableCell align="left">
                          <IconButton onClick={() => handleDeleteSpecifications(specification.index)}>
                            <DeleteOutlineOutlinedIcon color={"error"} fontSize={"small"}/>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography fontStyle={"italic"} fontSize={12} mt={1}>(Specifications in the table can't be
                empty)</Typography>
            </Box>
          </Box>
        </Stack>

      </form>
    </AppDialog>
  )
}

export default UpdateProduct