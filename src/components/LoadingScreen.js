import PropTypes from 'prop-types';
import { m } from 'framer-motion';
import parse from 'html-react-parser';

// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
//
import Logo from './Logo';
import ProgressBar from './ProgressBar';
import CustomStyle from './CustomStyle';
//
import { FACTS } from '../constants';
// ----------------------------------------------------------------------

const FullScreenStyle = styled('div')(({ theme }) => ({
  right: 0,
  bottom: 0,
  zIndex: 99999,
  width: '100%',
  height: '100%',
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
}));

const AreaStyle = styled('div')(({ theme }) => ({
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 500,
}));

function SpinLogo() {
  return (
    <>
      <m.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 360 }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          repeatDelay: 1,
          repeat: Infinity,
        }}
      >
        <Logo disabledLink sx={{ width: 64, height: 64 }} />
      </m.div>

      <Box
        component={m.div}
        animate={{
          scale: [1.2, 1, 1, 1.2, 1.2],
          rotate: [270, 0, 0, 270, 270],
          opacity: [0.25, 1, 1, 1, 0.25],
          borderRadius: ['25%', '25%', '50%', '50%', '25%'],
        }}
        transition={{ ease: 'linear', duration: 3.2, repeat: Infinity }}
        sx={{
          width: 100,
          height: 100,
          borderRadius: '25%',
          position: 'absolute',
          border: (theme) => `solid 3px ${alpha(theme.palette.primary.dark, 0.24)}`,
        }}
      />

      <Box
        component={m.div}
        animate={{
          scale: [1, 1.2, 1.2, 1, 1],
          rotate: [0, 270, 270, 0, 0],
          opacity: [1, 0.25, 0.25, 0.25, 1],
          borderRadius: ['25%', '25%', '50%', '50%', '25%'],
        }}
        transition={{
          ease: 'linear',
          duration: 3.2,
          repeat: Infinity,
        }}
        sx={{
          width: 120,
          height: 120,
          borderRadius: '25%',
          position: 'absolute',
          border: (theme) => `solid 8px ${alpha(theme.palette.primary.dark, 0.24)}`,
        }}
      />
    </>
  );
}

// ----------------------------------------------------------------------

LoadingScreen.propTypes = {
  fullScreen: PropTypes.bool,
};

export default function LoadingScreen({ fullScreen, ...other }) {
  const randomIndex = Math.floor(Math.random() * FACTS.length);
  return (
    <>
      <ProgressBar />

      {fullScreen ? (
        <FullScreenStyle {...other}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SpinLogo />
          </Box>
          <Box sx={{ mt: 10, px: 2 }}>
            <CustomStyle>
              <Typography color="primary.main" variant="h5" align="center">
                Có thể em chưa biết
              </Typography>
              <Typography variant="body1">{parse(FACTS[randomIndex])}</Typography>
            </CustomStyle>
          </Box>
        </FullScreenStyle>
      ) : (
        <AreaStyle {...other}>
          <SpinLogo />
        </AreaStyle>
      )}
    </>
  );
}
