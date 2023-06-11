import {Box} from '@mui/material';
import HeaderSearch from './Search';
import HeaderCart from "@/layouts/SidebarLayout/Header/Buttons/Cart";
import ThemeToggle from "@/layouts/SidebarLayout/Header/Buttons/ToggleTheme";
import {useAccounts} from "@/hooks/useAccounts";
import {useSites} from "@/hooks/useSites";

function HeaderButtons() {

  const {isHostSite} = useAccounts()
  const {currentSite} = useSites()

  return (
    <Box sx={{mr: 1}}>
      {/*<HeaderSearch/>*/}
      {/*{!(isHostSite && currentSite.isDefault) &&*/}
      {/*    <Box sx={{mx: 0.5}} component="span">*/}
      {/*        <HeaderCart/>*/}
      {/*    </Box>*/}
      {/*}*/}
      <Box sx={{mx: 0.5}} component="span">
        <ThemeToggle/>
      </Box>
    </Box>
  );
}

export default HeaderButtons;
