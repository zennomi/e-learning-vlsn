import { styled } from '@mui/system';
import { Box, Fab } from "@mui/material"
import { MathJax } from "better-react-mathjax";

const RootStyle = styled('div')({
    fontFamily: "Times New Roman",
    fontSize: "1.2rem"
})

export default function Question({ question, handleChoiceClick = () => { } }) {
    return (
        <RootStyle>
            <MathJax hideUntilTypeset='first'>
                <div dangerouslySetInnerHTML={{ __html: question.question }}></div>
            </MathJax>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {
                    question.choices.map((c, i) =>
                        <Box sx={{ display: 'flex', alignContent: 'center', alignItems: 'center', mb: 1 }}>
                            <Fab size="small" sx={{ mx: 1 }} onClick={() => { handleChoiceClick(question.id, i) }}>{String.fromCharCode(65 + i)}</Fab>
                            <MathJax hideUntilTypeset='first'>
                                <Box dangerouslySetInnerHTML={{ __html: c.content }}></Box>
                            </MathJax>
                        </Box>
                    )
                }
            </Box>
        </RootStyle>
    )
}