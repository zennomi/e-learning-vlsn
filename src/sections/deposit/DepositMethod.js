import { Card, CardContent, CardHeader, Typography, Stack, Alert } from "@mui/material";
import { useFormContext } from "react-hook-form";
import CopyClipboard from "src/components/CopyClipboard";
import { RHFRadioGroup } from "../../components/hook-form"

const METHODS = {
    "MB_BANK": {
        name: "MB Bank",
        ownerName: "Phạm Quốc Huy",
        number: "0365206368"
    },
    "BIDV": {
        name: "BIDV",
        ownerName: "Hoàng Hùng Cường",
        number: "45010006633246"
    }
}

export default function DepositAmount({ content }) {
    const { watch } = useFormContext();
    const { method } = watch();
    return (
        <Stack spacing={2} sx={{ maxWidth: { md: "80%", xs: "100%" }, mx: 'auto' }}>
            <Typography>Vui lòng chọn phương thức thanh toán</Typography>
            <RHFRadioGroup name="method" options={Object.keys(METHODS)} />
            <MethodCard method={METHODS[method]} />
            <Typography>Và chuyển khoản tới tài khoản trên với nội dung</Typography>
            <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                    <pre>{content}</pre>
                </CardContent>
            </Card>
            <Alert>Sau khi chuyển khoản vui lòng bấm xác nhận</Alert>
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