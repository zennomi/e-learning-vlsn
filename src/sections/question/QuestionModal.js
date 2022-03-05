import { memo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// mui
import {
    Button,
} from "@mui/material";
// sections
import QuestionPreview from './QuestionPreview';

export default memo(function ({ question }) {
    return (
        <>
            <Button fullWidth variant="contained" component={RouterLink} to={"/hoc-tap/cau-hoi/" + question._id}>Xem chi tiết</Button>
        </>
    )
})