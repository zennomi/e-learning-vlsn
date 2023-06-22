// @mui
import { styled } from '@mui/material/styles';
import { Card, Tab, Tabs, Box, Container } from '@mui/material';
import { useSearchParams } from "react-router-dom";
// hooks
import useAuth from '../hooks/useAuth';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections
import ProfileCover from '../sections/profile/ProfileCover';
import ProfileResult from '../sections/profile/ProfileResult';
import ProfileConnectToManagementApp from '../sections/profile/ProfileConnectToManagementApp';

// ----------------------------------------------------------------------

const TabsWrapperStyle = styled('div')(({ theme }) => ({
  zIndex: 9,
  bottom: 0,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'center',
  },
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(3),
  },
}));

const PROFILE_TABS = [
  {
    value: 'Thành tích',
    icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
    component: <ProfileResult />,
  },
  {
    value: 'Kết nối App Quản Lý',
    icon: <Iconify icon={'eva:heart-fill'} width={20} height={20} />,
    component: <ProfileConnectToManagementApp />,
  },
];

export default function Profile() {
  const { user } = useAuth();
  let [searchParams, setSearchParams] = useSearchParams({ tab: "Khoá học đã mua" });

  return (
    <Page title="Trang cá nhân">
      <Container>
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative',
          }}
        >
          <ProfileCover user={user} />
          <TabsWrapperStyle>
            <Tabs
              allowScrollButtonsMobile
              variant="scrollable"
              scrollButtons="auto"
              value={searchParams.get("tab")}
              onChange={(event, tab) => { setSearchParams({ tab }) }}
            >
              {PROFILE_TABS.map((tab) => (
                <Tab disableRipple key={tab.value} value={tab.value} icon={tab.icon} label={tab.value} />
              ))}
            </Tabs>
          </TabsWrapperStyle>
        </Card>
        {PROFILE_TABS.map((tab) => {
          const isMatched = tab.value === searchParams.get("tab");
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}
