import { useState } from 'react';
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
// sections
import QuestionUpdateForm from '../sections/question/QuestionUpdateForm';
// redux
import { useDispatch, useSelector } from '../redux/store';
import { addQuestion, removeQuestion } from '../redux/slices/createTest';
// paths
import { PATH_LEARNING } from '../routes/paths';

export default function QuestionToolbar({ question }) {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const { questions } = useSelector((state) => state.createTest);

    const [formOpen, setFormOpen] = useState(false);

    const ToggleQuestionBtn = questions.includes(question.id) ?
        <Button startIcon={<Iconify icon="eva:minus-circle-fill" />} size="small" color="warning" variant="contained" onClick={() => dispatch(removeQuestion(question.id))}>Loại khỏi giỏ câu hỏi</Button>
        : <Button startIcon={<Iconify icon="eva:plus-circle-fill" />} size="small" color="secondary" variant="contained" onClick={() => dispatch(addQuestion(question.id))} >Thêm vào giỏ câu hỏi</Button>
    const handleFormOpen = () => {
        setFormOpen(true);
    }
    const handleFormClose = () => {
        setFormOpen(false);
    }

    return (
        <>
            <Stack spacing={1} direction="row" sx={{ mb: 1 }}>
                {user.isStaff &&
                    <>
                        {ToggleQuestionBtn}
                        <Button size="small" variant="contained" color="secondary" startIcon={<Iconify icon="clarity:edit-solid" />} component={RouterLink} to={`${PATH_LEARNING.question.root}/${question.id}/cap-nhat`} >Sửa</Button>
                        <Button
                            size="small"
                            variant="contained"
                            color="secondary"
                            startIcon={<Iconify icon="clarity:edit-solid" />}
                            onClick={handleFormOpen}
                        >
                            Cập nhật nhanh
                        </Button>
                    </>
                }
                <Button startIcon={<Iconify icon="eva:eye-fill" />} size="small" variant="contained" component={RouterLink} to={"/hoc-tap/cau-hoi/" + question._id}>Xem chi tiết</Button>
            </Stack>
            {
                formOpen &&
                <QuestionUpdateForm currentQuestion={question} handleFormClose={handleFormClose}/>
            }
        </>

    )
}