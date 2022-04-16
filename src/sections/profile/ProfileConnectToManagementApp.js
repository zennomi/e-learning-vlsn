import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Button, Link, Stack, Alert, IconButton, InputAdornment, Grid, Card, CardContent, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../hooks/useAuth';
import useIsMountedRef from '../../hooks/useIsMountedRef';
// components
import Iconify from '../../components/Iconify';
import { FormProvider, RHFTextField } from '../../components/hook-form';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const isMountedRef = useIsMountedRef();
  const { user } = useAuth();
  console.log(user);

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    username: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const { data: conntectedAccount } = await axios({
        url: '/v1/managementapp/connect',
        method: 'post',
        data,
      });
      window.location.reload();
    } catch (error) {
      console.error({ ...error });
      // reset();
      if (isMountedRef.current) {
        setError('afterSubmit', error);
      }
    }
  };

  return (
    <Grid container spacing={2}>
      {

        Boolean(user.managementAppAccount) &&
        <Grid item>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Alert severity="info">Đã kết nối với một tài khoản</Alert>
                <Typography>ID: {user.managementAppAccount.userId}</Typography>
                <Typography>ID: {user.managementAppAccount.userName}</Typography>
                <Typography>ID: {user.managementAppAccount.fullName}</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      }
      <Grid item>
        <Card>
          <CardContent>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                <Alert severity="info">Kết nối với tài khoản TCT để đồng bộ kết quả học tập.</Alert>
                {!!errors.afterSubmit && <Alert severity="error">Thông tin đăng nhập không chính xác.</Alert>}

                <RHFTextField name="username" label="Username" />

                <RHFTextField
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <LoadingButton
                  fullWidth
                  startIcon={<Iconify icon="eva:log-in-fill" />}
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Kết nối với TCT
                </LoadingButton>
              </Stack>
            </FormProvider>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
