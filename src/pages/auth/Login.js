import { capitalCase } from 'change-case';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Tooltip, Container, Typography } from '@mui/material';
// routes
// hooks
import useAuth from '../../hooks/useAuth';
import useResponsive from '../../hooks/useResponsive';
// components
import Page from '../../components/Page';
import Image from '../../components/Image';
// sections
import { LoginForm } from '../../sections/auth/login';
import { PRODUCT_NAME } from '../../config';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));


const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const { method } = useAuth();


  const mdUp = useResponsive('up', 'md');

  return (
    <Page title="Login">
      <RootStyle>
        {/* <HeaderStyle>
          <Logo />
          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              Don’t have an account? {''}
              <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
                Get started
              </Link>
            </Typography>
          )}
        </HeaderStyle> */}

        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, đăng nhập để sử dụng nhiều chức năng của web
            </Typography>
            <Image
              alt="login"
              src="https://minimals.cc/assets/illustrations/illustration_login.png"
            />
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  {`Đăng nhập vào Web Làm Đề ${PRODUCT_NAME.toUpperCase()} 2.0`}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>Đăng nhập để lưu lại kết quả luyện đề, kích hoạt khoá học.</Typography>
              </Box>

              <Tooltip title={capitalCase(method)} placement="right">
                <>
                  <Image
                    disabledEffect
                    src={`https://minimals.cc/assets/icons/auth/ic_${method}.png`}
                    sx={{ width: 32, height: 32 }}
                  />
                </>
              </Tooltip>
            </Stack>

            <LoginForm />

            {/* {!smUp && (
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Don’t have an account?{' '}
                <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
                  Get started
                </Link>
              </Typography>
            )} */}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
