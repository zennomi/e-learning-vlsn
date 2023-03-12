// @mui
import { Container, Button, Card, CardContent, CardHeader, Stack, Checkbox, FormControlLabel, Typography } from '@mui/material';
import QuestionPreview from '../../sections/question/QuestionPreview';
// redux
import { useDispatch } from '../../redux/store';
import { addQuestions } from '../../redux/slices/createTest';
// components
import Page from '../../components/Page';
import Editor from '../../components/editor';
import { useState } from 'react';
import axiosInstance from '../../utils/axios';
import { useSnackbar } from 'notistack';
// ----------------------------------------------------------------------

export default function ImportTest() {
    const [value, setValue] = useState("")
    const [questions, setQuestions] = useState([])
    const [shouldAddQuestions, setShouldAdd] = useState(true)
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar()

    const handlePreviewClick = () => {
        let quesStrArr = value
            .replace(/&nbsp;/g, ' ')
            .replace(/<p>\s*<\/p>/g, '')
            .replace(/\s{3,}/g, '   ')
            .replace(/\s{3,}/g, '   ')
            .replace(/(<[^\/<>]+>)(\s+)/g, '$2$1')
            .split(/<p>\s*\[&lt;br&gt;\]\s*<\/p>/);
        let level;
        let matchedQuestions = quesStrArr.map((q, i) => {
            let parArr = Array.from(q.matchAll(/<p>.+?<\/p>/g), m => m[0]);
            console.log(parArr)
            let quesContent = [];
            let choiceList = [];
            let ansContent = []
            let isAnswerTurn = false

            let levelRegex = /<p>\s*\[&lt;level:(\d{1,})&gt;\]\s*<\/p>/g;
            parArr.forEach((p, j) => {
                p = p.replace("<p></p>", "")
                if (isAnswerTurn) {
                    ansContent.push(p)
                } else if (isChoice(p)) {
                    choiceList.push(p);
                } else if (levelRegex.test(p)) {
                    console.log(levelRegex.exec(p)); // dont delete this line
                    level = Number([...levelRegex.exec(p)][1]);
                }
                else if (p === "<p>[&lt;loigiai&gt;]</p>") {
                    isAnswerTurn = true;
                } else {
                    quesContent.push(p);
                }
            })

            return {
                question: quesContent.join('\n'),
                choices: choiceList.map(c => {
                    let isTrue = false;
                    c = c.replace(/[ABCD]/i, '').replace(/\./, '');
                    if (/<u>\s*<\/u>/g.test(c)) {
                        isTrue = true;
                    }
                    while (/<\w+>\s*<\/\w+>/g.test(c)) c = c.replace(/<\w+>\s*<\/\w+>/g, '');
                    return {
                        content: c,
                        isTrue: isTrue
                    }
                }),
                answer: ansContent.join('\n'),
                level: level || undefined,
                tags: []
            }
        })
        setQuestions(matchedQuestions)
    }

    const handleSaveClick = async () => {
        try {
            const { data } = await axiosInstance({
                method: 'POST',
                url: '/v1/questions/bulk',
                data: questions
            })
            console.log(data)
            if (shouldAddQuestions)
                dispatch(addQuestions(data.map(q => q.id)))
            setValue("")
            setQuestions([])
        } catch (error) {
            enqueueSnackbar(error, { variant: "error" })
        }
    }

    return (
        <Page title="Thêm Đề">
            <Container>
                <Editor
                    id="editor"
                    value={value}
                    onChange={(content) => setValue(content)}
                    sx={{ maxHeight: 250, overflow: 'auto' }}
                />
                <Button onClick={handlePreviewClick}>Xem trước</Button>
                <Typography>Có tổng cộng {questions.length} câu</Typography>
                <Typography>Có {questions.filter(q => q.choices.length !== 4 || q.choices.filter(c => c.isTrue).length !== 1).length} câu đang lỗi</Typography>
                <Stack spacing={2}>
                    {
                        questions.map((question, index) =>
                            <div key={index}>
                                <Card>
                                    <CardHeader title={`Câu ${index + 1}:`} sx={question.choices.length === 4 && question.choices.filter(c => c.isTrue).length === 1 && { color: 'success.main' }} />
                                    <CardContent>
                                        <QuestionPreview question={question} showAnswer={true} />
                                    </CardContent>
                                </Card>
                            </div>
                        )
                    }
                </Stack>
                <FormControlLabel control={<Checkbox
                    checked={shouldAddQuestions}
                    onChange={(event) => {
                        setShouldAdd(event.target.checked);
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                />} label="Tiện thêm vào giỏ câu hỏi luôn" />

                <Button onClick={handleSaveClick}>Trông ổn rồi đấy, lưu</Button>
            </Container>
        </Page>
    );
}

function isChoice(str) {
    return /^<p>[ABCD]\./gi.test(str) || /^<p><strong><u>[ABCD]\./gi.test(str) || /^<p><u><strong>[ABCD]\./gi.test(str) || /^<p><u>[ABCD]\./gi.test(str);
}
