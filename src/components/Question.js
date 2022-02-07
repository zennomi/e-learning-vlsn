import { memo } from 'react';
import { styled } from '@mui/system';
import { Box, Fab } from "@mui/material";
import Latex from 'react-latex-next';
import LatexStyle, { delimiters } from './LatexStyle';

export default memo(function ({ question, handleChoiceClick = () => { } }) {
    return (
        <LatexStyle>
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