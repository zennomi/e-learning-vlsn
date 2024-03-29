import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// @mui
import { Container, Box, Pagination, ToggleButton, ToggleButtonGroup, Button, Chip } from '@mui/material';
// routes
import { PATH_LEARNING } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Iconify from '../../../components/Iconify';
// utils
import axios from '../../../utils/axios';
import paramsToObject from '../../../utils/urlParamsHelper';
// sections
import VideoList from '../../../sections/video/VideoList';
import FilterDrawer from '../../../sections/video/VideoFilterDrawer';

// ----------------------------------------------------------------------

export default function Videos() {
    const { themeStretch } = useSettings();
    const isMountedRef = useIsMountedRef();
    const { enqueueSnackbar } = useSnackbar();

    const [videos, setVideos] = useState([]);

    const [total, setTotal] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams({ page: 1, grade: 12 });

    const setNewParams = (params) => {
        if (!params.page) params.page = 1;
        const newParams = paramsToObject(searchParams);
        Object.keys(params).forEach(key => {
            if (params[key] === null || params[key] === 'all' || params[key] === '' || !params[key]) delete newParams[key];
            else newParams[key] = params[key];
        });
        setSearchParams({
            ...newParams
        })
    }

    const getVideos = useCallback(async () => {
        try {
            const { data } = await axios.get('/v1/videos', {
                params: { ...paramsToObject(searchParams), limit: 12 }
            });
            if (isMountedRef.current) {
                setVideos(data.results);
                setTotal(data.totalPages);
            }
        } catch (err) {
            console.error(err);
            enqueueSnackbar(err, { variant: 'error' });
        }
    }, [isMountedRef, searchParams]);

    useEffect(() => {
        getVideos();
        return () => { setVideos([]); }
    }, [getVideos]);

    const handlePageChange = (event, page) => {
        setNewParams({ page });
    }

    const handleFilterClose = () => {
        setIsFilterOpen(false);
    }

    const handleGradeClick = (event, grade) => {
        if (!grade) setNewParams({ grade: 12, page: 1 });
        else setNewParams({ grade: grade, page: 1 });
    }


    return (
        <Page title="Kho bài giảng miễn phí">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading="Kho bài giảng miễn phí"
                    links={[
                        { name: 'Học tập', href: PATH_LEARNING.root },
                        { name: 'Bài giảng', href: PATH_LEARNING.video.root },
                    ]}
                />
                <ToggleButtonGroup
                    color="primary"
                    value={Number(searchParams.get("grade"))}
                    exclusive
                    onChange={handleGradeClick}
                    fullWidth
                    sx={{ mb: 3 }}
                >
                    <ToggleButton value={12} key={12}>Lớp 12</ToggleButton>
                    <ToggleButton value={11} key={11}>Lớp 11</ToggleButton>
                    <ToggleButton value={10} key={10}>Lớp 10</ToggleButton>
                </ToggleButtonGroup>
                <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                    <Button
                        startIcon={<Iconify icon='bi:filter' />}
                        endIcon={<Chip label={Object.keys(paramsToObject(searchParams)).length - 2} size='small' color='info' />}
                        color='info'
                        variant="outlined"
                        onClick={() => { setIsFilterOpen(true) }}
                        sx={{ mb: 2, mr: 2 }}
                    >
                        Lọc
                    </Button>
                </Box>
                <VideoList videos={videos} />
                <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                    <Pagination sx={{ my: 2 }} count={total} page={Number(searchParams.get("page"))} onChange={handlePageChange} />
                </Box>
            </Container>
            <FilterDrawer isOpen={isFilterOpen} onClose={handleFilterClose} setNewParams={setNewParams} />
        </Page>
    );
}
