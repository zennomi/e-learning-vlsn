import { useState, useRef } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import ReactPlayer from 'react-player';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import Forward10 from '@mui/icons-material/Forward10';
import Replay10 from '@mui/icons-material/Replay10';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import VolumeDownRounded from '@mui/icons-material/VolumeDownRounded';

const Widget = styled('div')(({ theme }) => ({
    padding: 16,
    borderRadius: 16,
    maxWidth: '100%',
    margin: 'auto',
    position: 'relative',
    zIndex: 1,
    backgroundColor:
        theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.4)',
    backdropFilter: 'blur(40px)',
}));

const TinyText = styled(Typography)({
    fontSize: '0.75rem',
    opacity: 0.38,
    fontWeight: 500,
    letterSpacing: 0.2,
});

export default function VideoPlayer({ video }) {
    const theme = useTheme();

    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [played, setPlayed] = useState(0);
    const [duration, setDuration] = useState(0);
    const [seeking, setSeeking] = useState(false);
    const player = useRef();


    function formatDuration(value) {
        const minute = Math.floor(value / 60);
        const secondLeft = Math.round(value - minute * 60);
        return `${minute}:${secondLeft < 9 ? `0${secondLeft}` : secondLeft}`;
    }
    const mainIconColor = theme.palette.mode === 'dark' ? '#fff' : '#000';
    const lightIconColor =
        theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';

    const handlePlay = () => {
        setPlaying(true);
    }

    const handlePause = () => {
        setPlaying(false);
    }

    const handlePlayPause = () => {
        setPlaying(prev => !prev);
    }

    const handleDuration = (_duration) => {
        setDuration(_duration);
    }


    const handleProgress = state => {
        // We only want to update time slider if we are not currently seeking
        if (!seeking)
            setPlayed(state.played);
    }

    const handleSeekMouseDown = () => {
        setSeeking(true);
    }

    const handleSeekChange = value => {
        player.current.seekTo(parseFloat(value));
        setPlayed(value);
    }

    const handleSeekMouseUp = second => {
        setSeeking(false);
    }

    const handleSeekWithSecond = second => {
        player.current.seekTo(parseFloat(played + second / duration));
    }

    return (
        <Stack spacing={1}>
            <Box item sx={{ position: "relative", paddingTop: "56.25%" }}>
                <ReactPlayer
                    ref={player}
                    url={video.url}
                    controls={false}
                    playing={playing}
                    volume={volume}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onDuration={handleDuration}
                    onProgress={handleProgress}
                    style={{ position: "absolute", top: 0, left: 0 }}
                    width='100%'
                    height='100%'
                />
            </Box>
            <Box sx={{ width: '100%', overflow: 'hidden' }}>
                <Widget>
                    <Slider
                        aria-label="time-indicator"
                        size="small"
                        value={played}
                        min={0}
                        step={0.01}
                        max={0.99}
                        onChange={(_, value) => handleSeekChange(value)}
                        onMouseDown={handleSeekMouseDown}
                        onMouseUp={handleSeekMouseUp}
                        sx={{
                            color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
                            height: 4,
                            '& .MuiSlider-thumb': {
                                width: 8,
                                height: 8,
                                transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                                '&:before': {
                                    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                                },
                                '&:hover, &.Mui-focusVisible': {
                                    boxShadow: `0px 0px 0px 8px ${theme.palette.mode === 'dark'
                                        ? 'rgb(255 255 255 / 16%)'
                                        : 'rgb(0 0 0 / 16%)'
                                        }`,
                                },
                                '&.Mui-active': {
                                    width: 20,
                                    height: 20,
                                },
                            },
                            '& .MuiSlider-rail': {
                                opacity: 0.28,
                            },
                        }}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mt: -2,
                        }}
                    >
                        <TinyText>{formatDuration(played * duration)}</TinyText>
                        <TinyText>-{formatDuration(duration - played * duration)}</TinyText>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mt: -1,
                        }}
                    >
                        <IconButton
                            aria-label="previous song"
                            onClick={() => handleSeekWithSecond(-10)}
                        >
                            <Replay10 fontSize="large" htmlColor={mainIconColor} />
                        </IconButton>
                        <IconButton
                            aria-label={!playing ? 'play' : 'pause'}
                            onClick={handlePlayPause}
                        >
                            {!playing ? (
                                <PlayArrowRounded
                                    sx={{ fontSize: '3rem' }}
                                    htmlColor={mainIconColor}
                                />
                            ) : (
                                <PauseRounded sx={{ fontSize: '3rem' }} htmlColor={mainIconColor} />
                            )}
                        </IconButton>
                        <IconButton
                            aria-label="next song"
                            onClick={() => handleSeekWithSecond(10)}
                        >
                            <Forward10 fontSize="large" htmlColor={mainIconColor} />
                        </IconButton>
                    </Box>
                    <Stack spacing={2} direction="row" sx={{ mb: 1, px: 1 }} alignItems="center">
                        <VolumeDownRounded htmlColor={lightIconColor} />
                        <Slider
                            aria-label="Volume"
                            value={volume}
                            max={1}
                            sx={{
                                color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
                                '& .MuiSlider-track': {
                                    border: 'none',
                                },
                                '& .MuiSlider-thumb': {
                                    width: 24,
                                    height: 24,
                                    backgroundColor: '#fff',
                                    '&:before': {
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                                    },
                                    '&:hover, &.Mui-focusVisible, &.Mui-active': {
                                        boxShadow: 'none',
                                    },
                                },
                            }}
                        />
                        <VolumeUpRounded htmlColor={lightIconColor} />
                    </Stack>
                </Widget>
            </Box>
        </Stack>

    );
}
