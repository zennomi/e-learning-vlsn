// @mui
import { Box } from '@mui/material';
// components
import LoadingScreen from 'src/components/LoadingScreen';
import LatexStyle from '../components/LatexStyle';
// ----------------------------------------------------------------------

export default function Demo() {

    return (
        <LatexStyle>
            <Box sx={{ my: 1 }}>
                <LoadingScreen fullScreen />
            </Box>
        </LatexStyle>
    );
}
