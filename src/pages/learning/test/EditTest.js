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
import TestNewFrom from '../../../sections/test/TestNewForm';
// ---------------------------------------------------------------------

export default function EditTest() {
    const { themeStretch } = useSettings();
    const isMountedRef = useIsMountedRef();
    const [test, setTest] = useState();
    const { id } = useParams();

    const getTest = useCallback(async () => {
        try {
            const { data } = await axios.get(`/v1/tests/${id}?populate=questions&cache=false`);
            if (isMountedRef.current) {
                setTest(data);
            }
        } catch (err) {
            //
        }
    }, [isMountedRef]);

    useEffect(() => {
        getTest();
    }, [getTest]);

    return (
        <Page title="Sửa đề thi">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <TestNewFrom currentTest={test} isEdit/>
            </Container>
        </Page>
    );
}