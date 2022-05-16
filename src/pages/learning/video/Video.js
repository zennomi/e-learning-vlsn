import { useState, useCallback, useEffect } from 'react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';
// @mui
import { Box, Button, Card, CardContent, CardHeader, Container, Grid, Stack, Typography, ButtonGroup } from '@mui/material';
// hooks
import useSettings from '../../../hooks/useSettings';
import { useSnackbar } from 'notistack';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import useAuth from '../../../hooks/useAuth';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Label from '../../../components/Label';
import CustomStyle from '../../../components/CustomStyle';
// paths
import { PATH_LEARNING } from '../../../routes/paths';
// utils
import axios from '../../../utils/axios';
import Iconify from '../../../components/Iconify';
// sections
import VideoPlayer from "../../../sections/video/VideoPlayer";

// ----------------------------------------------------------------------

export default function Video() {
    const { themeStretch } = useSettings();
    const isMountedRef = useIsMountedRef();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const { user, isAuthenticated } = useAuth();

    const { id } = useParams();

    const [video, setVideo] = useState(null);

    const getVideo = useCallback(async () => {
        try {
            const { data } = await axios.get(`/v1/videos/${id}`);
            if (isMountedRef.current) {
                setVideo(data);
            }
        } catch (err) {
            enqueueSnackbar(err, { variant: 'error' });
        }
    }, [isMountedRef]);

    useEffect(() => {
        getVideo();
        return () => {
            setVideo(null);
        };
    }, [getVideo]);

    const handleDeleteClick = async () => {
        if (window.confirm('Xoá bài giảng này?')) {
            try {
                await axios.delete(`/v1/videos/${id}`);
                navigate('/');
            } catch (error) {
                enqueueSnackbar(error, { variant: 'error' });
            }
        }
    };

    return (
        <Page title={video?.title || 'Bài giảng'}>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading={video?.title || 'Bài giảng'}
                    links={[
                        { name: 'Học tập', href: PATH_LEARNING.root },
                        { name: 'Bài giảng', href: PATH_LEARNING.video.root },
                        { name: video?.title || 'Bài giảng' },
                    ]}
                />
                {video && (
                    <Stack spacing={2} sx={{ mb: 2 }}>
                        <VideoPlayer video={video} />
                        {video?.description && (
                            <Card>
                                <CardContent>
                                    <CustomStyle>{parse(video.description)}</CustomStyle>
                                </CardContent>
                            </Card>
                        )}
                    </Stack>
                )}
            </Container>
        </Page>
    );
}
