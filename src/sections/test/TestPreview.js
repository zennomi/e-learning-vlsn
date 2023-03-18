import Latex from 'react-latex-next';
// @mui
import { Box, Button, Typography, Grid, Card, CardHeader, CardContent, Divider } from '@mui/material';

// components
import Label from '../../components/Label';
import LatexStyle, { delimiters } from '../../components/LatexStyle';
import QuestionToolbar from '../../components/QuestionToolbar';
import ResultChart from './ResultChart';

export default function TestPreview({ test, answerSheet, testKey, showToolbar, showKeyMode }) {
  const key = testKey;
  const userChoices = {};

  const topics = {};

  if (answerSheet) {
    const userChoiceIds = answerSheet.choices.map((c) => c.choiceId);
    test.questions.forEach((q) => {
      const x = q.choices.map((c) => c.id).find((id) => userChoiceIds.includes(id));
      if (x) userChoices[q._id] = x;
    });
  }

  test.questions.forEach((q) => {
    q.tags.forEach((tag) => {
      if (!topics[tag]) topics[tag] = { count: 0, total: 0 };
      if (key.includes(userChoices[q.id])) topics[tag].count += q.level;
      topics[tag].total += q.level;
    });
  });

  return (
    <>
      <Typography color="primary.main" variant="h3" align="center">
        {test.name}
      </Typography>
      <Grid container sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <Typography align="center" variant="body2">
            {`Đề thi gồm ${test.questions.length} câu.`}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography align="center" variant="body2">
            {`Thời gian ${test.time} phút.`}
          </Typography>
        </Grid>
      </Grid>

      {answerSheet && (
        <Card sx={{ mb: 2 }}>
          <CardHeader title="Kết quả làm bài" />
          <CardContent>
            <Typography>
              Điểm số:{' '}
              <Typography component="span" variant="h3" color="primary.main">
                {Math.round(
                  (Object.values(userChoices).filter((c) => key.includes(c)).length / test.questions.length) * 1000
                ) / 100}
              </Typography>
            </Typography>
            <Typography>
              Thời gian làm bài:{' '}
              <Typography component="span">
                {`${formatLeftTime(
                  Date.parse(answerSheet.finishedAt || answerSheet.updatedAt) - Date.parse(answerSheet.createdAt)
                )}`}
              </Typography>
            </Typography>
            <Typography>
              Thiết bị làm bài: <Typography component="span">{answerSheet.userAgent}</Typography>
            </Typography>
            <Typography>
              Địa chỉ IP: <Typography component="span">{answerSheet.userIp}</Typography>
            </Typography>
            <ResultChart topics={topics} />
            <Typography variant="subtitle1" color="primary.main">
              Đánh giá năng lực theo chương (trên thang 10)
            </Typography>
          </CardContent>
        </Card>
      )}

      <LatexStyle>
        {
          answerSheet &&
          <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap' }}>
            <Button variant='contained' size="small" color="success">Đáp án đúng</Button>
            <Button variant='contained' size="small" color="error">Đáp án sai</Button>
            <Label color="success">Câu được điểm</Label>
            <Label color="error">Câu mất điểm</Label>
          </Box>
        }
        {test.questions.map((question, i) => (
          <Box key={question._id} id={`q-${question._id}`}>
            <Label color={(!answerSheet || key.includes(userChoices[question._id])) ? 'success' : 'error'}>Câu {i + 1}</Label>
            <Box className="not-break-inside" sx={{ my: 1 }}>
              <Latex delimiters={delimiters}>{question.question}</Latex>
            </Box>
            <Box
              className="not-break-inside"
              sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}
            >
              {question.choices.map((c, j) => (
                <Box
                  sx={{ display: 'flex', alignContent: 'center', alignItems: 'center', flexGrow: 1, mb: 1 }}
                  key={c.id}
                >
                  {showKeyMode === 0 ? (
                    <Button
                      size="small"
                      sx={{ mx: 1 }}
                      variant={userChoices[question._id] === c.id ? 'contained' : 'outlined'}
                    >
                      {String.fromCharCode(65 + j)}
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      sx={{ mx: 1 }}
                      variant={
                        userChoices[question._id] === c.id || (showKeyMode === 2 && key.includes(c.id))
                          ? 'contained'
                          : 'outlined'
                      }
                      color={
                        key.includes(c.id)
                          ? userChoices[question._id] === c.id
                            ? 'success'
                            : 'success'
                          : userChoices[question._id] === c.id
                            ? 'error'
                            : 'primary'
                      }
                    >
                      {String.fromCharCode(65 + j)}
                    </Button>
                  )}
                  <Box>
                    <Latex delimiters={delimiters}>{c.content}</Latex>
                  </Box>
                </Box>
              ))}
            </Box>
            {
              showKeyMode === 2 && key && question.answer.length > 0 &&
              <>
                <Typography variant="subtitle1" color="primary.main">Lời giải chi tiết</Typography>
                <Latex delimiters={delimiters}>
                  {question.answer}
                </Latex>
              </>
            }
            {showToolbar && <QuestionToolbar question={question} />}
            <Divider sx={{ my: 2 }} />
          </Box>
        ))}
      </LatexStyle>
    </>
  );
}

const formatLeftTime = (leftTime) => {
  const pad = (n) => (n < 10 ? `0${n}` : n);
  if (leftTime <= 0) return '00:00:00';
  leftTime = leftTime / 1000;
  const h = Math.floor(leftTime / 3600);
  const m = Math.floor(leftTime / 60) - h * 60;
  const s = Math.floor(leftTime - h * 3600 - m * 60);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};
