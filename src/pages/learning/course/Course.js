import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';
// @mui
import { Box, Container, Stack, Typography, Button, Alert } from '@mui/material';
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
import { PATH_LEARNING, PATH_PAGE } from '../../../routes/paths';
// utils
import axios from '../../../utils/axios';
import Image from 'src/components/Image';
import { fCurrency } from 'src/utils/formatNumber';
// redux
import { dispatch, useSelector } from '../../../redux/store';
import {
    addCart,
    removeCart,
} from '../../../redux/slices/order';
// sections
import { NavSectionVertical } from '../../../components/nav-section';
import VideoMainSection from 'src/sections/video/VideoMainSection';
import Scrollbar from '../../../components/Scrollbar';
import EmptyContent from '../../../components/EmptyContent';


// ----------------------------------------------------------------------

const typeToIcon = {
    test: 'eva:file-text-outline',
    video: 'eva:video-outline'
}

export default function Course() {
    const isMountedRef = useIsMountedRef();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const { isAuthenticated, user } = useAuth();
    const { cart } = useSelector((state) => state.order);

    const { id, part } = useParams();
    const componentRef = useRef();

    const [course, setCourse] = useState(null);
    const [canSee, setCanSee] = useState(false);
    const [component, setComponent] = useState(null);
    const [open, setOpen] = useState(false);

    const navConfig = course ? [{ subheader: 'Mục lục', items: course.components.slice(0, canSee ? course.components.length : 3).map(c => ({ title: c.name || c.title, path: PATH_LEARNING.course.part(id, c.index), icon: <Iconify icon={typeToIcon[c.type]} /> })) }] : []

    const getCourse = useCallback(async () => {
        try {
            const { data } = await axios.get(`/v1/courses/${id}`);
            if (isMountedRef.current) {
                setCourse(data);
            }
        } catch (err) {
            enqueueSnackbar(err, { variant: 'error' });
        }
    }, [isMountedRef, id]);

    const handleCanSee = useCallback(async () => {
        try {
            const { data } = await axios.get(`/v1/courses/active?courseId=${id}`);
            if (isMountedRef.current) {
                setCanSee(data.actived);
            }
        } catch (err) {
            enqueueSnackbar(err, { variant: 'error' });
        }
    }, [isMountedRef, id])

    useEffect(() => {
        getCourse();
        return () => {
            setCourse(null);
        };
    }, [getCourse]);

    useEffect(async () => {
        if (!course) return () => setComponent(null);
        if (!part) { setComponent(null); return; }
        const currentComponent = course.components[part];
        setComponent(currentComponent);
        componentRef.current.scrollIntoView();
    }, [course, part])

    useEffect(() => {
        if (canSee) return;
        if (user && user.role === 'admin') {
            setCanSee(true);
            return;
        }
        if (user) {
            handleCanSee()
        }
    }, [user, course, canSee])

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
                    <Stack spacing={2}>
                        <Image src={course.coverURL} ratio="21/9" sx={{ width: { md: "80%" }, mx: 'auto' }} />

                        <Stack spacing={2} sx={{ mb: 2 }}>
                            {course?.description && (
                                <CustomStyle>{parse(course.description)}</CustomStyle>
                            )}
                            {!canSee && <Alert severity='warning'>Bạn chưa mua khoá học này nên chỉ được xem trước 3 tiết học</Alert>}
                            <Scrollbar sx={{ maxHeight: '300px', backgroundColor: 'paper.main' }}>
                                <NavSectionVertical navConfig={navConfig} isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
                            </Scrollbar>
                        </Stack>
                        <Box ref={componentRef}>
                            {
                                component ?
                                    (
                                        component.type === 'video' ?
                                            <VideoMainSection video={component} />
                                            :
                                            <Button fullWidth size="large" href={PATH_LEARNING.test.do(component.id)} target="_blank">Vào phòng làm đề</Button>
                                    )
                                    :
                                    <Box height="100vh">
                                        <EmptyContent title="Chọn một bài giảng để bắt đầu học" />
                                    </Box>
                            }
                        </Box>
                    </Stack>
                )}
            </Container>
        </Page>
    );
}
