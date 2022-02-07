import { useState, useCallback, useEffect } from 'react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import Countdown from 'react-countdown';
// @mui
import { Button, Card, CardContent, Container, Stack, Typography } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import useIsMountedRef from '../../hooks/useIsMountedRef';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// paths
import { PATH_LEARNING } from '../../routes/paths';
//sections
import TestDoingArea from '../../sections/test/TestDoingArea';
// utils
import axios from '../../utils/axios';
import LoadingScreen from '../../components/LoadingScreen';

// ----------------------------------------------------------------------

export default function Test() {
    const { themeStretch } = useSettings();
    const isMountedRef = useIsMountedRef();
    const { enqueueSnackbar } = useSnackbar();

    const { id } = useParams();

    const [test, setTest] = useState(null);
    const [started, setStarted] = useState(false);

    const getTest = useCallback(async () => {
        try {
            const { data } = await axios.get(`/v1/tests/${id}?populate=questions`);
            if (isMountedRef.current) {
                setTest(data);
            }
        } catch (err) {
            console.error(err);
            enqueueSnackbar(err, { variant: 'error' });
        }
    }, [isMountedRef]);

    useEffect(() => {
        getTest();
        return () => { setTest([]); }
    }, [getTest]);

    return (
        <Page title={test?.name || "Đề thi"}>
            <Container maxWidth={themeStretch ? false : 'lg'} sx={{ py: 2 }}>
                {
                    started ?
                        <TestDoingArea test={test} />
                        :
                        test ?
                            <>
                                <Card sx={{ mt: 5 }}>
                                    <CardContent>
                                        <Stack spacing={2}>
                                            <Typography>{`Đề thi gồm ${test.questions?.length} câu.`}</Typography>
                                            <Typography>{`Thời gian ${test.time} phút.`}</Typography>
                                            <Button fullWidth variant='contained' onClick={() => setStarted(true)}>Bắt đầu làm bài</Button>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </> :
                            <LoadingScreen />
                }
            </Container>
        </Page >
    );
}
