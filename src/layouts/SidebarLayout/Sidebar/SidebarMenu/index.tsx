import {useContext, useState} from 'react';
import {useRouter} from 'next/router';

import {
  alpha,
  Box,
  Button,
  Collapse,
  List,
  ListItem,
  ListSubheader,
  styled
} from '@mui/material';
import {SidebarContext} from 'src/contexts/SidebarContext';

import {ExpandLess, ExpandMore} from '@mui/icons-material';
import {adminNavigations} from '@/configs/navigation.config';
import {useAuthContext} from "@/contexts/AuthContext";
import {useSites} from "@/hooks/useSites";
import {useAccounts} from "@/hooks/useAccounts";

const MenuWrapper = styled(Box)(
  ({theme}) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};
    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${alpha("#fff", 0.5)};
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  ({theme}) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: #8C7CF0;
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: #fff;
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: ${alpha("#fff", 0.9)};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${alpha("#fff", 0.9)};
           
            // color: #8c7cf0;
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: ${alpha("#fff", 0.5)};
            // color: #8c7cf0;
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }
          &.active,
          &:hover {
            background-color: ${alpha("#fff", 0.06)};
            color: #fff;

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: #fff;
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create([
    'transform',
    'opacity'
  ])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`
);

function SidebarMenu() {
  const {account} = useAuthContext();
  const {closeSidebar} = useContext(SidebarContext);
  const router = useRouter();
  const currentRoute = router.pathname;


  const [open, setOpen] = useState({});
  const handleClick = (key) => () => {
    setOpen((prevState) => ({
      ...prevState,
      [key]: !prevState[key]
    }));
  };
  const {currentSite} = useSites()
  const {isHostSite} = useAccounts()


  return (
    <Box sx={{marginTop: 2}}>
      <MenuWrapper>
        {adminNavigations.map(({subheader, key, label, icon: Icon, children}) => {
          const isOpen = open[key] || true;
          return (
            <List
              key={key}
              component="div"
              subheader={
                <ListSubheader component="div" disableSticky>
                  {subheader}
                </ListSubheader>
              }
            >
              <SubMenuWrapper>
                <List component="div">
                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List
                      style={{padding: '3px 4px 0 8px'}}
                      component="div"
                      disablePadding
                    >
                      {children.map(
                        (
                          {
                            key: childKey,
                            label: childLabel,
                            icon: ChildIcon,
                            href: childHref,
                            children
                          }:{
                            key: any,
                            label: any,
                            icon: any,
                            href: any,
                            children:any
                          }) => {
                          const isOpen = open[childKey] || false;
                          return (
                            <>
                              <ListItem
                                onClick={handleClick(childKey)}
                                key={childKey}
                                sx={{pl: 4}}
                              >
                                <Button
                                  className={
                                    currentRoute === ("/app" + childHref) ? 'active' : ''
                                  }
                                  disableRipple
                                  // component="p"
                                  onClick={() => {
                                    if (childHref) {
                                      router.push("/app" + childHref);
                                      closeSidebar();
                                    }
                                  }}
                                  startIcon={ChildIcon && <ChildIcon/>}
                                  endIcon={
                                    !childHref &&
                                    (isOpen ? <ExpandLess/> : <ExpandMore/>)
                                  }
                                >
                                  {childLabel}
                                </Button>
                              </ListItem>
                              <Collapse
                                in={isOpen}
                                timeout="auto"
                                unmountOnExit
                              >
                                <List
                                  style={{padding: '3px 4px 0 8px'}}
                                  component="div"
                                  disablePadding
                                >
                                  {children?.map(
                                    (
                                      {
                                        key: secondChildKey,
                                        label: secondChildLabel,
                                        icon: SecondChildIcon,
                                        href: secondHref
                                      }) => (
                                      <>
                                        <ListItem
                                          onClick={handleClick(secondChildKey)}
                                          key={secondChildKey}
                                          sx={{pl: 4}}
                                        >
                                          <Button
                                            className={
                                              currentRoute === secondHref
                                                ? 'active'
                                                : ''
                                            }
                                            disableRipple
                                            component="a"
                                            onClick={() => {
                                              if (secondHref) {
                                                router.push(secondHref);
                                              }
                                              closeSidebar();
                                            }}
                                            startIcon={
                                              SecondChildIcon && (
                                                <SecondChildIcon/>
                                              )
                                            }
                                          >
                                            {secondChildLabel}
                                          </Button>
                                        </ListItem>
                                      </>
                                    )
                                  )}
                                </List>
                              </Collapse>
                            </>
                          );
                        }
                      )}
                    </List>
                  </Collapse>
                </List>
              </SubMenuWrapper>
            </List>
          );
        })}
      </MenuWrapper>
    </Box>
  );
}

export default SidebarMenu;
