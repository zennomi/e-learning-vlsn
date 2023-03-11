// @mui
import { Container, Button, Card, CardContent, CardHeader, Stack } from '@mui/material';
import QuestionPreview from '../../sections/question/QuestionPreview';
// components
import Page from '../../components/Page';
import Editor from '../../components/editor';
import { useState } from 'react';
// ----------------------------------------------------------------------

export default function ImportTest() {
    const [value, setValue] = useState("")
    const [questions, setQuestions] = useState([])
    const handleClick = () => {
        let quesStrArr = value
            .replace(/&nbsp;/g, ' ')
            .replace(/<p><\/p>/g, '')
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
    return (
        <Page title="Thêm Đề">
            <Container>
                <Editor
                    id="editor"
                    value={value}
                    onChange={(content) => setValue(content)}
                />
                <Button onClick={handleClick}>Render</Button>
                <Stack spacing={2}>
                    {
                        questions.map((question, index) =>
                            <div>

                                <Card>
                                    <CardHeader title={`Câu ${index + 1}:`} />
                                    <CardContent>
                                        <QuestionPreview question={question} showAnswer={true} />
                                    </CardContent>
                                </Card>
                            </div>
                        )
                    }
                </Stack>
            </Container>
        </Page>
    );
}

function isChoice(str) {
    return /^<p>[ABCD]\./gi.test(str) || /^<p><strong><u>[ABCD]\./gi.test(str) || /^<p><u><strong>[ABCD]\./gi.test(str) || /^<p><u>[ABCD]\./gi.test(str);
}
