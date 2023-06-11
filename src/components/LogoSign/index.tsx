import {
  styled,
} from '@mui/material';
import Link from 'src/components/Link';
import React from "react";

const LogoWrapper = styled(Link)(
  ({theme}) => `
        color: ${theme.palette.text.primary};
        display: flex;
        text-decoration: none;
        margin: 0 auto;
        font-weight: ${theme.typography.fontWeightBold};
`
);

function Logo() {
  return (
    <LogoWrapper href="/app/service-price">
      <img style={{width: "70px"}} src="https://sabommo.net/assets/uploads/images/logo-sabo.png"
           alt="Logo"/>
    </LogoWrapper>
  );
}

export default Logo;
