import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Latex from 'react-latex-next';
// @mui
import { Typography, Grid, Box } from '@mui/material';
import { useTheme } from "@mui/material/styles";
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Page from '../../../components/Page';
// utils
import axios from '../../../utils/axios';
// sections
import LatexStyle, { delimiters } from '../../../components/LatexStyle';
// css
import '../../../assets/css/pdf.css';
// ---------------------------------------------------------------------

function OptionArea({ choices }) {
    const theme = useTheme();
    const ref = useRef(null);
    const [xs, setXs] = useState(12);

    useEffect(() => {
        const arrange = () => {
            setXs(12);
            let width = 700;
            console.log(width)
            let maxOptionWidth = Math.max(...Array.from(ref.current.childNodes).map(o => {
                return Array.from(o.childNodes).map(c => c.offsetWidth).reduce((a, b) => a + b);
            }));
            if (maxOptionWidth < width / 4) setXs(3);
            else if (maxOptionWidth < width / 2) setXs(6);
        }
        arrange();
        window.addEventListener("resize", arrange);
        return () => window.removeEventListener("resize", arrange);
    }, [ref.current]);

    return (
        <Grid
            className="not-break-inside"
            container
            ref={ref}
        >
            {
                choices.map((c, j) => (
                    <Grid
                        item
                        xs={xs}
                        sx={{ display: 'flex', alignContent: 'center', alignItems: 'center', flexGrow: 1 }}
                        key={c.id}
                    >
                        <span style={{ fontWeight: "bold", marginRight: "5px", color: theme.palette.primary.main }}>{String.fromCharCode(65 + j)}. </span>
                        <Box>
                            <Latex delimiters={delimiters}>{c.content}</Latex>
                        </Box>
                    </Grid>
                ))
            }
        </Grid>
    )
}

export default function TestViewPDF() {
    const theme = useTheme();

    const isMountedRef = useIsMountedRef();
    const [test, setTest] = useState();
    const { id } = useParams();

    const getTest = useCallback(async () => {
        try {
            const { data } = await axios.get(`/v1/tests/${id}?populate=questions&cache=false`);
            if (isMountedRef.current) {
                setTest(data);
            }
        } catch (err) {
            //
        }
    }, [isMountedRef]);

    useEffect(() => {
        getTest();
    }, [getTest]);

    return (
        <Page title={test?.name}>
            {test &&
                <>
                    <div class="page-header">
                        <Box sx={{ display: "flex", justifyContent: 'space-between' }}>
                            <div class="text-center text-success">VẬT LÝ SIÊU NHẨM</div>
                            <div class="text-center fst-italic">Chinh phục vật lý từ con số 0</div>
                        </Box>
                    </div>
                    <div class="page-footer">
                        <Box sx={{ display: "flex", justifyContent: 'space-between' }}>
                            <div class="text-center fst-italic"><b>Hotline: </b>0326 425 111</div>
                            <div class="text-center fst-italic"><b>Địa chỉ: </b>Tầng 3, Số 10 Tạ Quang Bửu, Bách Khoa, Hà Nội</div>

                        </Box>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <td>
                                    <div class="page-header-space"></div>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <Typography color="primary.main" variant="h3" align="center">
                                        {test.name}
                                    </Typography>
                                    <Grid container sx={{ mb: 2 }}>
                                        <Grid item xs={6}>
                                            <Typography align="center" variant="body2">
                                                {`Đề thi gồm ${test.questions.length} câu.`}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography align="center" variant="body2">
                                                {`Thời gian ${test.time} phút.`}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <LatexStyle>
                                        {test.questions.map((question, i) => (
                                            <Box key={question._id} id={`q-${question._id}`}>
                                                <Box className="not-break-inside">
                                                    <span style={{ fontWeight: "bold", color: theme.palette.primary.main }}>Câu {i + 1}: </span>
                                                    <Latex delimiters={delimiters}>{question.question}</Latex>
                                                </Box>
                                                <OptionArea choices={question.choices} />
                                            </Box>
                                        ))}
                                    </LatexStyle>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td>
                                    <div class="page-footer-space"></div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </>
            }
        </Page>
    );
}