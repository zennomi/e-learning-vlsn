import { useState, useCallback, useEffect } from 'react';
import { Link as RouterLink, useParams, useNavigate, } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { groupBy, union } from 'lodash';
import arrayShuffle from 'array-shuffle';
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

export default function Test() {
    const { themeStretch } = useSettings();
    const isMountedRef = useIsMountedRef();
    const { enqueueSnackbar } = useSnackbar();
    const isMobile = useResponsive('down', 'md');

    const { id } = useParams();

    const [test, setTest] = useState(null);
    const [answerSheet, setAnswerSheet] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const getTest = useCallback(async () => {
        try {
            const { data } = await axios.get(`/v1/tests/${id}?populate=questions`);
            if (data.isShuffled) {
                const groupByLevel = groupBy(data.questions, 'level');
                data.questions = union(...Object.values(groupByLevel).map(group => arrayShuffle(group)));
            }
            if (isMountedRef.current) {
                setTest(data);
            }
        } catch (err) {
            console.error(err);
            enqueueSnackbar(err, { variant: 'error' });
        }
    }, [isMountedRef]);

    const getAnswerSheet = useCallback(async () => {
        if (!test) return;
        try {
            const { data } = await axios({
                url: "/v1/answersheets",
                method: 'post',
                data: {
                    testId: test.id,
                }
            });
            setAnswerSheet(data);
        } catch (err) {
            console.error(err);
            enqueueSnackbar(err, { variant: 'error' });
        }
    }, [test]);

    useEffect(() => {
        getTest();
        return () => { setTest(); }
    }, [getTest]);

    return (
        <Page title={test?.name || "????? thi"}>
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
                                            <Typography align='center'>{`????? thi g???m ${test.questions?.length} c??u.`}</Typography>
                                            <Typography align='center'>{`Th???i gian ${test.time} ph??t.`}</Typography>
                                            {
                                                isMobile &&
                                                <Alert severity='warning'>L??m tr??n tr??nh duy???t Chrome, Safari, Egde,... ????? c?? tr???i nghi???m t???t nh???t.</Alert>
                                            }
                                            <LoadingButton
                                                fullWidth
                                                variant='contained'
                                                onClick={() => { getAnswerSheet(); setIsLoading(true); }}
                                                loading={isLoading}
                                            >
                                                B???t ?????u l??m b??i
                                            </LoadingButton>
                                            <div>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={6}>
                                                        <CopyToClipboard text={window.location.href}>
                                                            <Button fullWidth variant="outlined">
                                                                Sao ch??p link ?????
                                                            </Button>
                                                        </CopyToClipboard>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Button fullWidth variant="outlined" component={RouterLink} to={PATH_LEARNING.root}>
                                                            Quay v??? trang ch???
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </> :
                            <LoadingScreen fullScreen />
                }
            </Container>
        </Page >
    );
}
