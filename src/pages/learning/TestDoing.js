import { useState, useCallback, useEffect } from 'react';
import { Link as RouterLink, useParams, useNavigate, } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
// @mui
import { Alert, Button, Card, CardContent, Container, Grid, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// hooks
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import useResponsive from '../../hooks/useResponsive';
// components
import Page from '../../components/Page';
// paths
import { PATH_LEARNING } from '../../routes/paths';
//sections
import TestDoingArea from '../../sections/test/TestDoingArea';
// utils
import axios from '../../utils/axios';
import LoadingScreen from '../../components/LoadingScreen';

// ----------------------------------------------------------------------
const mockAnswerSheet = {
    _id: "123",
    user: "1234",
    createdAt: new Date()
};

export default function Test() {
    const { themeStretch } = useSettings();
    const isMountedRef = useIsMountedRef();
    const { enqueueSnackbar } = useSnackbar();
    const isMobile = useResponsive('down', 'md');

    const { id } = useParams();

    const [test, setTest] = useState(null);
    const [answerSheet, setAnswerSheet] = useState(null);

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

    const getAnswerSheet = useCallback(async () => {
        try {
            // const { data } = await axios.get(`/v1/tests/${id}?populate=questions`);
            if (isMountedRef.current) {
                setAnswerSheet(mockAnswerSheet);
            }
        } catch (err) {
            console.error(err);
            enqueueSnackbar(err, { variant: 'error' });
        }
    }, [isMountedRef]);

    useEffect(() => {
        getTest();
        return () => { setTest(); }
    }, [getTest]);

    return (
        <Page title={test?.name || "Đề thi"}>
            <Container maxWidth={themeStretch ? false : 'lg'} sx={{ py: 2 }}>
                {
                    answerSheet ?
                        <TestDoingArea test={test} answerSheet={answerSheet} enqueueSnackbar={enqueueSnackbar} />
                        :
                        test ?
                            <>
                                <Card sx={{ mt: 5 }}>
                                    <CardContent>
                                        <Stack spacing={2}>
                                            <Typography color="primary.main" variant='h5' align='center'>{test.name}</Typography>
                                            <Typography align='center'>{`Đề thi gồm ${test.questions?.length} câu.`}</Typography>
                                            <Typography align='center'>{`Thời gian ${test.time} phút.`}</Typography>
                                            {
                                                isMobile &&
                                                <Alert severity='warning'>Làm trên trình duyệt Chrome, Safari, Egde,... để có trải nghiệm tốt nhất.</Alert>
                                            }
                                            <LoadingButton
                                                fullWidth
                                                variant='contained'
                                                onClick={() => { getAnswerSheet() }}
                                                loading={Boolean(answerSheet)}
                                            >
                                                Bắt đầu làm bài
                                            </LoadingButton>
                                            <div>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6}>
                                                        <CopyToClipboard text={window.location.href}>
                                                            <Button fullWidth variant="outlined">
                                                                Sao chép link đề
                                                            </Button>
                                                        </CopyToClipboard>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Button fullWidth variant="outlined" component={RouterLink} to={PATH_LEARNING.root}>
                                                            Quay về trang chủ
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </div>
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
