import { useState, useCallback, useEffect } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
// @mui
import { Button, Container, Typography, Switch, FormControlLabel, Paper } from '@mui/material';
// hooks
import useSettings from '../../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import useAuth from '../../../hooks/useAuth';
// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// paths
import { PATH_LEARNING } from '../../../routes/paths';
//sections
import TestPreview from '../../../sections/test/TestPreview';
import ResultTable from '../../../sections/test/ResultTable';
// utils
import axios from '../../../utils/axios';
// css
import '../../../assets/css/pdf.css';
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
  const showKeyMode = showKey ? (user.isStaff ? 2 : test?.showKeyMode) : 0;

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
        params: !user.isStaff && { userId: user.id },
      });
      if (isMountedRef.current) setResultTable(data);
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err, { variant: 'error' });
    }
  }, [isMountedRef, isInitialized]);

  const getAnswerSheet = useCallback(
    async (answerSheetId) => {
      try {
        const { data } = await axios.get(`/v1/answersheets/${answerSheetId}`);
        if (isMountedRef.current) setAnswerSheet(data);
      } catch (err) {
        console.error(err);
        enqueueSnackbar(err, { variant: 'error' });
      }
    },
    [isMountedRef]
  );

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
  };

  const deleteResults = useCallback(
    async (resultIds) => {
      try {
        await axios({
          method: 'delete',
          url: '/v1/answersheets',
          data: {
            ids: resultIds,
          },
        });
      } catch (error) {
        enqueueSnackbar(error);
      }
    },
    [resultIds.length]
  );

  const handlePreviewClick = (id) => {
    getAnswerSheet(id);
  };

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
    <Page title={test?.name || 'Đề thi'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={test?.name || 'Đề thi'}
          links={[
            { name: 'Học tập', href: PATH_LEARNING.root },
            { name: 'Đề thi', href: PATH_LEARNING.test.root },
            { name: test?.name || 'Đề thi', href: `${PATH_LEARNING.test.root}/${id}` },
            { name: 'Chi tiết' },
          ]}
        />
        {test?.isPublic || user?.isStaff ? (
          <Button
            fullWidth
            variant="contained"
            component={RouterLink}
            to={`${PATH_LEARNING.test.root}/${id}/lam`}
            startIcon={<Iconify icon="eva:arrow-circle-right-fill" />}
          >
            Vào khu vực làm đề
          </Button>
        ) : (
          <Button
            fullWidth
            disabled
            variant="contained"
            component={RouterLink}
            to={`${PATH_LEARNING.test.root}/${id}/lam`}
            startIcon={<Iconify icon="eva:lock-fill" />}
          >
            Đề thi đã bị khoá
          </Button>
        )}
        {resultTable.length > 0 && (
          <>
            <Typography variant="h3">Kết quả</Typography>
            <ResultTable
              rows={resultTable}
              handleRowClick={handleRowClick}
              deleteResults={deleteResults}
              handlePreviewClick={handlePreviewClick}
            />
          </>
        )}
        {test && key && (user.isStaff || resultTable.length > 0) && (
          <Paper
            sx={(theme) =>
              fullscreenPreview
                ? {
                  zIndex: theme.zIndex.modal,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  p: theme.spacing(2),
                }
                : { p: theme.spacing(2), mt: theme.spacing(2) }
            }
          >
            <Typography variant="h3">Đề thi</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={showKey}
                  onChange={(event) => {
                    setShowKey(event.target.checked);
                  }}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="Hiện đáp án"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={fullscreenPreview}
                  onChange={(event) => {
                    setFullsreenPreview(event.target.checked);
                  }}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="Hiện toàn màn hình"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showToolbar}
                  onChange={(event) => {
                    setShowToolbar(event.target.checked);
                  }}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="Hiện thanh công cụ"
            />
            {Boolean(answerSheet) && (
              <Button
                variant="outlined"
                onClick={() => {
                  if (Boolean(answerSheet)) setAnswerSheet(null);
                }}
              >
                Thoát chế độ xem bài làm
              </Button>
            )}
            <TestPreview
              test={test}
              answerSheet={showKey ? answerSheet : null}
              testKey={key}
              showToolbar={showToolbar}
              showKeyMode={showKeyMode}
            />
          </Paper>
        )}
      </Container>
    </Page>
  );
}
