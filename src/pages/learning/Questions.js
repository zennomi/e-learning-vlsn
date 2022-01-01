import { useState } from 'react';
// @mui
import { Container, Modal, Box, Card, CardContent } from '@mui/material';
// routes
import { PATH_LEARNING } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Question from '../../components/Question';
// provider
import { MathJaxContext } from "better-react-mathjax";

// sections
import QuestionList from '../../sections/question/QuestionList';
// mock
import {questions as mockQuestions} from '../../_mock/question';
// ----------------------------------------------------------------------

export default function Questions() {
  const { themeStretch } = useSettings();
  const [question, setQuestion] = useState(null);

  const handleOpen = (question) => {
    setQuestion(question);
  }
  const handleClose = () => {
    setQuestion(null);
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
        <MathJaxContext>
          <QuestionList questions={mockQuestions} handleOpen={handleOpen} />
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
        </MathJaxContext>
      </Container>
    </Page>
  );
}
