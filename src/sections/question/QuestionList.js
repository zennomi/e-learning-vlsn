import { Card, CardContent, CardActionArea } from "@mui/material";

import Question from "../../components/Question";

export default function QuestionList({ questions, handleOpen }) {
    return (
        <>
            {questions.map(q =>
                <Card sx={{mb: 2}}>
                    <CardActionArea onClick={() => { handleOpen(q) }} >
                        <CardContent>
                            <Question question={q} />
                        </CardContent>
                    </CardActionArea>
                </Card>
            )}
        </>
    )
}