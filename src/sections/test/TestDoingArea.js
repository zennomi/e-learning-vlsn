import { useState, useEffect, useCallback } from 'react';
import Latex from 'react-latex-next';
import { AnimatePresence, m } from 'framer-motion';
import Countdown from 'react-countdown';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Button, Backdrop, Divider, Typography, Stack, Grid, Card, CardHeader, CardContent } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
// components
import Label from '../../components/Label';
import LatexStyle, { delimiters } from '../../components/LatexStyle';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import { IconButtonAnimate, varFade } from '../../components/animate';
import ToggleButton from '../../components/settings/ToggleButton';
// sections
import TestProgress from './TestProgress';

// hooks
import useSettings from '../../hooks/useSettings';
import useIsMountedRef from '../../hooks/useIsMountedRef';
// utils
import cssStyles from '../../utils/cssStyles';
import axios from '../../utils/axios';
// config
import { NAVBAR } from '../../config';
import ResultChart from './ResultChart';
import { PATH_LEARNING } from '../../routes/paths';

const RootStyle = styled(m.div)(({ theme }) => ({
  ...cssStyles(theme).bgBlur({ color: theme.palette.background.paper, opacity: 0.92 }),
  top: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  position: 'fixed',
  overflow: 'hidden',
  width: NAVBAR.BASE_WIDTH + 80,
  flexDirection: 'column',
  margin: theme.spacing(2),
  paddingBottom: theme.spacing(3),
  zIndex: theme.zIndex.drawer + 3,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  boxShadow: `-24px 12px 32px -4px ${alpha(
    theme.palette.mode === 'light' ? theme.palette.grey[500] : theme.palette.common.black,
    0.16
  )}`,
}));

