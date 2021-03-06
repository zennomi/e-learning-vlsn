import { useState, useCallback, useEffect } from 'react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
// @mui
import { Box, Button, Container, Grid, Stack, Typography, } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import useAuth from '../../hooks/useAuth';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Label from '../../components/Label';
// paths
import { PATH_LEARNING } from '../../routes/paths';
// utils
import axios from '../../utils/axios';
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

export default function Test() {
  const { themeStretch } = useSettings();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();

  const { id } = useParams();

  const [test, setTest] = useState(null);

  const getTest = useCallback(async () => {
    try {
      const { data } = await axios.get(`/v1/tests/${id}`);
      if (isMountedRef.current) {
        setTest(data);
      }
    } catch (err) {
      enqueueSnackbar(err, { variant: 'error' });
    }
  }, [isMountedRef]);

  useEffect(() => {
    getTest();
    return () => { setTest(null); }
  }, [getTest]);

  const handleDeleteClick = async () => {
    if (window.confirm("Xoá đề thi này?")) {
      try {
        await axios.delete(`/v1/tests/${id}`);
        navigate("/");
      } catch (error) {
        enqueueSnackbar(error, { variant: 'error' });
      }
    }
  }

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
          <Stack spacing={2} sx={{ mb: 2 }}>
            <div>
              <Grid container>
                <Grid item xs={6}>
                  <Typography align='center'>{`Đề thi gồm ${test.questions?.length} câu.`}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography align='center'>{`Thời gian ${test.time} phút.`}</Typography>
                </Grid>
              </Grid>
            </div>
            {test.isPublic && <Typography>Đề thi công khai đáp án sau khi hoàn thành và có thể xem lại bài làm.</Typography>}
            {test.isShuffled && <Typography>Đề thi có trộn đáp án.</Typography>}
            <Box sx={{ display: 'flex' }}>
              {test.grade && <Label sx={{ m: 0.5 }}>{`Lớp ${test.grade}`}</Label>}
              {test.tags?.map(tag => <Label sx={{ m: 0.5 }}>{`${tag}`}</Label>)}
            </Box>
            <Button fullWidth variant='contained' component={RouterLink} to={`${PATH_LEARNING.test.root}/${id}/lam`} startIcon={<Iconify icon="eva:arrow-circle-right-fill" />}>
              Vào khu vực làm đề
            </Button>
          </Stack>
        }
        {
          isAuthenticated &&
          <Stack spacing={2}>
            {
              (test?.isPublic || user.isStaff) &&
              <Button fullWidth variant='contained' component={RouterLink} to={`${PATH_LEARNING.test.root}/${id}/chi-tiet`} startIcon={<Iconify icon="eva:list-fill" />}>
                Xem đề và lịch sử làm bài
              </Button>
            }
            {
              user.isStaff &&
              <>
                <Button fullWidth variant='contained' component={RouterLink} to={`${PATH_LEARNING.test.root}/${id}/cap-nhat`}>Cập nhật đề</Button>
                <Button fullWidth variant='contained' color="error" onClick={handleDeleteClick}>Xoá đề</Button>
              </>
            }
          </Stack>
        }
      </Container>
    </Page >
  );
}