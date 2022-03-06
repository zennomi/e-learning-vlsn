// @mui
import { Stack, Button, Typography } from '@mui/material';
// assets
import { DocIllustration } from '../../../assets';
import { PRODUCT_NAME } from '../../../config';
// ----------------------------------------------------------------------

export default function NavbarDocs() {
  return (
    PRODUCT_NAME === 'vlsn' &&
    <Stack spacing={3} sx={{ px: 5, pb: 5, mt: 10, width: 1, textAlign: 'center', display: 'block' }}>
      <DocIllustration sx={{ width: 1 }} />
      <div>
        <Typography gutterBottom variant="subtitle1">
          Yahallo~
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Web Làm Đề VLSN 2.0?
          <br /> Web mới nên dễ xảy ra lỗi mong các bạn thông cảm
        </Typography>
      </div>

      <Button variant="contained" href="https://www.facebook.com/VatLySieuNham" target="_blank" component="a">VLSN</Button>
    </Stack>
  );
}
