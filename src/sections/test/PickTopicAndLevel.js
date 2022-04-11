// form
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { sumBy } from 'lodash';
// @mui
import {
  Box,
  Stack,
  Button,
  Divider,
  Typography,
  Autocomplete,
  TextField,
} from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import { RHFTextField } from '../../components/hook-form';
import { QUESTION_TAG_OPTION } from '../../constants';
// ----------------------------------------------------------------------

export default function PickTopicAndLevel() {
  const { control, setValue, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'criterias',
  });

  const values = watch();

  const handleAdd = () => {
    append({ topic: '', quantity: 0, level: 0 });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Chọn chuyên đề, số câu và độ khó:
      </Typography>

      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {fields.map((item, index) => (
          <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
              <Controller
                name={`criterias[${index}].topic`}
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    fullWidth
                    size="small"
                    freeSolo
                    onInputChange={(event, newValue) => field.onChange(newValue)}
                    options={QUESTION_TAG_OPTION.map((option) => option)}
                    renderInput={(params) => (
                      <TextField
                        label="Chủ đề"
                        InputLabelProps={{ shrink: true }}
                        SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                        {...params}
                      />
                    )}
                  />
                )}
              />

              <RHFTextField
                size="small"
                type="number"
                name={`criterias[${index}].quantity`}
                label="Số câu"
                onChange={(event) => setValue(`criterias[${index}].quantity`, Number(event.target.value))}
                sx={{ maxWidth: { md: 160 } }}
              />

              <RHFTextField
                size="small"
                type="number"
                name={`criterias[${index}].level`}
                label="Độ khó"
                onChange={(event) => setValue(`criterias[${index}].level`, Number(event.target.value))}
                sx={{ maxWidth: { md: 160 } }}
              />
            </Stack>

            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="eva:trash-2-outline" />}
              onClick={() => handleRemove(index)}
            >
              Xoá
            </Button>
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
          Thêm chuyên đề khác
        </Button>

        <Stack spacing={2} justifyContent="flex-end" direction={{ xs: 'column', md: 'row' }} sx={{ width: 1 }}>
          <Typography>Số câu: {sumBy(values.criterias, 'quantity')}</Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
