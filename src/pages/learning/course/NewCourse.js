// @mui
import { Container } from '@mui/material';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';

// sections
import CourseNewFrom from '../../../sections/course/CourseNewForm';
// ---------------------------------------------------------------------

export default function NewCourse() {
    const { themeStretch } = useSettings();

    return (
        <Page title="Thêm bài giảng mới">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <CourseNewFrom />
            </Container>
        </Page>
    );
}