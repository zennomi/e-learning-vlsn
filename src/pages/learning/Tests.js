// @mui
import { Container } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// paths
import { PATH_LEARNING } from '../../routes/paths';
// sections
import TestList from '../../sections/test/TestList';
// mock
import { tests } from '../../_mock/test';
// ----------------------------------------------------------------------

export default function PageFive() {
    const { themeStretch } = useSettings();

    return (
        <Page title="Ngân hàng đề thi">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading="Ngân hàng câu hỏi"
                    links={[
                        { name: 'Học tập', href: PATH_LEARNING.root },
                        { name: 'Câu hỏi', href: PATH_LEARNING.test.root },
                    ]}
                />
                <TestList tests={tests}/>
            </Container>
        </Page>
    );
}
