import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// hooks
import useSettings from '../../../hooks/useSettings';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Page from '../../../components/Page';
// utils
import axios from '../../../utils/axios';
// sections
import QuestionNewFrom from '../../../sections/question/QuestionNewForm';
// ---------------------------------------------------------------------

export default function EditQuestion() {
    const { themeStretch } = useSettings();
    const isMountedRef = useIsMountedRef();
    const [question, setQuestion] = useState();
    const { id } = useParams();

    const getQuestion = useCallback(async () => {
        try {
            const { data } = await axios.get(`/v1/questions/${id}?cache=false`);
            if (isMountedRef.current) {
                setQuestion(data);
            }
        } catch (err) {
            //
        }
    }, [isMountedRef]);

    useEffect(() => {
        getQuestion();
    }, [getQuestion]);

    return (
        <Page question="Sửa câu hỏi">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <QuestionNewFrom currentQuestion={question} isEdit/>
            </Container>
        </Page>
    );
}