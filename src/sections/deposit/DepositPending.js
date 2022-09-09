import { Alert, Box, Grid, Stack } from "@mui/material"
import LinkWidget from "src/components/LinkWidget"

export default function DepositPending() {
    return (
        <Stack spacing={2} sx={{ maxWidth: { md: "80%", xs: "100%" }, mx: 'auto' }}>
            <Alert>Giao dịch của bạn đang được chờ xác nhận! Chúc bạn học tập tốt!</Alert>
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <LinkWidget title="Hotline" icon="eva:phone-call-fill" description="0969142728" link="tel:+84969142728" />
                    </Grid>
                    <Grid item xs={6}>
                        <LinkWidget title="Fanpage" icon="eva:facebook-fill" description="Hỗ trợ 24/7" link="https//:facebook.com/VatLySieuNham" />
                    </Grid>
                </Grid>
            </div>
        </Stack >
    )
}