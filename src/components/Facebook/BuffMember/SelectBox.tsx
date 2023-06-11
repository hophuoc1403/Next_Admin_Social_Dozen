import {Autocomplete, TextField} from "@mui/material";

interface SelectedBoxProps {
  list:{label:string}[]
  label:string
}

const SelectBox = ({list,label}:SelectedBoxProps) => {
  return <Autocomplete
    disablePortal
    id="combo-box-demo"
    options={list}
    sx={{ width: 300 }}
    renderInput={(params) => <TextField {...params} label={label} />}
  />
}

export default SelectBox