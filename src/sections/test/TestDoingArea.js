import { Box } from "@mui/material";
import Question from "../../components/Question";
import Label from "../../components/Label";

export default function TestDoingArea({ test, handleChoiceClick }) {
    return (
        <>
            {
                test.questions.map((q, i) =>
                    <Box key={q.id}>
                        <Label color="primary">Câu {i + 1}</Label>
                        <Question question={q} handleChoiceClick={handleChoiceClick}/>
                    </Box>
                )
            }
        </>
    )
}