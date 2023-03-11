import { m } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container, OutlinedInput, } from '@mui/material';
// components
import Page from '../../../components/Page';
import { MotionContainer, varBounce } from '../../../components/animate';
// assets
import { useState } from 'react';
import axiosInstance from '../../../utils/axios';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    minHeight: '100%',
    alignItems: 'center',
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

export default function CourseActive() {
    const [value, setValue] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()

    const handleChange = async (event) => {
        setValue((event.target.value))
        setError("")
    }

    const handleClick = async () => {
        try {
            console.log(value)
            const { data } = await axiosInstance({
                method: 'POST',
                url: '/v1/courses/active',
                data: { purchaseCode: value }
            })
            navigate('/profile')
            enqueueSnackbar("Kích hoạt khoá học thành công")
        } catch (error) {
            setError('Mã không hợp lệ')
        }
    }
    return (
        <Page title="Kích hoạt khoá học" sx={{ height: 1 }}>
            <RootStyle>
                <Container component={MotionContainer}>
                    <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
                        <m.div variants={varBounce().in}>
                            <Typography variant="h3" paragraph>
                                Kích hoạt khoá học
                            </Typography>
                        </m.div>
                        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
                            Nhập mã mua hàng tại đây để kích hoạt khoá học!
                        </Typography>

                        <m.div variants={varBounce().in}>
                            <OutlinedInput
                                value={value}
                                onChange={handleChange}
                                fullWidth
                                endAdornment={
                                    <Button variant="contained" onClick={handleClick}>
                                        Nhập
                                    </Button>}
                                error={!!error}
                                sx={{ maxWidth: 600 }}
                                placeholder="xxxxxxxxxxxxxx-xxxxxxxx-xxxxxx-xxxxxx"
                            />
                        </m.div>
                        {error && <Typography sx={{ color: 'error.main', my: 1 }}>
                            {error}
                        </Typography>}
                        <Typography sx={{ color: 'text.secondary', my: 2 }}>
                            Chưa có mã mua hàng? Mua ngay các khoá học tại đây
                        </Typography>
                        <Button href="https://shop.vatlysieunham.edu.vn/khoa-hoc-vlsn" target="_blank" size="large" variant="contained">
                            Mua khoá học
                        </Button>
                    </Box>
                </Container>
            </RootStyle>
        </Page>
    );
}
