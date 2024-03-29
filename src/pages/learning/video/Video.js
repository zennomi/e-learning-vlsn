import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container, Stack, } from '@mui/material';
// hooks
import useSettings from '../../../hooks/useSettings';
import { useSnackbar } from 'notistack';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// paths
import { PATH_LEARNING } from '../../../routes/paths';
// utils
// sections
import VideoMainSection from 'src/sections/video/VideoMainSection';
// api
import { getVideo } from 'src/api/video';

// ----------------------------------------------------------------------

export default function Video() {
    const { themeStretch } = useSettings();
    const { enqueueSnackbar } = useSnackbar();

    const { id } = useParams();

    const [video, setVideo] = useState(null);

    useEffect(async () => {
        try {
            const data = await getVideo(id);
            setVideo(data);
        } catch (err) {
            enqueueSnackbar(err, { variant: 'error' });
        }
        return () => {
            setVideo(null);
        };
    }, [id]);


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
                        <VideoMainSection video={video} />
                    </Stack>
                )}
            </Container>
        </Page>
    );
}
