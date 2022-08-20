import { useState, useCallback, useEffect } from 'react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';
// @mui
import { Container, Stack } from '@mui/material';
// hooks
import { useSnackbar } from 'notistack';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import useAuth from '../../../hooks/useAuth';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import CustomStyle from '../../../components/CustomStyle';
import Iconify from 'src/components/Iconify';
// paths
import { PATH_LEARNING } from '../../../routes/paths';
// utils
import axios from '../../../utils/axios';
import Image from 'src/components/Image';
// sections
import { NavSectionVertical } from '../../../components/nav-section';


// ----------------------------------------------------------------------

const typeToIcon = {
    test: 'eva:file-text-outline',
    video: 'eva:video-outline'
}

export default function Course() {
    const isMountedRef = useIsMountedRef();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const { user, isAuthenticated } = useAuth();

    const { id, part } = useParams();

    const [course, setCourse] = useState(null);
    const [open, setOpen] = useState(false);

    const navConfig = course ? [{ subheader: 'Mục lục', items: course.components.map(c => ({ title: c.name || c.title, path: PATH_LEARNING.course.part(id, c.index), icon: <Iconify icon={typeToIcon[c.type]} /> })) }] : []

    const getCourse = useCallback(async () => {
        try {
            const { data } = await axios.get(`/v1/courses/${id}`);
            if (isMountedRef.current) {
                setCourse(data);
            }
        } catch (err) {
            enqueueSnackbar(err, { variant: 'error' });
        }
    }, [isMountedRef]);

    useEffect(() => {
        getCourse();
        return () => {
            setCourse(null);
        };
    }, [getCourse]);

    const handleDeleteClick = async () => {
        if (window.confirm('Xoá bài giảng này?')) {
            try {
                await axios.delete(`/v1/courses/${id}?populate=videos,tests`);
                navigate('/');
            } catch (error) {
                enqueueSnackbar(error, { variant: 'error' });
            }
        }
    };

    return (
        <Page title={course?.title || 'Khoá học'}>
            <Container maxWidth='xl'>
                <HeaderBreadcrumbs
                    heading={course?.title || 'Khoá học'}
                    links={[
                        { name: 'Học tập', href: PATH_LEARNING.root },
                        { name: 'Khoá học', href: PATH_LEARNING.course.root },
                        { name: course?.title || 'Khoá học' },
                    ]}
                />
                {course && (
                    <>
                        <Image src={course.coverURL} ratio="21/9" sx={{ width: { md: "80%" }, mx: 'auto' }} />
                        <Stack spacing={2} sx={{ mb: 2 }}>
                            {course?.description && (
                                <CustomStyle>{parse(course.description)}</CustomStyle>
                            )}
                        </Stack>
                        <NavSectionVertical navConfig={navConfig} isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
                    </>
                )}
            </Container>
        </Page>
    );
}
