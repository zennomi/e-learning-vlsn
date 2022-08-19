import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo } from 'react';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Button, Chip, Grid, Stack, TextField, Typography, Autocomplete, InputAdornment, } from '@mui/material';

// components
import {
    FormProvider,
    RHFSelect,
    RHFTextField,
    RHFSwitch
} from '../../components/hook-form';
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

QuestionUpdateForm.propTypes = {
    currentQuestion: PropTypes.object,
};

export default function QuestionUpdateForm({ currentQuestion, handleFormClose }) {
    const { enqueueSnackbar } = useSnackbar();

    const QuestionSchema = Yup.object().shape({

    });

    const defaultValues = useMemo(
        () => ({
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
        if (currentQuestion) reset(defaultValues);
    }, [currentQuestion]);

    const onSubmit = async (data) => {
        try {
            console.log(data);
            // return;
            await axiosInstance({
                url: `/v1/questions/${currentQuestion.id}`,
                method: 'patch',
                data
            })
            enqueueSnackbar('Sẽ được cập nhật sau 5 phút!');
            handleFormClose();
        } catch (error) {
            console.error(error);
            enqueueSnackbar(error, { color: 'error' });
        }
    };

    return (
        <FormProvider methods={methods} >
            <Grid container spacing={1} sx={{ my: 1 }}>
                <Grid item xs={12} md={2}>
                    <RHFSelect name="grade">
                        <option value={10}>Lớp 10</option>
                        <option value={11}>Lớp 11</option>
                        <option value={12}>Lớp 12</option>
                    </RHFSelect>
                </Grid>
                <Grid item xs={12} md={2}>
                    <RHFTextField
                        name="level"
                        label="Độ khó"
                        placeholder="Thang điểm 0 - 10"
                        value={values.level}
                        onChange={(event) => { setValue('level', Number(event.target.value)); console.log(Number(event.target.value)) }}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">điểm</InputAdornment>,
                            type: 'number',
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={8}>
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
                </Grid>
                <Grid item xs={12}>
                    <LoadingButton variant="contained" size="small" onClick={handleSubmit(onSubmit)} loading={isSubmitting}>
                        Lưu thay đổi
                    </LoadingButton>
                    <Button size="small" onClick={handleFormClose} sx={{ mx: 1 }}>
                        Đóng
                    </Button>
                </Grid>
            </Grid>
        </FormProvider>
    );
}