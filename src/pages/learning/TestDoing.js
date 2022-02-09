import { useState, useCallback, useEffect } from 'react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import Countdown from 'react-countdown';
// @mui
import { Button, Card, CardContent, Container, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

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
const mockAnswerSheet = {
    _id: "123",
    user: "1234",
    createdAt: new Date()
};

export default function Test() {
    const { themeStretch } = useSettings();
    const isMountedRef = useIsMountedRef();
    const { enqueueSnackbar } = useSnackbar();

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
                                            <Typography>{`Đề thi gồm ${test.questions?.length} câu.`}</Typography>
                                            <Typography>{`Thời gian ${test.time} phút.`}</Typography>
                                            <LoadingButton
                                            fullWidth
                                            variant='contained'
                                            onClick={() => {getAnswerSheet()}}
                                            loading={Boolean(answerSheet)}
                                            >
                                                Bắt đầu làm bài
                                            </LoadingButton>
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
