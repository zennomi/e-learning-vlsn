import { Box, Card, CardContent, Stack } from "@mui/material"
import { RHFTextField } from "src/components/hook-form"
import { fCurrency } from "src/utils/formatNumber"
import { useFormContext } from "react-hook-form";

export default function DepositAmount() {
    const { watch } = useFormContext();
    const { amount } = watch();

    return (
        <Stack sx={{ maxWidth: { md: "80%", xs: "100%" }, mx: 'auto' }} spacing={2}>
            <RHFTextField name="amount" label="Số tiền muốn nạp" type="number" />
            <Card sx={{ textAlign: 'center' }}>
                <CardContent>
                    {
                        amount < 10000 ?
                            "Số tiền nạp phải lớn hơn 10,000VNĐ"
                            :
                            `Số tiền bạn muốn nạp là ${fCurrency(amount)}`
                    }
                </CardContent>
            </Card>
        </Stack >
    )
}