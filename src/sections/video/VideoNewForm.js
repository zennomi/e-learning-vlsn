import * as Yup from 'yup';
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { Grid, Card, Chip, Stack, Button, TextField, Typography, Autocomplete } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_LEARNING } from '../../routes/paths';
// components
import { RHFSwitch, RHFEditor, FormProvider, RHFTextField, RHFSelect } from '../../components/hook-form';
// utils
import axiosInstance from '../../utils/axios';
// constants
import { TEST_TAG_OPTION } from '../../constants';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

export default function BlogNewPostForm({ isEdit, currentVideo }) {
    const navigate = useNavigate();

    const { enqueueSnackbar } = useSnackbar();

    const NewBlogSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        description: Yup.string().required('Description is required'),
        url: Yup.string().required('Url is required'),
    });

    const defaultValues = {
        title: currentVideo?.title || '',
        description: currentVideo?.description || '',
        tags: currentVideo?.tags || [],
        isPublic: currentVideo?.isPublic || false,
        url: currentVideo?.url || '',
        grade: currentVideo?.grade || 12
    };

    const methods = useForm({
        resolver: yupResolver(NewBlogSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting, isValid },
    } = methods;

    const values = watch();

    useEffect(() => {
        if (isEdit && currentVideo) {
            reset(defaultValues);
        }
        if (!isEdit) {
            reset(defaultValues);
        }
    }, [isEdit, currentVideo]);

    const onSubmit = async (data) => {
        console.log(data);
        try {
            let id;
            if (isEdit) {
                const {
                    data: { id: _id },
                } = await axiosInstance({
                    url: `/v1/videos/${currentVideo.id}`,
                    method: 'patch',
                    data,
                });
                id = _id;
            } else {
                const {
                    data: { id: _id },
                } = await axiosInstance({
                    url: '/v1/videos',
                    method: 'post',
                    data,
                });
                id = _id;
            }
            reset();
            enqueueSnackbar(!isEdit ? 'Tạo thành công!' : 'Cập nhật thành công!');
            navigate(`${PATH_LEARNING.video.root}/${id}`);
        } catch (error) {
            enqueueSnackbar(error, { color: 'error' });
        }
    };

    return (
        <>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card sx={{ p: 3 }}>
                            <Stack spacing={3}>
                                <RHFTextField name="title" label="Post Title" />

                                <div>
                                    <LabelStyle>Mô tả</LabelStyle>
                                    <RHFEditor name="description" />
                                </div>
                                <RHFTextField name="url" label="Link Video" />
                                <ReactPlayer url={values.url} />
                            </Stack>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card sx={{ p: 3 }}>
                            <Stack spacing={3}>
                                <div>
                                    <RHFSwitch
                                        name="isPublic"
                                        label="Công khai video"
                                        labelPlacement="start"
                                        sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
                                    />
                                </div>

                                <RHFSelect name="grade">
                                    <option value={10}>Lớp 10</option>
                                    <option value={11}>Lớp 11</option>
                                    <option value={12}>Lớp 12</option>
                                </RHFSelect>

                                <Controller
                                    name="tags"
                                    control={control}
                                    render={({ field }) => (
                                        <Autocomplete
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

                        <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                            <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
                                Post
                            </LoadingButton>
                        </Stack>
                    </Grid>
                </Grid>
            </FormProvider>
        </>
    );
}
