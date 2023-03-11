import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { Grid, Card, Stack, Typography, InputAdornment } from '@mui/material';
// routes
import { PATH_LEARNING } from '../../routes/paths';
// components
import { RHFSwitch, RHFEditor, FormProvider, RHFTextField, RHFSelect } from '../../components/hook-form';
// sections
import CourseNewDetails from './CourseNewDetails';
// utils
import axiosInstance from '../../utils/axios';
// constants


// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

export default function CourseNewForm({ isEdit, currentCourse }) {
    const navigate = useNavigate();

    const { enqueueSnackbar } = useSnackbar();

    const NewCourseSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        description: Yup.string().required('Description is required'),
        coverURL: Yup.string().required('Url is required'),
        components: Yup.array().min(1),
        price: Yup.number().min(0)
    });

    const defaultValues = useMemo(() => ({
        title: currentCourse?.title || '',
        description: currentCourse?.description || '',
        tags: currentCourse?.tags || [],
        isPublic: currentCourse?.isPublic || false,
        coverURL: currentCourse?.coverURL || '',
        grade: currentCourse?.grade || 12,
        components: currentCourse?.components || [{ type: 'video', idType: '' }],
        price: currentCourse?.price || 0,
        priceSale: currentCourse?.priceSale || 0,
        isSale: currentCourse?.isSale || false
    }), [currentCourse]);

    const methods = useForm({
        resolver: yupResolver(NewCourseSchema),
        defaultValues,
    });

    const {
        reset,
        getValues,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;


    const [nullVideoIds, setNullVideoIds] = useState([]);
    const [nullTestIds, setNullTestIds] = useState([]);

    useEffect(() => {
        if (isEdit && currentCourse) {
            reset(defaultValues);
        }
        if (!isEdit) {
            reset(defaultValues);
        }
    }, [isEdit, currentCourse]);

    const onSubmit = async (data) => {
        if (!data.isSale) data.priceSale = null;
        const components = data.components.map((c, index) => ({ ...c, id: c.idType, index }));
        data.videos = components.filter(c => c.type === 'video');
        data.tests = components.filter(c => c.type === 'test');
        console.log(data);

        try {
            let id;
            if (isEdit) {
                const {
                    data: { id: _id },
                } = await axiosInstance({
                    url: `/v1/courses/${currentCourse.id}`,
                    method: 'patch',
                    data,
                });
                id = _id;
            } else {
                const {
                    data: { id: _id },
                } = await axiosInstance({
                    url: '/v1/courses',
                    method: 'post',
                    data,
                });
                id = _id;
            }
            reset();
            enqueueSnackbar(!isEdit ? 'Tạo thành công!' : 'Cập nhật thành công!');
            navigate(PATH_LEARNING.course.view(id));
        } catch (error) {
            enqueueSnackbar("Đã có lỗi xảy ra!", { variant: 'error' });
            if (error.videos) setNullVideoIds(error.videos);
            if (error.tests) setNullTestIds(error.tests);
            console.error(error);
        }
    };

    return (
        <>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Stack spacing={3}>
                            <Card sx={{ p: 3 }}>
                                <Stack spacing={3}>
                                    <RHFTextField name="title" label="Tiêu đề khoá học" />
                                    <div>
                                        <LabelStyle>Mô tả</LabelStyle>
                                        <RHFEditor name="description" />
                                    </div>
                                    <RHFTextField name="coverURL" label="Link ảnh khoá học" />
                                </Stack>
                            </Card>
                            <Card sx={{ p: 3 }}>
                                <CourseNewDetails nullVideoIds={nullVideoIds} nullTestIds={nullTestIds} />
                            </Card>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card sx={{ p: 3 }}>
                            <Stack spacing={3}>
                                <div>
                                    <RHFSwitch
                                        name="isPublic"
                                        label="Công khai khoá học"
                                        labelPlacement="start"
                                        sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
                                    />
                                </div>

                                <RHFSelect name="grade">
                                    <option value={10}>Lớp 10</option>
                                    <option value={11}>Lớp 11</option>
                                    <option value={12}>Lớp 12</option>
                                </RHFSelect>
                            </Stack>
                        </Card>
                        <Card sx={{ p: 3 }}>
                            <Stack spacing={3} mb={2}>
                                <RHFTextField
                                    name="price"
                                    label="Regular Price"
                                    placeholder="0.00"
                                    value={getValues('price') === 0 ? '' : getValues('price')}
                                    onChange={(event) => setValue('price', Number(event.target.value))}
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                                        type: 'number',
                                    }}
                                />

                                <RHFTextField
                                    name="priceSale"
                                    disabled={!getValues('isSale')}
                                    label="Sale Price"
                                    placeholder="0.00"
                                    value={getValues('priceSale') === 0 ? '' : getValues('priceSale')}
                                    onChange={(event) => setValue('price', Number(event.target.value))}
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                                        type: 'number',
                                    }}
                                />

                                <RHFSwitch
                                    name="isSale"
                                    label="Có giảm giá"
                                    labelPlacement="start"
                                    sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
                                />
                            </Stack>
                        </Card>
                        <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                            <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
                                {isEdit ? "Cập nhật" : "Tạo mới"}
                            </LoadingButton>
                        </Stack>
                    </Grid>
                </Grid>
            </FormProvider>
        </>
    );
}
