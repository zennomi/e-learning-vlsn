import { Grid } from "@mui/material";
import TestCard from "./TestCard";

export default function TestList({ tests }) {
    return (
        <Grid container spacing={2}>
            {
                tests.map(t =>
                    <Grid item xs={6} md={3} key={t.id}>
                        <TestCard test={t}/>
                    </Grid>
                )
            }
        </Grid>
    )
}