import { useState, useCallback, useEffect } from 'react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';
// @mui
import { Box, Button, Card, CardContent, CardHeader, Container, Grid, Stack, Typography } from '@mui/material';
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
        if (window.confirm('Xoá đề thi này?')) {
            try {
                await axios.delete(`/v1/videos/${id}`);
                navigate('/');
            } catch (error) {
                enqueueSnackbar(error, { variant: 'error' });
            }
        }
    };

    return (
        <Page title={video?.name || 'Đề thi'}>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading={video?.name || 'Đề thi'}
                    links={[
                        { name: 'Học tập', href: PATH_LEARNING.root },
                        { name: 'Đề thi', href: PATH_LEARNING.video.root },
                        { name: video?.name || 'Đề thi' },
                    ]}
                />
                {video && (
                    <Stack spacing={2} sx={{ mb: 2 }}>
                        <div>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Typography align="center">{`Đề thi gồm ${video.questions?.length} câu.`}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography align="center">{`Thời gian ${video.time} phút.`}</Typography>
                                </Grid>
                            </Grid>
                        </div>
                        {video.showKeyMode === 0 && <Typography>Đề thi chỉ hiện điểm.</Typography>}
                        {video.showKeyMode === 1 && <Typography>Đề thi chỉ hiện điểm và đáp án sai.</Typography>}
                        {video.showKeyMode === 2 && (
                            <Typography>Đề thi công khai đáp án sau khi hoàn thành và có thể xem lại bài làm.</Typography>
                        )}
                        {video.isShuffled && <Typography>Đề thi có trộn câu.</Typography>}
                        <Box sx={{ display: 'flex' }}>
                            {video.grade && <Label sx={{ m: 0.5 }}>{`Lớp ${video.grade}`}</Label>}
                            {video.tags?.map((tag) => (
                                <Label sx={{ m: 0.5 }}>{`${tag}`}</Label>
                            ))}
                        </Box>
                        {video?.note?.length > 3 && (
                            <Card>
                                <CardContent>
                                    <CustomStyle>{parse(video.note)}</CustomStyle>
                                </CardContent>
                            </Card>
                        )}
                        {video.isPublic || user.isStaff ? (
                            <Button
                                fullWidth
                                variant="contained"
                                component={RouterLink}
                                to={`${PATH_LEARNING.video.root}/${id}/lam`}
                                startIcon={<Iconify icon="eva:arrow-circle-right-fill" />}
                            >
                                Vào khu vực làm đề
                            </Button>
                        ) : (
                            <Button
                                fullWidth
                                disabled
                                variant="contained"
                                component={RouterLink}
                                to={`${PATH_LEARNING.video.root}/${id}/lam`}
                                startIcon={<Iconify icon="eva:lock-fill" />}
                            >
                                Đề thi đã bị khoá
                            </Button>
                        )}
                    </Stack>
                )}
                {isAuthenticated && (
                    <Stack spacing={2}>
                        {(video?.showKeyMode === 2 || user.isStaff) && (
                            <>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    component={RouterLink}
                                    to={`${PATH_LEARNING.video.root}/${id}/chi-tiet`}
                                    startIcon={<Iconify icon="eva:list-fill" />}
                                >
                                    Xem đề và lịch sử làm bài
                                </Button>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    component={RouterLink}
                                    to={`${PATH_LEARNING.video.root}/${id}/in-pdf`}
                                    startIcon={<Iconify icon="eva:printer-fill" />}
                                >
                                    In PDF
                                </Button>
                            </>
                        )}
                        {user.isStaff && (
                            <>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    component={RouterLink}
                                    to={`${PATH_LEARNING.video.root}/${id}/cap-nhat`}
                                >
                                    Cập nhật đề
                                </Button>
                                <Button fullWidth variant="contained" color="error" onClick={handleDeleteClick}>
                                    Xoá đề
                                </Button>
                            </>
                        )}
                    </Stack>
                )}
            </Container>
        </Page>
    );
}
