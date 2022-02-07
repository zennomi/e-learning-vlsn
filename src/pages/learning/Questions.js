import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// @mui
import { Container, Modal, Box, Card, CardContent, Pagination } from '@mui/material';
// routes
import { PATH_LEARNING } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import useIsMountedRef from '../../hooks/useIsMountedRef';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Question from '../../components/Question';
// utils
import axios from '../../utils/axios';
import paramsToObject from '../../utils/urlParamsHelper';
// sections
import QuestionList from '../../sections/question/QuestionList';

// ----------------------------------------------------------------------

export default function Questions() {
  const { themeStretch } = useSettings();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();

  const [question, setQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [total, setTotal] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams({ page: 1 });


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

  const handlePageChange = (event, page) => {
    setNewParams({ page });
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
        <QuestionList questions={questions} handleOpen={handleOpen} />
        <Modal
          open={question ? true : false}
          onClose={handleClose}
        >
          <Container maxWidth={themeStretch ? false : 'lg'} sx={{ mt: 2 }}>
            <Card>
              <CardContent>
                <Question question={question} />
              </CardContent>
            </Card>
          </Container>
        </Modal>
        <Box sx={{ display: 'flex', justifyContent: 'right' }}>
          <Pagination sx={{ my: 2 }} count={total} page={Number(searchParams.get("page"))} onChange={handlePageChange} />
        </Box>
      </Container>
    </Page>
  );
}
