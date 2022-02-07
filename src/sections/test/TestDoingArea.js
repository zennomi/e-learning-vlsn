import { useState, useEffect, memo, useRef  } from 'react';
import Latex from 'react-latex-next';
import { AnimatePresence, m } from 'framer-motion';
import Countdown, { zeroPad } from 'react-countdown';
// @mui
import { Box, Fab, Button, Backdrop, Divider, Typography, Stack, FormControlLabel, Radio, Alert } from "@mui/material";
import { alpha, styled } from '@mui/material/styles';
// components
import Label from "../../components/Label";
import LatexStyle, { delimiters } from '../../components/LatexStyle';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import { IconButtonAnimate, varFade } from '../../components/animate';
import ToggleButton from '../../components/settings/ToggleButton';

// hooks
import useSettings from '../../hooks/useSettings';
// utils
import cssStyles from '../../utils/cssStyles';
// config
import { NAVBAR } from '../../config';

const RootStyle = styled(m.div)(({ theme }) => ({
    ...cssStyles(theme).bgBlur({ color: theme.palette.background.paper, opacity: 0.92 }),
    top: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    position: 'fixed',
    overflow: 'hidden',
    width: NAVBAR.BASE_WIDTH,
    flexDirection: 'column',
    margin: theme.spacing(2),
    paddingBottom: theme.spacing(3),
    zIndex: theme.zIndex.drawer + 3,
    borderRadius: Number(theme.shape.borderRadius) * 1.5,
    boxShadow: `-24px 12px 32px -4px ${alpha(
        theme.palette.mode === 'light' ? theme.palette.grey[500] : theme.palette.common.black,
        0.16
    )}`,
}));

export default function TestDoingArea({ test }) {
    const { themeDirection, onResetSetting } = useSettings();
    const countdownRef = useRef();

    const [userChoices, setUserChoices] = useState({});
    const [open, setOpen] = useState(false);

    const CountdownMemo = memo(({ handleComplete, countdownRef }) =>
        <Countdown date={Date.now() + 5 * 60 * 1000} renderer={renderer} onComplete={handleComplete} ref={countdownRef} />
    )

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [open]);

    const varSidebar =
        themeDirection !== 'rtl'
            ? varFade({
                distance: NAVBAR.BASE_WIDTH,
                durationIn: 0.32,
                durationOut: 0.32,
            }).inRight
            : varFade({
                distance: NAVBAR.BASE_WIDTH,
                durationIn: 0.32,
                durationOut: 0.32,
            }).inLeft;

    const handleToggle = () => {
        setOpen((prev) => !prev);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChoiceClick = (questionId, choiceId) => {
        setUserChoices(prevChoices => {
            if (prevChoices[questionId]?.choice_id === choiceId) return prevChoices;
            prevChoices[questionId] = {
                choice_id: choiceId,
                moment: new Date()
            }
            return { ...prevChoices };
        })
    }

    const handleComplete = () => {
        //
    }

    return (
        <>
            <LatexStyle>
                {
                    test.questions.map((question, i) =>
                        <Box key={question._id}>
                            <Label color="primary">Câu {i + 1}</Label>
                            <Box sx={{ my: 1 }}>
                                <Latex delimiters={delimiters}>{question.question}</Latex>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                {
                                    question.choices.map((c, j) =>
                                        <Box sx={{ display: 'flex', alignContent: 'center', alignItems: 'center', mb: 1 }} key={c._id}>
                                            <Button
                                                size="small"
                                                sx={{ mx: 1 }}
                                                onClick={() => { handleChoiceClick(question._id, c._id); }}
                                                variant={userChoices[question._id]?.choice_id === c._id ? "contained" : "outlined"}
                                            >
                                                {String.fromCharCode(65 + j)}
                                            </Button>
                                            <Box>
                                                <Latex delimiters={delimiters}>{c.content}</Latex>
                                            </Box>
                                        </Box>
                                    )
                                }
                            </Box>
                        </Box>
                    )
                }
            </LatexStyle>
            <Backdrop
                open={open}
                onClick={handleClose}
                sx={{ background: 'transparent', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            />

            {!open && <ToggleButton open={open} notDefault={false} onToggle={handleToggle} sx={{ top: "30%" }} />}

            <AnimatePresence>
                {open && (
                    <>
                        <RootStyle {...varSidebar}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2, pr: 1, pl: 2.5 }}>
                                <Typography variant="subtitle1">Menu</Typography>
                                <div>
                                    <IconButtonAnimate onClick={onResetSetting}>
                                        <Iconify icon={'ic:round-refresh'} width={20} height={20} />
                                    </IconButtonAnimate>
                                    <IconButtonAnimate onClick={handleClose}>
                                        <Iconify icon={'eva:close-fill'} width={20} height={20} />
                                    </IconButtonAnimate>
                                </div>
                            </Stack>

                            <Divider sx={{ borderStyle: 'dashed' }} />

                            <Scrollbar sx={{ flexGrow: 1 }}>
                                <Stack spacing={3} sx={{ p: 3 }}>
                                    <Stack spacing={1.5}>
                                        <Typography variant="subtitle2">Thời gian</Typography>
                                        <CountdownMemo handleComplete={handleComplete} countdownRef={countdownRef} />
                                    </Stack>
                                    <Stack spacing={1.5}>
                                        <Typography variant="subtitle2">Câu hỏi</Typography>
                                    </Stack>
                                </Stack>
                            </Scrollbar>
                        </RootStyle>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
        // Render a completed state
        return <Alert>Hết giờ.</Alert>;
    } else {
        // Render a countdown
        return <span>{hours}:{minutes}:{seconds}</span>;
    }
};