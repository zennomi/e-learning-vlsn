import { styled } from '@mui/system';

const RootStyle = styled('div')(({ theme }) => ({
    fontFamily: "Times New Roman",
    fontSize: "1.1rem",
    color: `${theme.palette.text.primary} !important`,
    "& .katex": {
        fontSize: "inherit !important"
    },
    "& .katex .mathnormal": {
        font: "inherit !important"
    },
    "& .katex .mfrac": {
        fontSize: "1.5rem !important"
    },
    "& img": {
        filter: theme.palette.mode === "light" ? "" : "invert(95%)",
        display: "inline"
    },
    "& button": {
        minWidth: 0
    },
}));

export default function LatexStyle({ children }) {
    return <RootStyle>{children}</RootStyle>
}

export const delimiters = [
    { left: '$$', right: '$$', display: false },
    { left: '\\(', right: '\\)', display: false },
    { left: '$', right: '$', display: false },
    { left: '\\[', right: '\\]', display: false },
]