import { memo } from 'react';
import { styled } from '@mui/system';
import {Box, 
        Fab, 
        Typography, 
        Button, 
        Stack
} from "@mui/material";
import Latex from 'react-latex-next';
import LatexStyle, { delimiters } from '../../components/LatexStyle';
import {Link as RouterLink} from 'react-router-dom';
import Label from '../../components/Label';

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
                        {question.main_tags.map((tag) => <Label color="error" >{tag.value}</Label> )}
                        {question.side_tags.map((tag) => <Label color="warning" >{tag.value}</Label> )}
                    </Stack>
                </Box>
                <Box sx={{ my: 1 }}>
                    <Latex delimiters={delimiters}>{question.question}</Latex>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    {
                        question.choices.map((c, i) =>
                            <Box sx={{ display: 'flex', alignContent: 'center', alignItems: 'center', mb: 1 }}>
                                <Fab size="small" color={c.isTrue && "primary" || ""} sx={{ mx: 1 }} onClick={() => { handleChoiceClick(question.id, i) }}>{String.fromCharCode(65 + i)}</Fab>
                                <Box>
                                    <Latex delimiters={delimiters}>{c.content}</Latex>
                                </Box>
                            </Box>
                        )
                    }
                </Box>
                    <Box color='primary' sx={{ my: 1 }} mt={3}>
                        <Typography variant="body1" component="body2" color="primary" sx={{fontWeight:"bold"}}>Đáp án đúng: </Typography>{String.fromCharCode(65 + question.choices.findIndex(c => c.isTrue))}
                        <br/>
                        <Typography variant="body1" component="body2" color="primary" sx={{fontWeight:"bold"}}>Lời giải chi tiết:</Typography>
                        <br/>
                        <Latex delimiters={delimiters}>
                            {question.answer}
                        </Latex>
                    </Box>
                    <Button fullWidth variant="contained" component={RouterLink} to={"/hoc-tap/cau-hoi/"+question._id}>Xem chi tiết</Button>
        </LatexStyle>
    )
})