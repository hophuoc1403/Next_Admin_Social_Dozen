import {Box, CircularProgress, Paper, TextField} from "@mui/material";
import {SearchOutlined} from "@mui/icons-material";
import {useEffect, useState} from "react";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {useDebounce} from "usehooks-ts";

const data = [
  {
    id: 1,
    seedingUid: 'ABC123',
    orderAmount: 1000000,
    startNum: 10,
    seedingNum: 20,
    reaction: 'positive',
    status: 'completed',
    baoHanh: '12 tháng',
    note: 'Ghi chú cho bản ghi số 1',
    ngayTao: '2023-05-16',
    nguoiTao: 'John Doe',
    hanhDong: 'Xem chi tiết'
  },
  {
    id: 2,
    seedingUid: 'DEF456',
    orderAmount: 500000,
    startNum: 5,
    seedingNum: 15,
    reaction: 'neutral',
    status: 'in progress',
    baoHanh: '6 tháng',
    note: 'Ghi chú cho bản ghi số 2',
    ngayTao: '2023-05-15',
    nguoiTao: 'Jane Smith',
    hanhDong: 'Cập nhật'
  },
  {
    id: 3,
    seedingUid: 'GHI789',
    orderAmount: 2000000,
    startNum: 8,
    seedingNum: 18,
    reaction: 'negative',
    status: 'pending',
    baoHanh: '24 tháng',
    note: 'Ghi chú cho bản ghi số 3',
    ngayTao: '2023-05-14',
    nguoiTao: 'Alice Johnson',
    hanhDong: 'Xóa'
  },
  // Bản ghi 4
  // Bản ghi 5
];

const column: GridColDef[] = [
  {field: "id", headerName: "#ID", width: 100},
  {field: "seedingUid", headerName: "Seeding UID", width: 150},
  {field: "orderAmount", headerName: "Tags Amount", width: 150},
  {field: "startNum", headerName: "Start Num", width: 150},
  {field: "seedingNum", headerName: "Seeding Num", width: 150},
  {field: "reaction", headerName: "Reaction", width: 150},
  {field: "status", headerName: "Status", width: 150},
  {field: "baoHanh", headerName: "Bảo hành", width: 150},
  {field: "note", headerName: "Note extra", width: 150},
  {field: "ngayTao", headerName: "Ngày tạo", width: 150},
  {field: "nguoiTao", headerName: "Người tạo", width: 150},
  {field: "hanhDong", headerName: "Hành Động", width: 150},
]

const FacebookList = () => {

  const [currentPage, setCurrentPage] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const [searchingVal, setSearchingVal] = useState('')
  const debouncedValue = useDebounce<string>(searchingVal, 500)

  useEffect(() => {
    setIsSearching(false)
  }, [debouncedValue])

  useEffect(() => {
  }, [currentPage])

  return <Paper sx={{my: 4, p: "20px 30px"}}>
    <TextField
      value={searchingVal}
      onChange={e => {
        setSearchingVal(e.target.value)
        setIsSearching(true)
      }}
      label={"Search something ..."}
      size={"medium"}
      InputProps={{
        endAdornment: <Box sx={{width: "30px"}}>{isSearching ? <CircularProgress size={20}/> : <SearchOutlined fontSize={"small"}/>}</Box>
      }}
      sx={{mb: 2}}
    />

    <DataGrid
      columns={column} rows={data}
      initialState={{
        pagination: {
          paginationModel: {pageSize: 5, page: 0},
        }
      }}
      onPaginationModelChange={val => setCurrentPage(val.page + 1)}
      rowCount={100}
    />
  </Paper>
}

export default FacebookList