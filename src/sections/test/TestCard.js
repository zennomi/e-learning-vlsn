import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Card, Link, Typography, Stack } from '@mui/material';
// routes
import { PATH_LEARNING } from '../../routes/paths';
// components
import Label from '../../components/Label';
// assets
import Cover from '../../assets/illustration_doc';

// ----------------------------------------------------------------------

TestCard.propTypes = {
  product: PropTypes.object,
};

export default function TestCard({ test }) {
  const { name, status, grade, time } = test;
  const linkTo = `${PATH_LEARNING.test.root}/${test.id}`;

  return (
    <Card>
      <Box sx={{ position: 'relative' }}>
        {grade && (
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
            {`Lớp ${grade}`}
          </Label>
        )}
        {/* <Image alt={name} src={Cover} ratio="1/1" /> */}
        <Cover />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link to={linkTo} color="inherit" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Label>{`${time} phút`}</Label>
        </Stack>
      </Stack>
    </Card>
  );
}
