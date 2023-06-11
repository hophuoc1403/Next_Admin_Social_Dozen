import {Box, Button, MenuItem, Stack, Typography} from "@mui/material";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import Select from '@mui/material/Select';
import {siteTemplateService} from "@/services/site-template.service";

interface SelectThemeProps {
  handleNextPage: () => void
  handleBack: () => void
  setValues: Dispatch<SetStateAction<any>>
}

const SelectTheme = ({handleNextPage, handleBack, setValues}: SelectThemeProps) => {

  const [themes, setThemes] = useState<ISiteTemplate[]>([])
  const [selectedTheme, setSelectedTheme] = useState<ISiteTemplate | ''>('')
  const [isSubmit, setIsSubmit] = useState(false)

  useEffect(() => {
    const getTemplate = async () => {
      const response: any = await siteTemplateService.getTemplates()
      setThemes(response.data)
    }
    getTemplate()
  }, [])

  const handleSubmit = async () => {
    setIsSubmit(true)
    if (selectedTheme) {
      setValues(state => ({...state, template: selectedTheme._id}))
      handleNextPage()
    }
  }


  return <Box>
    <Typography variant={"h4"}>Theme</Typography>
    <Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"flex-start"}>
      {themes.length > 0 &&
          <Select
              onChange={e => {
                if (e.target.value !== "") {
                  setSelectedTheme(() => themes.find(theme => theme._id === e.target.value))
                } else {
                  setSelectedTheme("")
                }
              }}
              displayEmpty
              sx={{width: "300px", mt: 2}}
              value={selectedTheme !== "" ? selectedTheme._id : ""}
          >
              <MenuItem value="">
                  <em>None</em>
              </MenuItem>
            {themes.map(theme => (
              <MenuItem key={theme._id} value={theme._id}>
                <em>{theme.name}</em>
              </MenuItem>
            ))}
          </Select>
      }
      {/*{selectedTheme && <Box width={"50%"} overflow={"hidden"}>*/}
      {/*    <Typography>*/}
      {/*      Docker image : {selectedTheme.dockerImage}*/}
      {/*    </Typography>*/}
      {/*</Box>}*/}
    </Stack>
    {isSubmit && !selectedTheme && <Typography variant={"body2"} color={"red"}>Please select your theme</Typography>}

    <Box display={"flex"} justifyContent={"flex-end"} gap={2}>
      <Button onClick={handleBack} variant={"outlined"}>
        Back
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        Next
      </Button>
    </Box>
  </Box>
}

export default SelectTheme