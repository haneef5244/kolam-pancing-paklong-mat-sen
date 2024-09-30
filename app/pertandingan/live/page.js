import { getLivePertandingan, getPertandinganLog } from "@/app/backend/actions/pertandingan";
import ViewPertandingan from "@/app/frontend/components/viewPertandingan";
import { Container, Grid, Typography } from "@mui/material";

export const revalidate = 1;
const PertandinganLive = async () => {
    const pertandingan = await getLivePertandingan();

    if (pertandingan?.id) {
        const data = await getPertandinganLog(Number(pertandingan?.id), pertandingan?.jenis)
        return <ViewPertandingan data={data} pertandinganId={Number(pertandingan?.id)} jenisPertandingan={pertandingan?.jenis} tarikhPertandingan={pertandingan?.tarikh} />
    } else {
        return <Container maxWidth={"lg"} sx={{ textAlign: 'center', display: "flex", alignItems: 'center', justifyContent: 'center' }} >
            <Grid mt={'30vh'} container maxWidth={"sm"} textAlign={"center"} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                <Grid item xs={12}>
                    <Typography variant="h5">
                        Maaf, semua pertandingan telah tamat. Sila kunjungi lagi apabila pertandingan seterusnya telah bermula.
                    </Typography>
                </Grid>
            </Grid>

        </Container>
    }
}

export default PertandinganLive;