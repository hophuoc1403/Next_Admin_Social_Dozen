import {ThemeProvider} from '@mui/material';
import {themeCreator} from './base';
import {StylesProvider} from "@mui/styles";
import {useTheme} from "@/hooks/useTheme";


const ThemeProviderWrapper = ({children}) => {

  const {theme:themeState} = useTheme()
  const theme = themeCreator(themeState);

  return (
    <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StylesProvider>
  );
};

export default ThemeProviderWrapper;
