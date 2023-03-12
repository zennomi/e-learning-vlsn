import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Chip, Grid, Stack, TextField, Typography, Autocomplete, InputAdornment, Modal, Button, CardContent, Container } from '@mui/material';
// routes
import { PATH_LEARNING } from '../../routes/paths';
// components
import {
  FormProvider,
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFSwitch
} from '../../components/hook-form';
import Scrollbar from '../../components/Scrollbar';
import QuestionPreview from './QuestionPreview';
// utils
import axiosInstance from '../../utils/axios';

import { QUESTION_TAG_OPTION } from '../../constants';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subquestion2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

QuestionNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentQuestion: PropTypes.object
};

export default function QuestionNewForm({ isEdit, currentQuestion }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [modalOpen, setModalOpen] = useState(false);

  const QuestionSchema = Yup.object().shape({
    question: Yup.string().required('Cần nội dung câu hỏi'),

  });

  const defaultValues = useMemo(
    () => ({
      question: currentQuestion?.question || '',
      choices: currentQuestion?.choices || Array(4).fill({ isTrue: false, content: "" }),
      answer: currentQuestion?.answer || "",
      tags: currentQuestion?.tags || [],
      grade: currentQuestion?.grade || 12,
      level: currentQuestion?.level || 11,
    }),
    [currentQuestion]
  );

  const methods = useForm({
    resolver: yupResolver(QuestionSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentQuestion) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentQuestion]);

  const onSubmit = async (data) => {
    try {
      let id;
      console.log(data);
      // return;
      if (isEdit) {
        const { data: { id: _id } } = await axiosInstance({
          url: `/v1/questions/${currentQuestion.id}`,
          method: 'patch',
          data
        })
        id = _id;
      } else {
        const { data: { id: _id } } = await axiosInstance({
          url: '/v1/questions',
          method: 'post',
          data
        })
        id = _id;
      }
      enqueueSnackbar(!isEdit ? 'Tạo thành công!' : 'Cập nhật thành công!');
      navigate(`${PATH_LEARNING.question.root}/${id}`);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error, { color: 'error' });
    }
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  }

  const handleModalClose = () => {
    setModalOpen(false);
  }

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={1}>
              <div>
                <LabelStyle>Nội dung câu hỏi</LabelStyle>
                <RHFEditor name="question" placeholder="Nội dung câu hỏi" />
              </div>
              <Grid container spacing={1}>
                {
                  [...Array(4)].map((_, index) => (
                    <Grid key={index} item xs={12} md={6}>
                      <Stack direction="row" spacing={1}>
                        <LabelStyle>{`Đáp án ${index + 1}`}</LabelStyle>
                        <RHFSwitch name={`choices.${index}.isTrue`} label="Đáp án đúng" />
                      </Stack>
                      <RHFEditor name={`choices.${index}.content`} placeholder={`Nội dung đáp án ${index + 1}`} />
                    </Grid>
                  ))
                }
              </Grid>

              <div>
                <LabelStyle>Lời giải chi tiết</LabelStyle>
                <RHFEditor name="answer" placeholder="Nội dung lời giải" />
              </div>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mt={2}>
                <RHFSelect name="grade">
                  <option value={10}>Lớp 10</option>
                  <option value={11}>Lớp 11</option>
                  <option value={12}>Lớp 12</option>
                </RHFSelect>
                <RHFTextField
                  name="level"
                  label="Độ khó"
                  placeholder="Thang điểm 0 - 10"
                  value={getValues('level')}
                  onChange={(event) => setValue('level', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">điểm</InputAdornment>,
                    type: 'number',
                  }}
                />
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      freeSolo
                      onChange={(event, newValue) => field.onChange(newValue)}
                      options={Object.keys(QUESTION_TAG_OPTION).map((option) => option)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                        ))
                      }
                      renderInput={(params) => <TextField label="Tags" {...params} />}
                    />
                  )}
                />
              </Stack>
            </Card>
            <Button variant="contained" size="large" onClick={handleModalOpen}>Xem trước</Button>
            <Button size="large" onClick={() => navigate(-1)}>Quay lại</Button>
          </Stack>
        </Grid>
      </Grid>
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
      >
        <Container maxWidth='lg' sx={{ my: 2 }}>
          <Scrollbar sx={{ maxHeight: "100vh" }}>
            <Card>
              <CardContent>
                <QuestionPreview question={values} showAnswer={true} />
                <LoadingButton variant="contained" fullWidth onClick={handleSubmit(onSubmit)} sx={{ mt: 1 }} loading={isSubmitting}>
                  {!isEdit ? 'Tạo đề mới' : 'Lưu thay đổi'}
                </LoadingButton>
                <Button fullWidth onClick={handleModalClose} sx={{ mt: 1 }}>Đóng</Button>
              </CardContent>
            </Card>
          </Scrollbar>
        </Container>
      </Modal>
    </FormProvider>
  );
}