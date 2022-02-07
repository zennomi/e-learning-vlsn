import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// @mui
import { Container, Modal, Box, Card, CardContent, Pagination } from '@mui/material';
// routes
import { PATH_LEARNING } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import useIsMountedRef from '../../hooks/useIsMountedRef';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// utils
import axios from '../../utils/axios';
import paramsToObject from '../../utils/urlParamsHelper';
// sections
import TestList from '../../sections/test/TestList';
// ----------------------------------------------------------------------

export default function Tests() {
    const { themeStretch } = useSettings();
    const isMountedRef = useIsMountedRef();
    const { enqueueSnackbar } = useSnackbar();

    const [tests, setTests] = useState([]);

    const [total, setTotal] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams({ page: 1 });


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

    const getTests = useCallback(async () => {
        try {
            const { data } = await axios.get('/v1/tests', {
                params: { ...paramsToObject(searchParams), limit: 12 }
            });
            if (isMountedRef.current) {
                setTests(data.results);
                setTotal(data.totalPages);
            }
        } catch (err) {
            console.error(err);
            enqueueSnackbar(err, { variant: 'error' });
        }
    }, [isMountedRef, searchParams]);

    useEffect(() => {
        getTests();
        return () => { setTests([]); }
    }, [getTests]);

    const handlePageChange = (event, page) => {
        setNewParams({ page });
    }

    return (
        <Page title="Ngân hàng đề thi">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading="Ngân hàng đề thi"
                    links={[
                        { name: 'Học tập', href: PATH_LEARNING.root },
                        { name: 'Đề thi', href: PATH_LEARNING.test.root },
                    ]}
                />
                <TestList tests={tests} />
                <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                    <Pagination sx={{ my: 2 }} count={total} page={Number(searchParams.get("page"))} onChange={handlePageChange} />
                </Box>
            </Container>
        </Page>
    );
}
