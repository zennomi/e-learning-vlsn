import { useState, useCallback, useEffect } from 'react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
// @mui
import { Button, Container, Stack, Typography } from '@mui/material';
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

// ----------------------------------------------------------------------

export default function Test() {
  const { themeStretch } = useSettings();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();

  const { id } = useParams();

  const [test, setTest] = useState(null);

  const getTest = useCallback(async () => {
    try {
      const { data } = await axios.get(`/v1/tests/${id}`);
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
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={test?.name || "Đề thi"}
          links={[
            { name: 'Học tập', href: PATH_LEARNING.root },
            { name: 'Đề thi', href: PATH_LEARNING.test.root },
            { name: test?.name || "Đề thi" },
          ]}
        />
        {
          test &&
          <Stack spacing={2}>
            <Typography>{`Đề thi gồm ${test.questions?.length} câu.`}</Typography>
            <Typography>{`Thời gian ${test.time} phút.`}</Typography>
            <Button fullWidth variant='contained' component={RouterLink} to={`${PATH_LEARNING.test.root}/${id}/lam`}>Bắt đầu làm bài</Button>
          </Stack>
        }
        {/* {test && <TestDoingArea test={test} />} */}
      </Container>
    </Page >
  );
}
