import {useState, ChangeEvent} from 'react';
import {Container, Tabs, Tab, Grid, Card, CardHeader, Box} from '@mui/material';
import {styled} from '@mui/material/styles';
import EditProfileTab from "@/content/Management/Users/settings/EditProfileTab";
import ActivityTab from "@/content/Management/Users/settings/ActivityTab";

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

const StyledTab = styled(Tab)(
  () => `
    .css-aytf1f-MuiButtonBase-root-MuiTab-root{
      color: #fff !important;
    }
`
);


function UserSettings() {
  const [currentTab, setCurrentTab] = useState<string>('setting_profile');

  const tabs = [
    {value: 'setting_profile', label: 'Setting Profile'},
    {value: 'transaction-history', label: 'Transaction history'},
  ];

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  return (
    <Card>
      <CardHeader/>
      <Box pb={3}>
        <Container maxWidth="lg">
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={3}
          >
            <Grid item xs={12}>
              <TabsWrapper
                onChange={handleTabsChange}
                value={currentTab}
                variant="scrollable"
                scrollButtons="auto"
                textColor="primary"
                indicatorColor="primary"
              >
                {tabs.map((tab) => (
                  <StyledTab key={tab.value} label={tab.label} value={tab.value}/>
                ))}
              </TabsWrapper>
            </Grid>
            <Grid item xs={12}>
              {currentTab === 'setting_profile' && <EditProfileTab/>}
              {currentTab === 'transaction-history' && <ActivityTab/>}
              {/*{currentTab === 'notifications' && <NotificationsTab/>}*/}
              {/*{currentTab === 'security' && <SecurityTab/>}*/}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Card>
  );
}

export default UserSettings;
