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
import CourseNewFrom from '../../../sections/course/CourseNewForm';
// ---------------------------------------------------------------------

export default function EditCourse() {
    const { themeStretch } = useSettings();
    const isMountedRef = useIsMountedRef();
    const [course, setCourse] = useState();
    const { id } = useParams();

    const getCourse = useCallback(async () => {
        try {
            const { data } = await axios.get(`/v1/courses/${id}?cache=false`);
            if (isMountedRef.current) {
                const videos = data.videos.map(v => ({ type: "video", idType: v.id, index: v.index }));
                const tests = data.tests.map(v => ({ type: "test", idType: v.id, index: v.index }));
                data.components = [...videos, ...tests].sort((a, b) => a.index - b.index);
                delete data.videos;
                delete data.tests;
                console.log(data);
                setCourse(data);
            }
        } catch (err) {
            //
        }
    }, [isMountedRef]);

    useEffect(() => {
        getCourse();
    }, [getCourse]);

    return (
        <Page title="Sửa khoá học">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <CourseNewFrom currentCourse={course} isEdit />
            </Container>
        </Page>
    );
}