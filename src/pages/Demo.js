// @mui
import { Container, Typography, Box } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
import Latex from 'react-latex-next';
// components
import Page from '../components/Page';
import LoadingScreen from 'src/components/LoadingScreen';
import LatexStyle, { delimiters } from '../components/LatexStyle';
// ----------------------------------------------------------------------

export default function Demo() {
    const { themeStretch } = useSettings();

    return (
        <LatexStyle>
            <Box sx={{ my: 1 }}>
                <LoadingScreen fullScreen />
            </Box>
        </LatexStyle>
    );
}
