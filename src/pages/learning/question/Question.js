import { Link as RouterLink, useParams } from 'react-router-dom';
// @mui
import { Container, Typography, Card, CardContent, Box, Button, Stack } from '@mui/material';
import { Icon } from '@iconify/react';
// hooks
import useSettings from '../../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import useAuth from '../../../hooks/useAuth';
// components
import Page from '../../../components/Page';
import Question from '../../../components/Question';
import { useCallback, useEffect, useState } from 'react';
import Latex from 'react-latex-next';
import LatexStyle, { delimiters } from '../../../components/LatexStyle';
// utils
import axios from '../../../utils/axios';
import { PATH_LEARNING } from '../../../routes/paths';
// ----------------------------------------------------------------------

export default function PageFive() {
  const { themeStretch } = useSettings();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const { id } = useParams();

  const [question, setQuestion] = useState(null);

  const getQuestion = useCallback(async () => {
    try {
      const { data } = await axios.get(`/v1/questions/${id}`);
      if (isMountedRef.current) {
        setQuestion(data);
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err, { variant: 'error' });
    }
  }, [isMountedRef])

  useEffect(() => {
    getQuestion();
    return () => { setQuestion(null); }
  }, [getQuestion]);

  return (
    <Page title="Câu hỏi">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        {
          question &&
          <LatexStyle>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Question question={question} />
              </CardContent>
            </Card>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Box color='primary' sx={{ my: 1 }} mt={3}>
                  <Typography variant="body1" component="body1" color="primary" sx={{ fontWeight: "bold" }}>Đáp án đúng: </Typography>{String.fromCharCode(65 + question.choices.findIndex(c => c.isTrue))}
                  <br />
                  <Typography variant="body1" component="body1" color="primary" sx={{ fontWeight: "bold" }}>Lời giải chi tiết:</Typography>
                  <br />
                  <Latex delimiters={delimiters}>
                    {question.answer}
                  </Latex>
                </Box>
              </CardContent>
            </Card>
          </LatexStyle>
        }
        {
          user.isStaff &&
          <Stack spacing={2} direction="row">
            <Button variant="contained" color="secondary" startIcon={<Icon icon="clarity:edit-solid" />} component={RouterLink} to={`${PATH_LEARNING.question.root}/${id}/cap-nhat`} >SỬA</Button>
            {/* <Button variant="contained" color="error"  startIcon={<Icon icon="ant-design:delete-filled" ml={3} />} onClick={() => setDelete(true)}>XÓA</Button> */}
          </Stack>
        }
        {/* <Modal
          open={onDelete}
          onClose={() => setDelete(false)}
        >
          <Container maxWidth={themeStretch ? false : 'lg'} sx={{ mt: 2 }}>
            <Card>
              <CardContent>
                <Typography variant='h5'>mun xoa thiet honggg???</Typography>
                  <Button variant="contained" color="error">yesss</Button>
              </CardContent>
            </Card>
          </Container>
        </Modal> */}
      </Container>
    </Page>
  );
}
