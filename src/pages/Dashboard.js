// @mui
import { Container, Typography, Grid } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import LinkWidget from '../components/LinkWidget';
// paths
import { PATH_LEARNING } from '../routes/paths';
// ----------------------------------------------------------------------

export default function PageOne() {
    const { themeStretch } = useSettings();

    return (
        <Page title="Bảng điều khiển của Admin">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} xl={3}>
                        <LinkWidget title='Thêm câu hỏi' link={PATH_LEARNING.question.create} description='trắc nghiệm' icon='eva:list-fill' />
                    </Grid>
                    <Grid item xs={12} md={6} xl={3}>
                        <LinkWidget title='Tạo đề thi' link={PATH_LEARNING.test.create} description='từ các câu hỏi đã lưu' icon='eva:file-add-fill' />
                    </Grid>
                </Grid>
            </Container>
        </Page >
    );
}
