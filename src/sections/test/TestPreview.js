import { useState,  } from 'react';
import Latex from 'react-latex-next';
// @mui
import { Box, Button, Typography, Grid, Card, CardHeader, CardContent } from "@mui/material";

// components
import Label from "../../components/Label";
import LatexStyle, { delimiters } from '../../components/LatexStyle';

export default function TestDoingArea({ test, answerSheet, testKey }) {
    const { time, id: testId } = test;
    const totalTime = time * 60 * 1000; // in ms
    // const { createdAt, id: answerSheetId } = answerSheet;

    const [showKey, setShowKey] = useState(true);

    const key = showKey ? testKey : [];
    const userChoices = {};

    if (answerSheet) {
        const userChoiceIds = answerSheet.choices.map(c => c.choiceId);
        test.questions.forEach(q => {
            const x = q.choices.map(c => c.id).find(id => userChoiceIds.includes(id));
            if (x) userChoices[q._id] = x;
        })
    }

    return (
        <>
            <Typography color="primary.main" variant="h3" align="center">{test.name}</Typography>
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

            {
                answerSheet &&
                <Card sx={{ mb: 2 }}>
                    <CardHeader title="Kết quả làm bài" />
                    <CardContent>
                        <Typography>Điểm số:
                            {" "}
                            <Typography component="span" variant='h3' color="primary.main">
                                {Math.round(Object.values(userChoices).filter(c => key.includes(c)).length / test.questions.length * 1000) / 100}
                            </Typography>
                        </Typography>
                        <Typography>Thời gian làm bài:
                            {" "}
                            {/* <Typography component="span">
                                {`${formatLeftTime(totalTime - leftTime)}`}
                            </Typography> */}
                        </Typography>
                    </CardContent>
                </Card>
            }

            <LatexStyle>
                {
                    test.questions.map((question, i) =>
                        <Box key={question._id} id={`q-${question._id}`}>
                            <Label color={key.includes(userChoices[question._id]) ? "success" : "error"}>Câu {i + 1}</Label>
                            <Box sx={{ my: 1 }}>
                                <Latex delimiters={delimiters}>{question.question}</Latex>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                {
                                    question.choices.map((c, j) =>
                                        <Box sx={{ display: 'flex', alignContent: 'center', alignItems: 'center', mb: 1 }} key={c.id}>
                                            <Button
                                                size="small"
                                                sx={{ mx: 1 }}
                                                variant={key.includes(c.id) || userChoices[question._id] === c.id ? "contained" : "outlined"}
                                                color={userChoices[question._id] === c.id ? key.includes(c.id) ? "success" : "error" : "primary"}
                                            >
                                                {String.fromCharCode(65 + j)}
                                            </Button>
                                            <Box>
                                                <Latex delimiters={delimiters}>{c.content}</Latex>
                                            </Box>
                                        </Box>
                                    )
                                }
                            </Box>
                        </Box>
                    )
                }
            </LatexStyle>

        </>
    )
}