export default function TestDoingArea({ test, answerSheet, enqueueSnackbar }) {
  const isMountedRef = useIsMountedRef();
  const { themeDirection } = useSettings();

  const { time } = test;
  const totalTime = time * 60 * 1000; // in ms
  // const totalTime = 0.5 * 60 * 1000; // in ms

  const { createdAt, id: answerSheetId } = answerSheet;
  const startedTime = new Date(createdAt).valueOf();

  const [userChoices, setUserChoices] = useState({});
  const [blurCount, setBlurCount] = useState(0);
  const [open, setOpen] = useState(false);

  const [key, setKey] = useState([]);
  const [finishedAt, setFinishedAt] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const showKeyMode = test.showKeyMode;

  const submitAnswerSheet = useCallback(
    async (isFinished) => {
      const sheetBody = { isFinished };
      sheetBody.choices = Object.values(userChoices);
      sheetBody.blurCount = blurCount;
      try {
        const {
          data: { answerSheet: savedSheet, testKey: testKey },
        } = await axios({
          url: `/v1/answersheets/${answerSheetId}`,
          method: 'patch',
          data: sheetBody,
        });
        if (isFinished) {
          setKey(testKey);
          setFinishedAt(Date.parse(savedSheet.finishedAt));
        }
      } catch (error) {
        enqueueSnackbar(error, { variant: 'error' });
      }
    },
    [JSON.stringify(userChoices), blurCount]
  );

  const topics = {};

  test.questions.forEach((q) => {
    q.tags.forEach((tag) => {
      if (!topics[tag]) topics[tag] = { count: 0, total: 0 };
      if (key.includes(userChoices[q.id]?.choiceId)) topics[tag].count += q.level;
      topics[tag].total += q.level;
    });
  });

  console.log(userChoices, key)

  const onWindowBlur = useCallback(() => {
    enqueueSnackbar(`Bạn đã rời khỏi khu vực làm bài ${blurCount + 1} lần!`, { variant: 'warning' });
    setBlurCount(blurCount + 1);
  }, [blurCount]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [open]);

  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      const distance = Math.floor((Date.now() - startedTime) / 1000);
      if (distance % (5 * 60) === 0) submitAnswerSheet(false);
    }, 1000);
    return () => clearInterval(interval);
  }, [submitAnswerSheet, isSubmitted]);

  useEffect(() => {
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  useEffect(() => {
    if (isMountedRef.current) {
      window.history.pushState(null, document.title, window.location.href);
      window.addEventListener('popstate', onPopState);
    }
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (isSubmitted) return;
    window.addEventListener('blur', onWindowBlur);
    return () => window.removeEventListener('blur', onWindowBlur);
  }, [onWindowBlur, isSubmitted]);

  const varSidebar =
    themeDirection !== 'rtl'
      ? varFade({
        distance: NAVBAR.BASE_WIDTH,
        durationIn: 0.32,
        durationOut: 0.32,
      }).inRight
      : varFade({
        distance: NAVBAR.BASE_WIDTH,
        durationIn: 0.32,
        durationOut: 0.32,
      }).inLeft;

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChoiceClick = (questionId, choiceId) => {
    if (isSubmitted) return;
    setUserChoices((prevChoices) => {
      if (prevChoices[questionId]?.choiceId === choiceId) return prevChoices;
      prevChoices[questionId] = {
        choiceId: choiceId,
        moment: new Date(),
      };
      return { ...prevChoices };
    });
  };

  const handleSubmit = async () => {
    enqueueSnackbar('Đang nộp bài...', { variant: 'info' });
    window.scrollTo(0, 0);
    await submitAnswerSheet(true);
    enqueueSnackbar('Nộp bài thành công!');
    // await getTestKey();
    setIsSubmitted(true);
  };

  return (
    <>
      {!isSubmitted && <TestProgress date={startedTime + totalTime} total={totalTime} />}
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
      {isSubmitted && (
        <Card sx={{ mb: 2 }}>
          <CardHeader title="Kết quả làm bài" />
          <CardContent>
            <Typography>
              Điểm số:{' '}
              <Typography component="span" variant="h3" color="primary.main">
                {Math.round(
                  (Object.values(userChoices).filter((c) => key.includes(c.choiceId)).length / test.questions.length) *
                  1000
                ) / 100}
              </Typography>
            </Typography>
            <Typography>
              Thời gian làm bài:{' '}
              <Typography component="span">{`${formatLeftTime(finishedAt - startedTime)}`}</Typography>
            </Typography>
            <ResultChart topics={topics} />
            <Typography variant="subtitle1" color="primary.main">
              Đánh giá năng lực theo chương (trên thang 10)
            </Typography>
            <Button fullWidth variant="outlined" component={RouterLink} to={`${PATH_LEARNING.test.root}/${test.id}/chi-tiet`}>
              Xem lịch sử làm bài
            </Button>
          </CardContent>
        </Card>
      )}
      <LatexStyle>
        {
          isSubmitted &&
          <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap' }}>
            <Button variant='contained' size="small" color="success">Đáp án đúng</Button>
            <Button variant='contained' size="small" color="error">Đáp án sai</Button>
            <Label color="success">Câu được điểm</Label>
            <Label color="error">Câu mất điểm</Label>
          </Box>
        }
        {test.questions.map((question, i) => (
          <Box key={question._id} id={`q-${question._id}`}>
            <Label
              color={
                isSubmitted
                  ? showKeyMode === 2
                    ? key.includes(userChoices[question._id]?.choiceId)
                      ? 'success'
                      : 'error'
                    : showKeyMode === 1 && !key.includes(userChoices[question._id]?.choiceId)
                      ? 'error'
                      : 'primary'
                  : 'primary'
              }
            >
              Câu {i + 1}
            </Label>
            <Box sx={{ my: 1 }}>
              <Latex delimiters={delimiters}>{question.question}</Latex>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              {question.choices.map((c, j) => (
                <Box sx={{ display: 'flex', alignContent: 'center', alignItems: 'center', mb: 1 }} key={c.id}>
                  {isSubmitted ? (
                    showKeyMode === 0 ? (
                      <Button
                        size="small"
                        sx={{ mx: 1 }}
                        variant={userChoices[question._id]?.choiceId === c.id ? 'contained' : 'outlined'}
                      >
                        {String.fromCharCode(65 + j)}
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        sx={{ mx: 1 }}
                        variant={
                          userChoices[question._id]?.choiceId === c.id || (showKeyMode === 2 && key.includes(c.id))
                            ? 'contained'
                            : 'outlined'
                        }
                        color={
                          key.includes(c.id)
                            ? userChoices[question._id]?.choiceId === c.id
                              ? 'success'
                              : 'success'
                            : userChoices[question._id]?.choiceId === c.id
                              ? 'error'
                              : 'primary'
                        }
                      >
                        {String.fromCharCode(65 + j)}
                      </Button>
                    )
                  ) : (
                    <Button
                      size="small"
                      sx={{ mx: 1 }}
                      variant={userChoices[question._id]?.choiceId === c.id ? 'contained' : 'outlined'}
                      onClick={() => handleChoiceClick(question._id, c.id)}
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
              isSubmitted && question?.answer?.length > 0 &&
              <Card sx={{ p: 1, borderRadius: 1 }}>
                <Label color="success">Lời giải</Label>
                <Box sx={{ my: 1 }}>
                  <Latex delimiters={delimiters}>{question.answer}</Latex>
                </Box>
              </Card>
            }
          </Box>
        ))}
      </LatexStyle>
      {!isSubmitted && (
        <LoadingButton
          sx={{ my: 2 }}
          fullWidth
          size="large"
          onClick={() => {
            handleSubmit();
          }}
          variant="contained"
        >
          Nộp bài
        </LoadingButton>
      )}
      <Backdrop
        open={open}
        onClick={handleClose}
        sx={{ background: 'transparent', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      />

      {!open && (
        <ToggleButton
          open={open}
          notDefault={false}
          onToggle={handleToggle}
          sx={{ top: '30%' }}
          icon="eva:options-2-fill"
        />
      )}

      <AnimatePresence>
        {open && (
          <>
            <RootStyle {...varSidebar}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2, pr: 1, pl: 2.5 }}>
                <Typography variant="subtitle1">Menu</Typography>
                <div>
                  <IconButtonAnimate onClick={handleClose}>
                    <Iconify icon={'eva:close-fill'} width={20} height={20} />
                  </IconButtonAnimate>
                </div>
              </Stack>

              <Divider sx={{ borderStyle: 'dashed' }} />

              <Scrollbar sx={{ flexGrow: 1 }}>
                <Stack spacing={3} sx={{ p: 3 }}>
                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2">Thời gian còn lại</Typography>
                    <Typography>
                      {isSubmitted ? (
                        `${formatLeftTime(totalTime - (finishedAt - startedTime))}`
                      ) : (
                        <Countdown date={startedTime + totalTime} renderer={renderer} onComplete={handleSubmit} />
                      )}
                    </Typography>
                  </Stack>
                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2">Lối tắt</Typography>
                    <Box
                      sx={{ display: 'flex', alignContent: 'center', alignItems: 'center', flexWrap: 'wrap', mb: 1 }}
                    >
                      {test.questions.map((q, i) => (
                        <Button
                          key={q._id}
                          variant={userChoices[q._id] ? 'contained' : 'outlined'}
                          sx={{ m: 0.5 }}
                          component="a"
                          href={`#q-${q._id}`}
                          color={
                            !isSubmitted || !test.isPublic
                              ? 'primary'
                              : key.includes(userChoices[q._id]?.choiceId)
                                ? 'success'
                                : 'error'
                          }
                        >
                          {i + 1}
                        </Button>
                      ))}
                    </Box>
                  </Stack>
                </Stack>
              </Scrollbar>
            </RootStyle>
          </>
        )}
      </AnimatePresence>
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

const renderer = ({ hours, minutes, seconds, completed }) => {
  const pad = (n) => (n < 10 ? `0${n}` : n);
  if (completed) {
    // Render a completed state
    return <span>00:00:00</span>;
  } else {
    // Render a countdown
    return <span>{`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`}</span>;
  }
};

// Alert when close window
function onBeforeUnload(e) {
  if (1) {
    e.preventDefault();
    e.returnValue = '';
    return;
  }
  delete e['returnValue'];
}

// Alert when close window
function onPopState(e) {
  window.history.pushState(null, document.title, window.location.href);
}
