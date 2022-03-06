import { useState, useCallback, useEffect, } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
// @mui
import { Button, Container, Stack, Typography, Chip, Card, CardContent, Switch, FormControlLabel, Paper } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import useAuth from '../../hooks/useAuth';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// paths
import { PATH_LEARNING } from '../../routes/paths';
//sections
import TestPreview from '../../sections/test/TestPreview';
import ResultTable from '../../sections/test/ResultTable';
// utils
import axios from '../../utils/axios';
// css
import '../../assets/css/pdf.css';
import LoadingScreen from '../../components/LoadingScreen';
// ----------------------------------------------------------------------

export default function Test() {
    const { themeStretch } = useSettings();
    const isMountedRef = useIsMountedRef();
    const { enqueueSnackbar } = useSnackbar();
    const { user, isInitialized } = useAuth();

    const { id } = useParams();

    const [test, setTest] = useState(null);
    const [key, setKey] = useState([]);
    const [showKey, setShowKey] = useState(true);

    const [printMode, setPrintMode] = useState(false);
    const [showToolbar, setShowToolbar] = useState(false);
    const [fullscreenPreview, setFullsreenPreview] = useState(false);

    const [answerSheet, setAnswerSheet] = useState(null);

    const [resultTable, setResultTable] = useState([]);
    const [resultIds, setResultIds] = useState([]);

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

    const getResultTable = useCallback(async () => {
        if (!isInitialized) return; // only get results of logged user
        try {
            const { data } = await axios.get(`/v1/tests/${id}/result-table`, {
                params: !user.isStaff && { userId: user.id }
            });
            if (isMountedRef.current) setResultTable(data);
        } catch (err) {
            console.error(err);
            enqueueSnackbar(err, { variant: 'error' });
        }
    }, [isMountedRef, isInitialized]);

    const getAnswerSheet = useCallback(async (answerSheetId) => {
        try {
            const { data } = await axios.get(`/v1/answersheets/${answerSheetId}`);
            if (isMountedRef.current) setAnswerSheet(data);
        } catch (err) {
            console.error(err);
            enqueueSnackbar(err, { variant: 'error' });
        }
    }, [isMountedRef]);

    const getKey = useCallback(async () => {
        try {
            const { data } = await axios.get(`/v1/tests/${id}/key`);
            if (isMountedRef.current) setKey(data);
        } catch (err) {
            enqueueSnackbar(err, { variant: 'error' });
        }
    }, [isMountedRef]);

    const handleRowClick = (ids) => {
        setResultIds(ids);
    }

    const handleDeleteRowClick = useCallback(async () => {
        try {
            if (!window.confirm(`Xoá ${resultIds.length} bài làm của học sinh?`)) return;
            await axios({
                method: 'delete',
                url: '/v1/answersheets',
                data: {
                    ids: resultIds
                }
            });
            await getResultTable();
        } catch (error) {
            enqueueSnackbar(error);
        }
    }, [resultIds.length]);

    const handlePreviewClick = useCallback(async () => {
        if (resultIds.length === 1) {
            getAnswerSheet(resultIds[0]);
        }
    }, [resultIds.length]);

    useEffect(() => {
        getTest();
    }, [getTest]);

    useEffect(() => {
        getKey();
    }, [getKey]);

    useEffect(() => {
        getResultTable();
    }, [getResultTable]);

    return (
        <Page title={test?.name || "Đề thi"}>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading={test?.name || "Đề thi"}
                    links={[
                        { name: 'Học tập', href: PATH_LEARNING.root },
                        { name: 'Đề thi', href: PATH_LEARNING.test.root },
                        { name: test?.name || "Đề thi", href: `${PATH_LEARNING.test.root}/${id}` },
                        { name: "Chi tiết" },
                    ]}
                />
                {
                    test ?
                        <>
                            <Stack spacing={2} sx={{ mb: 2 }}>
                                <Typography>{`Đề thi gồm ${test.questions?.length} câu.`}</Typography>
                                <Typography>{`Thời gian ${test.time} phút.`}</Typography>
                                <Button fullWidth variant='contained' component={RouterLink} to={`${PATH_LEARNING.test.root}/${id}/lam`}>Vào khu vực làm đề</Button>
                            </Stack>
                            <Typography variant='h3'>Kết quả</Typography>
                            <ResultTable rows={resultTable} handleRowClick={handleRowClick} />
                            <Stack spacing={2} sx={{ mb: 2 }} direction="row">
                                <Button onClick={() => { getResultTable(); }}>Tải lại</Button>
                                <Button onClick={handlePreviewClick} disabled={resultIds.length !== 1}>Xem bài làm</Button>
                                {
                                    user.isStaff &&
                                    <Button color="error" onClick={handleDeleteRowClick} startIcon={<Chip label={resultIds.length} color="error" size="small" />}>Xoá kết quả</Button>
                                }
                            </Stack>
                            <Paper sx={(theme) => fullscreenPreview ? ({ zIndex: theme.zIndex.modal, position: "absolute", top: 0, left: 0, width: "100%", p: theme.spacing(2) }) : ({ p: theme.spacing(2) })}>
                                <Typography variant='h3'>Đề thi</Typography>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={showKey}
                                            onChange={(event) => { setShowKey(event.target.checked); }}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                    }
                                    label="Hiện đáp án"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={fullscreenPreview}
                                            onChange={(event) => { setFullsreenPreview(event.target.checked); }}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                    }
                                    label="Hiện toàn màn hình"
                                />
                                {
                                    Boolean(answerSheet) &&
                                    <Button
                                        variant="outlined"
                                        onClick={() => { if (Boolean(answerSheet)) setAnswerSheet(null) }}
                                    >
                                        Thoát chế độ xem bài làm
                                    </Button>
                                }
                                <TestPreview
                                    test={test}
                                    answerSheet={showKey ? answerSheet : null}
                                    testKey={showKey ? key : []}
                                    showToolbar={showToolbar}
                                />
                            </Paper>
                        </>
                        :
                        <LoadingScreen />
                }
            </Container>
        </Page >
    );
}
