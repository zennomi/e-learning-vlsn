import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Card, Link, Typography, Stack } from '@mui/material';
// routes
import { PATH_LEARNING } from '../../routes/paths';
// utils
import { fCurrency } from '../../utils/formatNumber';
// components
import Label from '../../components/Label';
import Image from '../../components/Image';

// ----------------------------------------------------------------------

export default function CourseCard({ course }) {
    const { title, coverURL, price, status, priceSale, isSale } = course;

    const linkTo = PATH_LEARNING.course.view(course.id);

    return (
        <Card>
            <Box sx={{ position: 'relative' }}>
                {status && (
                    <Label
                        variant="filled"
                        sx={{
                            top: 16,
                            right: 16,
                            zIndex: 9,
                            position: 'absolute',
                            textTransform: 'uppercase',
                        }}
                    >
                        {status}
                    </Label>
                )}
                <Image alt={title} src={coverURL} ratio="16/9" />
            </Box>

            <Stack spacing={2} sx={{ p: 3 }}>
                <Link to={linkTo} color="inherit" component={RouterLink}>
                    <Typography variant="subtitle2" noWrap>
                        {title}
                    </Typography>
                </Link>

                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={0.5}>
                        {isSale && (
                            <Typography component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                                {fCurrency(priceSale)}
                            </Typography>
                        )}
                        <Typography variant="subtitle1">{fCurrency(price)}</Typography>
                    </Stack>
                </Stack>
            </Stack>
        </Card>
    );
}
