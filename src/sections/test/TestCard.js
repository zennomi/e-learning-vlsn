import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Card, Link, Typography, Stack, Button } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_LEARNING } from '../../routes/paths';
// components
import Label from '../../components/Label';
import Image from '../../components/Image';


// ----------------------------------------------------------------------

TestCard.propTypes = {
  product: PropTypes.object,
};

export default function TestCard({ test }) {
  const { name, status, cover } = test;
  const linkTo = `${PATH_LEARNING.test.root}/123`;

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
        <Image alt={name} src={cover} ratio="1/1" />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link to={linkTo} color="inherit" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Button>Làm ngay!</Button>
        </Stack>
      </Stack>
    </Card>
  );
}
