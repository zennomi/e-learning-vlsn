// @mui
import { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import DepositCard from 'src/sections/admin/DepositCard';
// api
import { getDeposts, verifyDeposit } from 'src/api/deposit';
// ----------------------------------------------------------------------

export default function VerifyDepost() {
    const { themeStretch } = useSettings();
    const [deposits, setDeposits] = useState([]);

    const handleVerify = async (id) => {
        await verifyDeposit(id);
        await getDepostsCallback();
    }

    const getDepostsCallback = async () => {
        try {
            const { results } = await getDeposts({ isVerified: false, populate: 'user' });
            setDeposits(results);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(async () => {
        getDepostsCallback();
    }, [])
    return (
        <Page title="Bảng điều khiển của Admin">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Grid container>
                    {
                        deposits.map(deposit => <DepositCard deposit={deposit} onVerify={() => handleVerify(deposit.id)} />)
                    }
                </Grid>
            </Container>
        </Page >
    );
}
