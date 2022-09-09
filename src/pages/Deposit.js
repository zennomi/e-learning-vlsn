import { useState } from 'react';
import { useForm } from 'react-hook-form';
// @mui
import { styled } from '@mui/material/styles';

import { Container, Typography, Box, Stepper, Step, StepLabel, StepConnector, Stack, Button } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import DepositAmount from 'src/sections/deposit/DepositAmount';
import DepositMethod from 'src/sections/deposit/DepositMethod';
import DepositPending from 'src/sections/deposit/DepositPending';
import { FormProvider } from '../components/hook-form';

// ----------------------------------------------------------------------

const STEPS = ["Số tiền cần nạp", "Chuyển khoản", "Chờ xác nhận"];

export default function Deposit() {
  const { themeStretch } = useSettings();
  const [activeStep, setActiveStep] = useState(0);
  const methods = useForm({
    defaultValues: {
      amount: null,
      method: "MB BANK"
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  return (
    <Page title="Nạp tiền">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Stack spacing={2}>
          <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel
                  StepIconComponent={QontoStepIcon}
                  sx={{
                    '& .MuiStepLabel-label': {
                      typography: 'subtitle2',
                      color: 'text.disabled',
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          <FormProvider methods={methods} onSubmit={handleSubmit} >
            {activeStep === 0 && <DepositAmount />}
            {activeStep === 1 && <DepositMethod />}
            {activeStep === 2 && <DepositPending />}
          </FormProvider>
          {
            activeStep <= 1 &&
            <Stack direction="rows" justifyContent="space-around">
              <Button
                color="inherit"
                startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} />}
                disabled={activeStep < 1}
                onClick={() => { setActiveStep(activeStep - 1) }}
              >
                Quay lại
              </Button>
              <Button
                size="large"
                type="submit"
                variant="contained"
                onClick={() => { setActiveStep(activeStep + 1) }}
              >
                Xác nhận
              </Button>
            </Stack>
          }
        </Stack>
      </Container>
    </Page>
  );
}

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  top: 10,
  left: 'calc(-50% + 20px)',
  right: 'calc(50% + 20px)',
  '& .MuiStepConnector-line': {
    borderTopWidth: 2,
    borderColor: theme.palette.divider,
  },
  '&.Mui-active, &.Mui-completed': {
    '& .MuiStepConnector-line': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

function QontoStepIcon({ active, completed }) {
  return (
    <Box
      sx={{
        zIndex: 9,
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: active ? 'primary.main' : 'text.disabled',
      }}
    >
      {completed ? (
        <Iconify icon={'eva:checkmark-fill'} sx={{ zIndex: 1, width: 20, height: 20, color: 'primary.main' }} />
      ) : (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'currentColor',
          }}
        />
      )}
    </Box>
  );
}
