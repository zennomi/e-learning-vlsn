// form
import { useFormContext, useFieldArray } from 'react-hook-form';
// @mui
import { Box, Stack, Button, Divider, Typography, MenuItem } from '@mui/material';
// utils
// components
import Iconify from '../../components/Iconify';
import { RHFSelect, RHFTextField } from '../../components/hook-form';

// ----------------------------------------------------------------------

const SERVICE_OPTIONS = [
    'video',
    'test'
];

export default function CourseNewDetails({ nullVideoIds, nullTestIds }) {
    const { control, watch } = useFormContext();

    const { fields, append, remove, swap } = useFieldArray({
        control,
        name: 'components',
    });

    const values = watch();

    const handleAdd = () => {
        append({
            type: 'video',
            idType: '',
        });
    };

    const handleMove = (from, to) => {
        swap(from, to);
    }

    const handleRemove = (index) => {
        remove(index);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
                Chi tiết:
            </Typography>

            <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
                {fields.map((item, index) => (
                    <Stack key={index} alignItems="flex-end" spacing={1.5}>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                            <RHFTextField
                                size="small"
                                name={`components[${index}].idType`}
                                label="ID"
                                InputLabelProps={{ shrink: true }}
                                error={values.components[index].type === "video" ? nullVideoIds.includes(values.components[index].idType)
                                    : nullTestIds.includes(values.components[index].idType)}
                                helperText={(values.components[index].type === "video" ? nullVideoIds.includes(values.components[index].idType)
                                : nullTestIds.includes(values.components[index].idType)) && "ID này không tồn tại"}
                            />

                            <RHFSelect
                                name={`components[${index}].type`}
                                label="Loại"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                                sx={{ maxWidth: { md: 160 } }}
                            >
                                <Divider />
                                {SERVICE_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option}
                                        value={option}
                                        sx={{
                                            mx: 1,
                                            my: 0.5,
                                            borderRadius: 0.75,
                                            typography: 'body2',
                                            textTransform: 'capitalize',
                                        }}
                                    >
                                        {option}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            {
                                index > 0 &&
                                <Button
                                    size="small"
                                    color="info"
                                    startIcon={<Iconify icon="eva:arrow-up-fill" />}
                                    onClick={() => handleMove(index, index - 1)}
                                >
                                    Lên
                                </Button>
                            }
                            {
                                index < fields.length - 1 &&
                                <Button
                                    size="small"
                                    color="info"
                                    startIcon={<Iconify icon="eva:arrow-down-fill" />}
                                    onClick={() => handleMove(index, index + 1)}
                                >
                                    Xuống
                                </Button>
                            }
                            <Button
                                size="small"
                                color="error"
                                startIcon={<Iconify icon="eva:trash-2-outline" />}
                                onClick={() => handleRemove(index)}
                            >
                                Xoá
                            </Button>
                        </Stack>
                    </Stack>
                ))}
            </Stack>

            <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

            <Stack
                spacing={2}
                direction={{ xs: 'column-reverse', md: 'row' }}
                alignItems={{ xs: 'flex-start', md: 'center' }}
            >
                <Button size="small" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleAdd} sx={{ flexShrink: 0 }}>
                    Thêm học phần mới
                </Button>
            </Stack>
        </Box>
    );
}
