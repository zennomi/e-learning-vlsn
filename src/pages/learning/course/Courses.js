import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// @mui
import { Container, Box, Pagination, ToggleButton, ToggleButtonGroup, Button, Chip, Grid } from '@mui/material';
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
import CourseCard from '../../../sections/course/CourseCard';
import FilterDrawer from '../../../sections/course/CourseFilterDrawer';

// ----------------------------------------------------------------------

export default function Courses() {
    const { themeStretch } = useSettings();
    const isMountedRef = useIsMountedRef();
    const { enqueueSnackbar } = useSnackbar();

    const [courses, setCourses] = useState([]);

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

    const getCourses = useCallback(async () => {
        try {
            const { data } = await axios.get('/v1/courses', {
                params: { ...paramsToObject(searchParams), limit: 12 }
            });
            if (isMountedRef.current) {
                setCourses(data.results);
                setTotal(data.totalPages);
            }
        } catch (err) {
            console.error(err);
            enqueueSnackbar(err, { variant: 'error' });
        }
    }, [isMountedRef, searchParams]);

    useEffect(() => {
        getCourses();
        return () => { setCourses([]); }
    }, [getCourses]);

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
        <Page title="Kho Khoá học">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading="Kho Khoá học"
                    links={[
                        { name: 'Học tập', href: PATH_LEARNING.root },
                        { name: 'Khoá học', href: PATH_LEARNING.course.root },
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
                <Grid container spacing={2}>
                    {
                        courses.map(t =>
                            <Grid item xs={12} md={4} lg={3} key={t.id}>
                                <CourseCard course={t} />
                            </Grid>
                        )
                    }
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                    <Pagination sx={{ my: 2 }} count={total} page={Number(searchParams.get("page"))} onChange={handlePageChange} />
                </Box>
            </Container>
            <FilterDrawer isOpen={isFilterOpen} onClose={handleFilterClose} setNewParams={setNewParams} />
        </Page>
    );
}
