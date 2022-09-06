import Countdown from 'react-countdown';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, LinearProgress } from '@mui/material';

// ----------------------------------------------------------------------

export default function TestProgress({ date, total }) {
    const theme = useTheme();
    const renderer = ({ total: value }) => {
        return <LinearProgress variant="determinate" value={(total - value) / total * 100} />
    };
    return (
        <Box sx={{
            pointerEvents: 'none',
            top: 0,
            left: 0,
            height: 2,
            width: '100%',
            position: 'fixed',
            zIndex: theme.zIndex.snackbar,
            backgroundColor: theme.palette.primary.main,
            boxShadow: `0 0 2px ${theme.palette.primary.main}`,
        }}>
            <Countdown date={date} renderer={renderer} />
        </Box>
    )
}