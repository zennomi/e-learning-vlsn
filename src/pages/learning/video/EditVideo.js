import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// hooks
import useSettings from '../../../hooks/useSettings';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Page from '../../../components/Page';
// utils
import axios from '../../../utils/axios';
// sections
import VideoNewFrom from '../../../sections/video/VideoNewForm';
// ---------------------------------------------------------------------

export default function EditVideo() {
    const { themeStretch } = useSettings();
    const isMountedRef = useIsMountedRef();
    const [video, setVideo] = useState();
    const { id } = useParams();

    const getVideo = useCallback(async () => {
        try {
            const { data } = await axios.get(`/v1/videos/${id}?cache=false`);
            if (isMountedRef.current) {
                setVideo(data);
            }
        } catch (err) {
            //
        }
    }, [isMountedRef]);

    useEffect(() => {
        getVideo();
    }, [getVideo]);

    return (
        <Page title="Sửa video">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <VideoNewFrom currentVideo={video} isEdit />
            </Container>
        </Page>
    );
}