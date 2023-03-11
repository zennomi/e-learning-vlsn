import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Card,
  Stack,
  Divider,
  CardHeader,
  Typography,
  CardContent,
} from '@mui/material';
// utils
import { fCurrency } from '../../utils/formatNumber';
// components

// ----------------------------------------------------------------------

CheckoutSummary.propTypes = {
  total: PropTypes.number,

};

export default function CheckoutSummary({
  total,

}) {

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Hoá Đơn"
      />

      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Ship
            </Typography>
            <Typography variant="subtitle2">Miễn phí</Typography>
          </Stack>

          <Divider />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">Tổng</Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                {fCurrency(total)}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
