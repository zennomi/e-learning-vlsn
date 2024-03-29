import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { uniqBy } from 'lodash';

// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Chip, Grid, Stack, TextField, Typography, Autocomplete, InputAdornment } from '@mui/material';
// redux
import { useDispatch } from '../../redux/store';
import { setQuestions } from '../../redux/slices/createTest';
// routes
import { PATH_LEARNING } from '../../routes/paths';
// components
import { FormProvider, RHFSelect, RHFEditor, RHFTextField, RHFSwitch } from '../../components/hook-form';

// sections
import TestDragAndDrop from './TestDragAndDrop';

// utils
import axiosInstance from '../../utils/axios';

import { TEST_TAG_OPTION } from '../../constants';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtest2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

TestNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentTest: PropTypes.object,
  testSubmit: PropTypes.func,
};

export default function TestNewForm({ isEdit, currentTest }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const TestSchema = Yup.object().shape({
    name: Yup.string().required('Cần tên đề'),
    questions: Yup.array().min(1, 'Cần ít nhất 5 câu'),
    time: Yup.number().min(5, 'Ít nhất 5 phút'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentTest?.name || '',
      questions: currentTest?.questions || [],
      time: currentTest?.time || 50,
      tags: currentTest?.tags || [],
      note: currentTest?.note || '',
      pdfURL: currentTest?.pdfURL || '',
      videoURL: currentTest?.videoURL || '',
      grade: currentTest?.grade || 12,
      isPublic: currentTest?.isPublic || false,
      isShuffled: currentTest?.isShuffled || false,
      isSorted: currentTest?.isSorted || false,
      showKeyMode: currentTest?.showKeyMode || 0,
    }),
    [currentTest]
  );

  const methods = useForm({
    resolver: yupResolver(TestSchema),
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
    if (isEdit && currentTest) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentTest]);

  const onSubmit = async (data) => {
    try {
      let id;
      data.questions = data.questions.map((t) => t.id);
      console.log(data);
      if (isEdit) {
        const {
          data: { id: _id },
        } = await axiosInstance({
          url: `/v1/tests/${currentTest.id}`,
          method: 'patch',
          data,
        });
        id = _id;
      } else {
        const {
          data: { id: _id },
        } = await axiosInstance({
          url: '/v1/tests',
          method: 'post',
          data,
        });
        id = _id;
        dispatch(setQuestions([]))
      }
      enqueueSnackbar(!isEdit ? 'Tạo thành công!' : 'Cập nhật thành công!');
      navigate(`${PATH_LEARNING.test.root}/${id}`);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error, { color: 'error' });
    }
  };

  const handleDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newItems = reorder(values.questions, result.source.index, result.destination.index);
    setValue('questions', newItems);
  };

  // const handleAddButtonClick = (questions) => {
  //   setValue('questions', uniqBy([...values.questions, ...questions], 'id'));
  // };

  const handleRemoveButtonClick = (questionId) => {
    const updateQuestions = values.questions.filter((t) => t.id !== questionId);
    if (!isEdit) {
      dispatch(setQuestions(updateQuestions.map((q) => q.id)));
    }
    setValue('questions', updateQuestions);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={1}>
              <RHFTextField name="name" label="Tên đề" />
              <div>
                <LabelStyle>Ghi chú đề</LabelStyle>
                <RHFEditor simple name="note" placeholder="Ghi chú dành cho học sinh" />
              </div>
            </Stack>
          </Card>
          <TestDragAndDrop
            questions={values.questions}
            handleDragEnd={handleDragEnd}
            handleRemoveButtonClick={handleRemoveButtonClick}
          />
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
                <RHFSelect name="showKeyMode" label="Chế độ hiện đáp án">
                  <option value={0}>Chỉ hiện điểm</option>
                  <option value={1}>Hiện điểm và câu sai</option>
                  <option value={2}>Hiện điểm và tất cả đáp án</option>
                </RHFSelect>
                <RHFSwitch name="isPublic" label="Công khai đề" />
                <RHFSwitch name="isShuffled" label="Trộn đề" />
                <RHFSwitch name="isSorted" label="Sắp xếp theo độ khó" />
                <RHFTextField
                  name="time"
                  label="Thời gian"
                  placeholder="0"
                  value={getValues('time') === 0 ? '' : getValues('time')}
                  onChange={(event) => setValue('time', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">phút</InputAdornment>,
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
                      options={TEST_TAG_OPTION.map((option) => option)}
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
            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Tạo đề mới' : 'Lưu thay đổi'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
