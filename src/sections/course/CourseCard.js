import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
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
    const { title, cover, price, status, priceSale } = course;

    const linkTo = PATH_LEARNING.course.view(course._id);

    return (
        <Card>
            <Box sx={{ position: 'relative' }}>
                {status && (
                    <Label
                        variant="filled"
                        color={(status === 'sale' && 'error') || 'info'}
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
                <Image alt={title} src={cover} ratio="1/1" />
            </Box>

            <Stack spacing={2} sx={{ p: 3 }}>
                <Link to={linkTo} color="inherit" component={RouterLink}>
                    <Typography variant="subtitle2" noWrap>
                        {title}
                    </Typography>
                </Link>

                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={0.5}>
                        {priceSale && (
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
