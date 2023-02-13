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

    const { isAuthenticated } = useAuth();
    const { cart } = useSelector((state) => state.order);

    const { id, part } = useParams();
    const inCart = cart.find(p => p.id === id);
    const componentRef = useRef();

    const [course, setCourse] = useState(null);
    const [component, setComponent] = useState(null);
    const [open, setOpen] = useState(false);

    const navConfig = course ? [{ subheader: 'Mục lục', items: course.components.slice(0,3).map(c => ({ title: c.name || c.title, path: PATH_LEARNING.course.part(id, c.index), icon: <Iconify icon={typeToIcon[c.type]} /> })) }] : []

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

    useEffect(async () => {
        if (!course) return () => setComponent(null);
        if (!part) { setComponent(null); return; }
        const currentComponent = course.components[part];
        if (currentComponent.type === 'video') {
            setComponent(currentComponent);
            componentRef.current.scrollIntoView();
        }
    }, [course, part])

    const handleAddCart = () => {
        dispatch(addCart({ ...course, type: 'course' }));
    }

    const handleRemoveCart = () => {
        dispatch(removeCart(course.id));

    }

    const handleBuyNow = () => {
        if (!inCart) handleAddCart();
        navigate(PATH_PAGE.checkout);
    }

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
                        <Typography variant="h4" sx={{ mb: 3 }}>
                            {/* <Box component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                                {priceSale && fCurrency(priceSale)}
                            </Box> */}
                            &nbsp;{fCurrency(course.price)}
                        </Typography>
                        {
                            isAuthenticated ?
                                <Stack direction="row" spacing={2}>
                                    {
                                        inCart ?
                                            <Button
                                                fullWidth
                                                size="large"
                                                color="warning"
                                                variant="contained"
                                                startIcon={<Iconify icon={'ic:outline-remove-shopping-cart'} />}
                                                onClick={handleRemoveCart}
                                                sx={{ whiteSpace: 'nowrap' }}
                                            >
                                                Bỏ khỏi giỏ hàng
                                            </Button> :
                                            <Button
                                                fullWidth
                                                size="large"
                                                color="warning"
                                                variant="contained"
                                                startIcon={<Iconify icon={'ic:round-add-shopping-cart'} />}
                                                onClick={handleAddCart}
                                                sx={{ whiteSpace: 'nowrap' }}
                                            >
                                                Thêm vào giỏ hàng
                                            </Button>
                                    }
                                    <Button fullWidth size="large" type="submit" variant="contained" onClick={handleBuyNow}>
                                        Thanh toán ngay
                                    </Button>
                                </Stack> :
                                <Alert severity='error'>Đăng nhập để mua khoá học</Alert>
                        }

                        <Stack spacing={2} sx={{ mb: 2 }}>
                            {course?.description && (
                                <CustomStyle>{parse(course.description)}</CustomStyle>
                            )}
                            <Typography>Xem thử</Typography>
                            <Scrollbar sx={{ maxHeight: '300px', backgroundColor: 'paper.main' }}>
                                <NavSectionVertical navConfig={navConfig} isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
                            </Scrollbar>
                        </Stack>
                        <Box ref={componentRef}>
                            {
                                component ?
                                    (
                                        component.type === 'video' &&
                                        <VideoMainSection video={component} />
                                    )
                                    :
                                    <Box height="100vh">
                                        <EmptyContent title="Chọn một bài giảng để bắt đầu học"/>
                                    </Box>
                            }
                        </Box>
                    </Stack>
                )}
            </Container>
        </Page>
    );
}
