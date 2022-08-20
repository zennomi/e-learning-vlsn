import { memo } from 'react';
import { Box, Fab, Stack } from "@mui/material";
import Latex from 'react-latex-next';
import LatexStyle, { delimiters } from './LatexStyle';
import Label from './Label';

export default memo(function ({ question, handleChoiceClick = () => { } }) {
    const gradeColor = (grade) => {
        if(grade === 10) return "primary";
        if(grade === 12) return "info";
        if(grade === 11) return "warning";
    }
    return (
        <LatexStyle>
            <Box>
                <Stack spacing={1} direction="row">
                    {question.grade && <Label color={gradeColor(question.grade)}>Lớp {question.grade}</Label>}
                    {question.level && <Label color="warning">Độ khó: {question.level}</Label>}
                    {question.tags.map((tag) => <Label color="error" >{tag}</Label> )}
                </Stack>
            </Box>
            <Box sx={{ my: 1 }}>
                <Latex delimiters={delimiters}>{question.question}</Latex>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {
                    question.choices.map((c, i) =>
                        <Box sx={{ display: 'flex', alignContent: 'center', alignItems: 'center', mb: 1 }}>
                            <Fab size="small" sx={{ mx: 1 }} onClick={() => { handleChoiceClick(question.id, i) }}>{String.fromCharCode(65 + i)}</Fab>
                            <Box>
                                <Latex delimiters={delimiters}>{c.content}</Latex>
                            </Box>
                        </Box>
                    )
                }
            </Box>
        </LatexStyle>
    )
})