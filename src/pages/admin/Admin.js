// @mui
import { Container, Grid } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import LinkWidget from '../../components/LinkWidget';
// paths
import { PATH_ADMIN, PATH_LEARNING } from '../../routes/paths';
// ----------------------------------------------------------------------

export default function Admin() {
    const { themeStretch } = useSettings();

    return (
        <Page title="Bảng điều khiển của Admin">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} xl={3}>
                        <LinkWidget title='Thêm câu hỏi' link={PATH_LEARNING.question.create} description='trắc nghiệm' icon='eva:list-fill' />
                    </Grid>
                    <Grid item xs={12} md={6} xl={3}>
                        <LinkWidget title='Tạo đề thi' link={PATH_LEARNING.test.create} description='từ các câu hỏi đã chọn' icon='eva:file-add-fill' />
                    </Grid>
                    <Grid item xs={12} md={6} xl={3}>
                        <LinkWidget title='Tự động tạo đề' link={PATH_LEARNING.test.autoCreate} description='lựa chọn chủ đề và thể loại' icon='eva:file-add-fill' />
                    </Grid>
                    <Grid item xs={12} md={6} xl={3}>
                        <LinkWidget title='Nhập đề' link={PATH_ADMIN.importTest} description='nạp tiền cho học sinh' icon='eva:file-add-fill' />
                    </Grid>
                </Grid>
            </Container>
        </Page >
    );
}
