import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Card, Avatar, Typography, CardContent, Stack } from '@mui/material';
// routes
import { PATH_LEARNING } from '../../routes/paths';
// hooks
import useResponsive from '../../hooks/useResponsive';
// utils
import { fDate } from '../../utils/formatTime';
import { fShortenNumber } from '../../utils/formatNumber';
// components
import VideoThumbnail from '../../components/VideoThumbnail';
import Iconify from '../../components/Iconify';
import TextMaxLine from '../../components/TextMaxLine';
import TextIconLabel from '../../components/TextIconLabel';
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const OverlayStyle = styled('div')(({ theme }) => ({
    top: 0,
    zIndex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: alpha(theme.palette.grey[900], 0.8),
}));

// ----------------------------------------------------------------------

export default function VideoCard({ video, index }) {
    const isDesktop = useResponsive('up', 'md');

    const { title, id, createdAt, url } = video;
    const cover = "https://minimal-assets-api-dev.vercel.app/assets/images/covers/cover_4.jpg";
    const view = 10000;
    const comment = 1000;
    const share = 112121212;
    const author = {
        name: "Heloo",
        avatarUrl: "https://minimal-assets-api-dev.vercel.app/assets/images/avatars/avatar_2.jpg"
    };

    const latestPost = index === 0 || index === 1;

    if (isDesktop && latestPost) {
        return (
            <Card>
                <Avatar
                    alt={author.name}
                    src={author.avatarUrl}
                    sx={{
                        zIndex: 9,
                        top: 24,
                        left: 24,
                        width: 40,
                        height: 40,
                        position: 'absolute',
                    }}
                />
                <PostContent title={title} view={view} comment={comment} share={share} createdAt={createdAt} index={index} id={id} />
                <OverlayStyle />
                <VideoThumbnail alt="cover" sx={{ height: 360 }} url={url} />
            </Card>
        );
    }

    return (
        <Card>
            <Box sx={{ position: 'relative' }}>
                <SvgIconStyle
                    src="https://minimal-assets-api.vercel.app/assets/icons/shape-avatar.svg"
                    sx={{
                        width: 80,
                        height: 36,
                        zIndex: 9,
                        bottom: -15,
                        position: 'absolute',
                        color: 'background.paper',
                    }}
                />
                <Avatar
                    alt={author.name}
                    src={author.avatarUrl}
                    sx={{
                        left: 24,
                        zIndex: 9,
                        width: 32,
                        height: 32,
                        bottom: -16,
                        position: 'absolute',
                    }}
                />
                <VideoThumbnail
                    alt="cover"
                    url={url}
                />
            </Box>

            <PostContent
                title={title}
                view={view}
                comment={comment}
                share={share}
                createdAt={createdAt}
                id={id}
            />
        </Card>
    );
}

// ----------------------------------------------------------------------

PostContent.propTypes = {
    comment: PropTypes.number,
    createdAt: PropTypes.string,
    index: PropTypes.number,
    share: PropTypes.number,
    title: PropTypes.string,
    view: PropTypes.number,
};

export function PostContent({ title, id, view, comment, share, createdAt, index }) {
    const isDesktop = useResponsive('up', 'md');

    const linkTo = `${PATH_LEARNING.video.root}/${id}`;

    const latestPostLarge = index === 0;
    const latestPostSmall = index === 1 || index === 2;

    const POST_INFO = [
        { number: comment, icon: 'eva:message-circle-fill' },
        { number: view, icon: 'eva:eye-fill' },
        { number: share, icon: 'eva:share-fill' },
    ];

    return (
        <CardContent
            sx={{
                pt: 4.5,
                width: 1,
                ...((latestPostLarge || latestPostSmall) && {
                    pt: 0,
                    zIndex: 9,
                    bottom: 0,
                    position: 'absolute',
                    color: 'common.white',
                }),
            }}
        >
            <Typography
                gutterBottom
                variant="caption"
                component="div"
                sx={{
                    color: 'text.disabled',
                    ...((latestPostLarge || latestPostSmall) && {
                        opacity: 0.64,
                        color: 'common.white',
                    }),
                }}
            >
                {fDate(createdAt)}
            </Typography>

            <Link to={linkTo} color="inherit" component={RouterLink}>
                <TextMaxLine variant={isDesktop && latestPostLarge ? 'h5' : 'subtitle2'} line={2} persistent>
                    {title}
                </TextMaxLine>
            </Link>

            <Stack
                flexWrap="wrap"
                direction="row"
                justifyContent="flex-end"
                sx={{
                    color: 'text.disabled',
                    ...((latestPostLarge || latestPostSmall) && {
                        opacity: 0.64,
                        color: 'common.white',
                    }),
                }}
            >
                {POST_INFO.map((info, index) => (
                    <TextIconLabel
                        key={index}
                        icon={<Iconify icon={info.icon} sx={{ width: 16, height: 16, mr: 0.5 }} />}
                        value={fShortenNumber(info.number)}
                        sx={{ typography: 'caption', ml: index === 0 ? 0 : 1.5 }}
                    />
                ))}
            </Stack>
        </CardContent>
    );
}