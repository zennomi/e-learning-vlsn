import { useState } from 'react';
// mui
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
// utils
import axios from '../../utils/axios';


export default function ProfileResult() {
  const [results, setResults] = useState([]);
  return (
    <>
      <Card>
        <CardHeader title={<Typography variant='h5'>Lịch sử làm bài</Typography>} />
        <CardContent>
          
        </CardContent>
      </Card>
    </>
  )
}
