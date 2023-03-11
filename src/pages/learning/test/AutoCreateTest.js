import * as Yup from 'yup';
import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Container, Card, Stack, CardContent, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_LEARNING } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { addQuestions } from '../../../redux/slices/createTest';
// components
import Page from '../../../components/Page';
import { FormProvider } from '../../../components/hook-form';
import Question from '../../../components/Question';
// utils
import axiosInstance from '../../../utils/axios';
//
import PickTopicAndLevel from '../../../sections/test/PickTopicAndLevel';

// ----------------------------------------------------------------------

export default function AutoCreateTest({ isEdit, currentInvoice }) {
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { questions } = useSelector((state) => state.createTest);

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);

  const [matchedQuestions, setMatchedQuestions] = useState([]);

  const NewUserSchema = Yup.object().shape({});

  const defaultValues = useMemo(
    () => ({
      criterias: currentInvoice?.criterias || [{ topic: '', quantity: 0, level: 0 }],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentInvoice]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentInvoice) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentInvoice]);


  const handleReset = async () => {
    reset();
    setMatchedQuestions([]);
  };

  const handleCreateAndSend = async () => {
    setLoadingSend(true);
    try {
      console.log(values);
      const { data: matchedResults } = await axiosInstance({
        method: 'post',
        url: '/v1/questions/random',
        data: values.criterias,
      });
      //   reset();
      setMatchedQuestions(matchedResults);
      setLoadingSend(false);
      enqueueSnackbar('Đã chọn ra ngẫu nhiên các câu hỏi phù hợp tiêu chí!');
    } catch (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  };

  const handleSaveAndNavigate = () => {
    dispatch(addQuestions(matchedQuestions.map((q) => q._id)));
    navigate(PATH_LEARNING.test.create)
  };

  return (
    <Page title="Tạo đề tự động">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <FormProvider methods={methods}>
          <Card>
            <PickTopicAndLevel />
          </Card>

          <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
            <LoadingButton
              color="inherit"
              size="large"
              variant="contained"
              loading={loadingSave && isSubmitting}
              onClick={handleReset}
            >
              Reset các tiêu chí
            </LoadingButton>

            <LoadingButton
              size="large"
              variant="contained"
              loading={loadingSend && isSubmitting}
              onClick={handleSubmit(handleCreateAndSend)}
            >
              Tìm kiếm
            </LoadingButton>
          </Stack>
        </FormProvider>
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Stack>
              {matchedQuestions.map((question) => (
                <Question question={question} key={question._id} />
              ))}
              {matchedQuestions.length > 0 && (
                <Button size="large" fullWidth onClick={handleSaveAndNavigate} variant="contained">
                  Thêm vào giỏ câu hỏi và chuyển tới trang tạo đề
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}
