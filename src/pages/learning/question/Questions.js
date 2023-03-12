import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
// @mui
import {
  Container,
  Modal,
  Box,
  Card,
  CardContent,
  Pagination,
  Button,
  Chip,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
// routes
import { PATH_LEARNING } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
// utils
import axios from '../../../utils/axios';
import paramsToObject from '../../../utils/urlParamsHelper';
// sections
import QuestionList from '../../../sections/question/QuestionList';
import QuestionPreview from '../../../sections/question/QuestionPreview';
import QuestionFilterDrawer from '../../../sections/question/QuestionFilterDrawer';

// ----------------------------------------------------------------------

export default function Questions() {
  const { themeStretch } = useSettings();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();

  const [question, setQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [total, setTotal] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams({ page: 1 });
  const [isFilterOpen, setIsFilterOpen] = useState(false);


  const setNewParams = (params) => {
    if (!params.page) params.page = 1;
    const newParams = paramsToObject(searchParams);
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === 'all' || params[key] === '' || !params[key]) delete newParams[key];
      else newParams[key] = params[key];
    });
    setSearchParams({
      ...newParams
    })
  }

  const getQuestions = useCallback(async () => {
    try {
      const { data } = await axios.get('/v1/questions', {
        params: { ...paramsToObject(searchParams), limit: 10 }
      });
      if (isMountedRef.current) {
        setQuestions(data.results);
        setTotal(data.totalPages);
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err, { variant: 'error' });
    }
  }, [isMountedRef, searchParams]);

  useEffect(() => {
    getQuestions();
    return () => { setQuestions([]); }
  }, [getQuestions]);

  const handleOpen = (question) => {
    setQuestion(question);
  }

  const handleClose = () => {
    setQuestion(null);
  }

  const handleGradeClick = (event, grade) => {
    setNewParams({ grade: grade, page: 1 });
  }

  const handlePageChange = (event, page) => {
    setNewParams({ page });
  }

  const handleFilterClose = () => {
    setIsFilterOpen(false);
  }

  return (
    <Page title="Ngân hàng câu hỏi">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Ngân hàng câu hỏi"
          links={[
            { name: 'Học tập', href: PATH_LEARNING.root },
            { name: 'Câu hỏi', href: PATH_LEARNING.question.root },
          ]}
        />
        <ToggleButtonGroup
          color="primary"
          value={Number(searchParams.get("grade"))}
          exclusive
          onChange={handleGradeClick}
          fullWidth
          sx={{ mb: 3 }}
        >
          <ToggleButton value={12} key={12}>Lớp 12</ToggleButton>
          <ToggleButton value={11} key={11}>Lớp 11</ToggleButton>
          <ToggleButton value={10} key={10}>Lớp 10</ToggleButton>
        </ToggleButtonGroup>
        <Box sx={{ display: 'flex', justifyContent: 'right' }}>
          <Button
            startIcon={<Iconify icon='bi:filter' />}
            endIcon={<Chip label={Object.keys(paramsToObject(searchParams)).length - 1} size='small' color='info' />}
            color='info'
            variant="outlined"
            onClick={() => { setIsFilterOpen(true) }}
            sx={{ mb: 2, mr: 2 }}
          >
            Lọc
          </Button>
        </Box>
        <QuestionList questions={questions} handleOpen={handleOpen} />
        <Modal
          open={question ? true : false}
          onClose={handleClose}
        >
          <Container maxWidth={themeStretch ? false : 'lg'} sx={{ my: 2 }}>
            <Scrollbar sx={{ maxHeight: "100vh" }}>
              <Card>
                <CardContent>
                  <QuestionPreview question={question} showAnswer showToolbar />
                  <Button fullWidth onClick={handleClose} sx={{ mt: 1 }}>Đóng</Button>
                </CardContent>
              </Card>
            </Scrollbar>
          </Container>
        </Modal>
        <Box sx={{ display: 'flex', justifyContent: 'right' }}>
          <Pagination sx={{ my: 2 }} count={total} page={Number(searchParams.get("page"))} onChange={handlePageChange} />
        </Box>
      </Container>
      <QuestionFilterDrawer isOpen={isFilterOpen} onClose={handleFilterClose} setNewParams={setNewParams} />
    </Page>
  );
}
