// @mui
import { Container, Typography, Box } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
import Latex from 'react-latex-next';
// components
import Page from '../components/Page';
import LatexStyle, { delimiters } from '../components/LatexStyle';
// ----------------------------------------------------------------------

export default function Demo() {
  const { themeStretch } = useSettings();

  return (
    <LatexStyle>
            <Box sx={{ my: 1 }}>
                <Latex delimiters={delimiters}>
                    {"$q_{1}=q_{2}=2,67.\\left(10\\right)^{- 7}\\left(\\right.\\mu C\\left.\\right)$"}
                </Latex>
                <Latex delimiters={delimiters}>
                    {"$q_{1}=q_{2}=2,67.\\left(10\\right)^{- 9}\\left(\\right.C\\left.\\right)$"}
                </Latex>
            </Box>
        </LatexStyle>
  );
}
