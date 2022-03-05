import { Link as RouterLink } from 'react-router-dom';
// mui
import {
    Stack,
    Button
} from "@mui/material";
// hooks
import useAuth from '../hooks/useAuth';
// components
import Iconify from './Iconify';
// redux
import { useDispatch, useSelector } from '../redux/store';
import { addQuestion, removeQuestion } from '../redux/slices/createTest';

export default function ({ question }) {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const { questions } = useSelector((state) => state.createTest);
    const ToggleQuestionBtn = questions.includes(question.id) ?
        <Button startIcon={<Iconify icon="eva:minus-circle-fill" />} size="small" color="warning" variant="contained" onClick={() => dispatch(removeQuestion(question.id))}>Loại khỏi giỏ câu hỏi</Button>
        : <Button startIcon={<Iconify icon="eva:plus-circle-fill" />} size="small" color="secondary" variant="contained" onClick={() => dispatch(addQuestion(question.id))} >Thêm vào giỏ câu hỏi</Button>

    return (
        <Stack spacing={1} direction="row" sx={{ mb: 1 }}>
            {user.isStaff && ToggleQuestionBtn}
            <Button startIcon={<Iconify icon="eva:eye-fill" />} size="small" variant="contained" component={RouterLink} to={"/hoc-tap/cau-hoi/" + question._id}>Xem chi tiết</Button>
        </Stack>

    )
}