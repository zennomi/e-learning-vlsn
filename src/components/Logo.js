import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
// config
import { PRODUCT_NAME } from '../config';
// ----------------------------------------------------------------------

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default function Logo({ disabledLink = false, sx }) {
  const theme = useTheme();
  const PRIMARY_LIGHT = theme.palette.primary.light;
  const PRIMARY_MAIN = theme.palette.primary.main;
  const PRIMARY_DARK = theme.palette.primary.dark;

  const logo = PRODUCT_NAME === 'tct' ?
    (
      <Box sx={{ width: 40, height: 40, ...sx }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 128 128">
          <defs>
            <linearGradient id="BG1" x1="100%" x2="50%" y1="9.946%" y2="50%">
              <stop offset="0%" stopColor={PRIMARY_DARK} />
              <stop offset="100%" stopColor={PRIMARY_MAIN} />
            </linearGradient>
            <linearGradient id="BG2" x1="50%" x2="50%" y1="0%" y2="100%">
              <stop offset="0%" stopColor={PRIMARY_LIGHT} />
              <stop offset="100%" stopColor={PRIMARY_MAIN} />
            </linearGradient>
            <linearGradient id="BG3" x1="50%" x2="50%" y1="0%" y2="100%">
              <stop offset="0%" stopColor={PRIMARY_LIGHT} />
              <stop offset="100%" stopColor={PRIMARY_MAIN} />
            </linearGradient>
          </defs>
          <g fill={PRIMARY_MAIN} fillRule="evenodd" stroke="none" strokeWidth="1">
          <path fill="url(#BG3)" d="M111.84 15.36H16.16c-1.24 0-2.24 1-2.24 2.24v17.99c0 1.24 1 2.24 2.24 2.24h34.65v80.73c0 1.24 1 2.24 2.24 2.24h21.9c1.24 0 2.24-1 2.24-2.24V37.83h34.65c1.24 0 2.24-1 2.24-2.24V17.6c0-1.24-1-2.24-2.24-2.24z"/>
          </g>
        </svg>
      </Box>
    )
    :
    (
      <Box sx={{ width: 40, height: 40, ...sx }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 128 128">
          <defs>
            <linearGradient id="BG1" x1="100%" x2="50%" y1="9.946%" y2="50%">
              <stop offset="0%" stopColor={PRIMARY_DARK} />
              <stop offset="100%" stopColor={PRIMARY_MAIN} />
            </linearGradient>
            <linearGradient id="BG2" x1="50%" x2="50%" y1="0%" y2="100%">
              <stop offset="0%" stopColor={PRIMARY_LIGHT} />
              <stop offset="100%" stopColor={PRIMARY_MAIN} />
            </linearGradient>
            <linearGradient id="BG3" x1="50%" x2="50%" y1="0%" y2="100%">
              <stop offset="0%" stopColor={PRIMARY_LIGHT} />
              <stop offset="100%" stopColor={PRIMARY_MAIN} />
            </linearGradient>
          </defs>
          <g fill={PRIMARY_MAIN} fillRule="evenodd" stroke="none" strokeWidth="1">
            <path
              fill="url(#BG3)"
              d="M102.61 107.83c10.8-9.85 16.84-24.08 16.84-39.9c0-29.73-21.33-53.82-55.45-53.82c-34.12 0-55.45 24.1-55.45 53.82c0 29.73 21.33 53.82 55.45 53.82c7.69 0 14.72-1.23 21.01-3.47l5.97 8.54a2.079 2.079 0 0 0 2.28.81l16.51-4.75c.64-.19 1.16-.67 1.39-1.31c.22-.63.13-1.33-.26-1.89l-8.29-11.85zM64 95.89c-17.72 0-28.81-12.52-28.81-27.96c0-15.44 11.08-27.96 28.81-27.96c17.73 0 28.81 12.52 28.81 27.96c0 6.65-2.07 12.76-5.82 17.56l-7.26-10.38a2.086 2.086 0 0 0-2.28-.81l-16.52 4.75c-.64.19-1.16.67-1.39 1.31c-.22.63-.13 1.33.26 1.89l9.27 13.25c-1.62.24-3.3.39-5.07.39z"
            />
          </g>
        </svg>
      </Box>
    );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <RouterLink to="/">{logo}</RouterLink>;
}
