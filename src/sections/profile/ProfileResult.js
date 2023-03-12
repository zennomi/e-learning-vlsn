// mui
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
// sections
import ResultTable from './ResultTable';


export default function ProfileResult() {
  return (
    <>
      <Card>
        <CardHeader title={<Typography variant='h5'>Lịch sử làm bài</Typography>} />
        <CardContent>
          <ResultTable />
        </CardContent>
      </Card>
    </>
  )
}
