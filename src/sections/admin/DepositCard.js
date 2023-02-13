import { Card, CardContent, Typography, Button } from "@mui/material";
import { fCurrency } from "src/utils/formatNumber";
import { fDateTime } from "src/utils/formatTime";

export default function DepositCard({ deposit, onVerify }) {
    return (
        <Card>
            <CardContent>
                <Typography>{deposit.user.displayName}</Typography>
                <Typography>{fCurrency(deposit.amount)}</Typography>
                <Typography>{fDateTime(deposit.createdAt)}</Typography>
                <Button onClick={onVerify}>Xác nhận</Button>
            </CardContent>
        </Card>
    )
}