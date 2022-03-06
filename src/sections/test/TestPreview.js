import { useState, } from 'react';
import { useTheme } from '@mui/material/styles';
import Latex from 'react-latex-next';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Box, Button, Typography, Grid, Card, CardHeader, CardContent } from "@mui/material";

// components
import Label from "../../components/Label";
import LatexStyle, { delimiters } from '../../components/LatexStyle';
import QuestionToolbar from '../../components/QuestionToolbar';

export default function TestPreview({ test, answerSheet, testKey, showToolbar }) {
    const theme = useTheme();

    const { time, id: testId } = test;
    const totalTime = time * 60 * 1000; // in ms
    // const { createdAt, id: answerSheetId } = answerSheet;

    const [showKey, setShowKey] = useState(true);

    const key = showKey ? testKey : [];
    const userChoices = {};

    const topics = {};

    if (answerSheet) {
        const userChoiceIds = answerSheet.choices.map(c => c.choiceId);
        test.questions.forEach(q => {
            const x = q.choices.map(c => c.id).find(id => userChoiceIds.includes(id));
            if (x) userChoices[q._id] = x;
        })
    }

    test.questions.forEach(q => {
        q.tags.forEach(tag => {
            if (!topics[tag]) topics[tag] = { count: 0, total: 0 };
            if (key.includes(userChoices[q.id])) topics[tag].count += q.level;
            topics[tag].total += q.level
        })
    })

    const radarChartSeries = [{
        name: 'Đánh giá',
        data: Object.values(topics).map(t => Math.ceil(t.count / t.total * 10)),
    }];

    const radarChartOptions = {
        colors: [theme.palette.primary.main],
        chart: {
            height: 350,
            type: 'radar',
            toolbar: {
                show: false
            }
        },
        xaxis: {
            categories: Object.keys(topics)
        }
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
                            <Typography component="span">
                                {`${formatLeftTime(Date.parse(answerSheet.finishedAt || answerSheet.updatedAt) - Date.parse(answerSheet.createdAt))}`}
                            </Typography>
                        </Typography>
                        <Typography>Thiết bị làm bài:
                            {" "}
                            <Typography component="span">
                                {answerSheet.userAgent}
                            </Typography>
                        </Typography>
                        <Typography>Địa chỉ IP:
                            {" "}
                            <Typography component="span">
                                {answerSheet.userIp}
                            </Typography>
                        </Typography>
                        <ReactApexChart options={radarChartOptions} series={radarChartSeries} type="radar" height={350} />
                    </CardContent>
                </Card>
            }

            <LatexStyle>
                {
                    test.questions.map((question, i) =>
                        <Box key={question._id} id={`q-${question._id}`}>
                            <QuestionToolbar question={question} />
                            <Label color={key.includes(userChoices[question._id]) ? "success" : "error"}>Câu {i + 1}</Label>
                            <Box className="not-break-inside" sx={{ my: 1 }}>
                                <Latex delimiters={delimiters}>{question.question}</Latex>
                            </Box>
                            <Box className="not-break-inside" sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                                {
                                    question.choices.map((c, j) =>
                                        <Box sx={{ display: 'flex', alignContent: 'center', alignItems: 'center', flexGrow: 1, mb: 1 }} key={c.id}>
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

const formatLeftTime = (leftTime) => {
    const pad = (n) => n < 10 ? `0${n}` : n;
    if (leftTime <= 0) return "00:00:00";
    leftTime = leftTime / 1000;
    const h = Math.floor(leftTime / 3600);
    const m = Math.floor(leftTime / 60) - (h * 60);
    const s = Math.floor(leftTime - h * 3600 - m * 60);
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
};