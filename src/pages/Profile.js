// @mui
import { styled } from '@mui/material/styles';
import { Card, Tab, Tabs, Box } from '@mui/material';
// hooks
import useAuth from '../hooks/useAuth';
import useTabs from '../hooks/useTabs';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections
import ProfileCover from '../sections/profile/ProfileCover';
import ProfileResult from '../sections/profile/ProfileResult';
import ProfileConnectToTCT from '../sections/profile/ProfileConnectToTCT';

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
    value: 'Kết nối TCT',
    icon: <Iconify icon={'eva:heart-fill'} width={20} height={20} />,
    component: <ProfileConnectToTCT />,
  },
];

export default function Profile() {
  const { user } = useAuth();
  const { currentTab, onChangeTab } = useTabs('Thành tích');

  return (
    <Page title="Trang cá nhân">
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
            value={currentTab}
            onChange={onChangeTab}
          >
            {PROFILE_TABS.map((tab) => (
              <Tab disableRipple key={tab.value} value={tab.value} icon={tab.icon} label={tab.value} />
            ))}
          </Tabs>
        </TabsWrapperStyle>
      </Card>
      {PROFILE_TABS.map((tab) => {
        const isMatched = tab.value === currentTab;
        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
      })}
    </Page>
  );
}
