import { useState, useCallback, useEffect } from 'react';
// @mui
import { Container } from '@mui/material';
// redux
import { useSelector } from '../../../redux/store';
// hooks
import useSettings from '../../../hooks/useSettings';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Page from '../../../components/Page';
// utils
import axios from '../../../utils/axios';
// sections
import TestNewFrom from '../../../sections/test/TestNewForm';
// ---------------------------------------------------------------------

export default function NewTest() {
    const { themeStretch } = useSettings();
    const isMountedRef = useIsMountedRef();
    const [test, setTest] = useState({ questions: [] });

    const { questions } = useSelector((state) => state.createTest);

    const getTest = useCallback(async () => {
        if (questions.length === 0) return;
        try {
            const { data } = await axios.get(`/v1/questions?ids=${questions.join(",")}&limit=100`);
            if (isMountedRef.current) {
                data.results = data.results.map(q => ({...q, index: questions.findIndex(i => i === q.id)}))
                setTest({ questions: data.results.sort((a,b) => a.index - b.index) });
            }
        } catch (err) {
            //
        }
    }, [isMountedRef, questions]);

    useEffect(() => {
        getTest();
    }, [getTest]);

    return (
        <Page title="Tạo đề thi mới">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <TestNewFrom currentTest={test} />
            </Container>
        </Page>
    );
}