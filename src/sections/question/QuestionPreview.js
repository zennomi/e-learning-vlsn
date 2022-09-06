import Latex from 'react-latex-next';
// mui
import {
    Box,
    Fab,
    Typography,
    Stack,
} from "@mui/material";
// components
import LatexStyle, { delimiters } from '../../components/LatexStyle';
import Label from '../../components/Label';
import QuestionToolbar from '../../components/QuestionToolbar';
// redux

const gradeColor = (grade) => {
    if (grade === 10) return "primary";
    if (grade === 12) return "info";
    if (grade === 11) return "warning";
}

export default function ({ question, showAnswer, showToolbar }) {
    return (
        <LatexStyle>
            {
                showToolbar &&
                <QuestionToolbar question={question} sx={{ my: 1 }} />
            }
            <Box>
                <Stack spacing={1} direction="row">
                    {question.grade && <Label color={gradeColor(question.grade)}>Lớp {question.grade}</Label>}
                    {question.level && <Label color="warning">Độ khó: {question.level}</Label>}
                    {question.tags.map((tag) => <Label color="error" >{tag}</Label>)}
                </Stack>
            </Box>
            <Box sx={{ my: 1 }}>
                <Latex delimiters={delimiters}>{question.question}</Latex>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {
                    question.choices.map((c, i) =>
                        <Box sx={{ display: 'flex', alignContent: 'center', alignItems: 'center', mb: 1 }}>
                            <Fab size="small" color={c.isTrue && "primary" || ""} sx={{ mx: 1 }} >{String.fromCharCode(65 + i)}</Fab>
                            <Box>
                                <Latex delimiters={delimiters}>{c.content}</Latex>
                            </Box>
                        </Box>
                    )
                }
            </Box>
            {
                showAnswer &&
                <Box color='primary' sx={{ my: 1 }} mt={3}>
                    <Typography variant="body1" color="primary" sx={{ fontWeight: "bold" }}>Đáp án đúng: </Typography>{String.fromCharCode(65 + question.choices.findIndex(c => c.isTrue))}
                    <Typography variant="body1" color="primary" sx={{ fontWeight: "bold" }}>Lời giải chi tiết:</Typography>
                    <Latex delimiters={delimiters}>
                        {question.answer}
                    </Latex>
                </Box>
            }
        </LatexStyle>
    )
}