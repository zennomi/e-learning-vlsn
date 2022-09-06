import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// components
import Iconify from '../../components/Iconify';
import { IconButtonAnimate } from '../../components/animate';
// @mui
import {
    Autocomplete,
    Chip,
    Stack,
    TextField,
    Drawer,
    Tooltip,
    Container,
    Grid,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import {
    FormProvider,
    RHFSelect,
    RHFTextField,
    RHFSwitch,
} from '../../components/hook-form';
// utils
import paramsToObject from '../../utils/urlParamsHelper';
import { TEST_TAG_OPTION } from '../../constants';

const SORT_OPTION = [
    { name: 'Ngày thêm', value: 'createdAt:desc' },
    { name: 'Tựa đề', value: 'name:asc' },
]

export default function FilterDrawer({ isOpen, onClose, setNewParams }) {
    const isDesktop = useResponsive('up', 'sm');
    const { enqueueSnackbar } = useSnackbar();
    const [searchParams, setSearchParams] = useSearchParams();

    const currentFilter = paramsToObject(searchParams);
    if (currentFilter.tags) currentFilter.tags = currentFilter.tags.split(",");

    const defaultValues = useMemo(
        () => ({
            name: currentFilter?.name || '',
            tags: currentFilter?.tags || [],
            isPublic: currentFilter?.isPublic || false,
            grade: currentFilter?.grade || 12,
            sortBy: currentFilter?.sortBy || 'score:desc',
        }),
        [currentFilter]
    );

    const FilterSchema = Yup.object().shape({

    });

    const methods = useForm({
        resolver: yupResolver(FilterSchema),
        defaultValues,
    });

    const {
        reset,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        reset(defaultValues);
    }, [searchParams]);

    const onSubmit = async (filter) => {
        if (filter.tags.length > 0) filter.tags = filter.tags.join(",");
        setNewParams(filter);
        enqueueSnackbar('Áp dụng bộ lọc!');
        onClose();
    };

    return (
        <Drawer open={isOpen} onClose={onClose} anchor="right" PaperProps={{ sx: { width: { xs: 1, sm: 480 }, py: 5 } }}>
            <Container>
                {!isDesktop && (
                    <>
                        <Tooltip title="Back">
                            <IconButtonAnimate onClick={onClose} sx={{ mr: 1 }}>
                                <Iconify icon={'eva:arrow-ios-back-fill'} width={20} height={20} />
                            </IconButtonAnimate>
                        </Tooltip>
                    </>
                )}
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={1}>
                        <RHFTextField name="name" label="Tên đề" />
                        <div>
                            <RHFSelect name="grade" label="Hình thức">
                                <option value={12}>Lớp 12</option>
                                <option value={11}>Lớp 11</option>
                                <option value={10}>Lớp 10</option>
                            </RHFSelect>
                        </div>
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
                                            <Chip color="success" {...getTagProps({ index })} key={option} size="small" label={option} />
                                        ))
                                    }
                                    renderInput={(params) => <TextField label="Có tag" {...params} />}
                                />
                            )}
                        />
                        <RHFSelect name="sortBy" label="Xếp theo">
                            {SORT_OPTION.map(({ name, value }) => (
                                <option value={value}>{name}</option>
                            ))}
                        </RHFSelect>
                        <div>
                            <Grid container spacing={0.5}>
                                <Grid item xs={6}>
                                    <RHFSwitch name="isPublic" label="Có công bố đáp án" />
                                </Grid>
                            </Grid>
                        </div>
                        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                            {"Lọc & Sắp xếp"}
                        </LoadingButton>
                    </Stack>
                </FormProvider>
            </Container>
        </Drawer>
    )
}