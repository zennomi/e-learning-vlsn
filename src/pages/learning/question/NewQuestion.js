// @mui
import { Container } from '@mui/material';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';

// sections
import QuestionNewFrom from '../../../sections/question/QuestionNewForm';
// ---------------------------------------------------------------------

export default function NewQuestion() {
    const { themeStretch } = useSettings();

    return (
        <Page test="Thêm câu hỏi mới">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <QuestionNewFrom />
            </Container>
        </Page>
    );
}