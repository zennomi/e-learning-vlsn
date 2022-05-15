// @mui
import { Container } from '@mui/material';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';

// sections
import VideoNewFrom from '../../../sections/video/VideoNewForm';
// ---------------------------------------------------------------------

export default function NewVideo() {
    const { themeStretch } = useSettings();

    return (
        <Page test="Thêm bài giảng mới">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <VideoNewFrom />
            </Container>
        </Page>
    );
}