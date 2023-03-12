import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
// @mui
import { styled } from '@mui/material/styles';

import { Container, Box, Stepper, Step, StepLabel, StepConnector, Stack, Button } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import DepositAmount from 'src/sections/deposit/DepositAmount';
import DepositMethod from 'src/sections/deposit/DepositMethod';
import DepositPending from 'src/sections/deposit/DepositPending';
import { FormProvider } from '../components/hook-form';
import { createDeposit } from 'src/api/deposit';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

const STEPS = ["Số tiền cần nạp", "Chuyển khoản", "Chờ xác nhận"];

export default function Deposit() {
  const { themeStretch } = useSettings();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();


  const schema = yup.object().shape({
    amount: yup.number().moreThan(9999, "Số tiền nạp nhỏ nhất là 10,000VNĐ").required(),
  }).required();

  const methods = useForm({
    defaultValues: {
      amount: 10000,
      method: "MB_BANK"
    },
    resolver: yupResolver(schema)
  });

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  const handleNextStep = async (step) => {
    if (step === 0) {
      const ok = await methods.trigger('amount', { shouldFocus: true });
      if (ok) setActiveStep(1);
    } else if (step === 1) {
      setIsLoading(true);
      const ok = await methods.trigger();
      if (ok)
        await createDeposit({ amount: methods.getValues('amount'), user: user.id, method: methods.getValues('method'), })
      setActiveStep(2);
    }
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
            {activeStep === 1 && <DepositMethod content={user.displayName} />}
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
                onClick={async () => { handleNextStep(activeStep) }}
                isLoading={isLoading}
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
