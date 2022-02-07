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
  const { name, status, grade, time } = test;
  const linkTo = `${PATH_LEARNING.test.root}/${test._id}`;

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
        <Image alt={name} src={`http://lamdevlsn.herokuapp.com/img/cover/${grade}.png`} ratio="1/1" />
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
