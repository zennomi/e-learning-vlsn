import { Card, CardContent, CardHeader, Typography, Stack } from "@mui/material";
import { useFormContext } from "react-hook-form"
import CopyClipboard from "src/components/CopyClipboard";
import { RHFRadioGroup } from "../../components/hook-form"

const METHODS = {
    "MB BANK": {
        name: "MB Bank",
        ownerName: "Phạm Quốc Huy",
        number: "0365206368"
    },
    "MOMO": {
        name: "Momo",
        ownerName: "Phạm Quốc Huy",
        number: "0365206368"
    }
}

export default function DepositAmount() {
    const { watch } = useFormContext();
    const { method } = watch();
    const user = { displayName: "Nguyễn Ngọc Tuân" }
    return (
        <Stack spacing={2} sx={{ maxWidth: { md: "80%", xs: "100%" }, mx: 'auto' }}>
            <Typography>Vui lòng chọn phương thức thanh toán</Typography>
            <RHFRadioGroup name="method" options={Object.keys(METHODS)} />
            <MethodCard method={METHODS[method]} />
            <Typography>Và chuyển khoản tới tài khoản trên với nội dung</Typography>
            <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                    <pre>{user.displayName}</pre>
                </CardContent>
            </Card>
        </Stack>
    )
}

function MethodCard({ method }) {
    return (
        <Card >
            <CardHeader title={method.name} />
            <CardContent>
                <Typography>{method.ownerName}</Typography>
                <CopyClipboard value={method.number} disabled />
            </CardContent>
        </Card>
    )
}