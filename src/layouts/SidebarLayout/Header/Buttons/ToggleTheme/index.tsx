import { useRef} from "react";
import {IconButton, Tooltip} from "@mui/material";
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import {ThemeConstant} from "@/constants/theme.constant";
import {useTheme} from "@/hooks/useTheme";
import {useAppDispatch} from "@/hooks/redux.hook";
import {onToggleTheme} from "@/redux/reducer/theme.slice";


const ThemeToggle = () => {

  const {theme} = useTheme()
  const dispatch = useAppDispatch()
  const ref = useRef<any>(null);


  return <>
    <Tooltip arrow title="Theme">
      <IconButton
        color="primary" ref={ref}
        onClick={() => dispatch(onToggleTheme({theme: (theme === ThemeConstant.LIGHT ? ThemeConstant.DARK : ThemeConstant.LIGHT)}))}>
        {theme === ThemeConstant.LIGHT ? <LightModeIcon/> : <NightlightIcon/>}
      </IconButton>
    </Tooltip>
  </>
}

export default ThemeToggle