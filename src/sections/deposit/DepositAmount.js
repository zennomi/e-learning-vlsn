import { Box } from "@mui/material"
import { RHFTextField } from "src/components/hook-form"

export default function DepositAmount() {
    return (
        <Box sx={{ maxWidth: { md: "80%", xs: "100%" }, mx: 'auto' }}>
            <RHFTextField name="amount" label="Số tiền muốn nạp" type="number" />
        </Box >
    )
}