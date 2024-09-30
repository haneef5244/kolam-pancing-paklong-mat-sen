import { getLatestEndedPertandingan, getPertandinganLog } from "@/app/backend/actions/pertandingan";
import ViewPertandinganTamat from "@/app/frontend/components/viewPertandinganTamat";
import { Container, Grid, Typography } from "@mui/material";

export const revalidate = 1;
const PertandinganJuara = async () => {
    const pertandingan = await getLatestEndedPertandingan();

    if (pertandingan?.id) {
        const data = await getPertandinganLog(Number(pertandingan?.id, pertandingan?.jenis))
        return <ViewPertandinganTamat data={data} pertandinganId={Number(pertandingan?.id)} jenisPertandingan={pertandingan?.jenis} tarikhPertandingan={pertandingan?.tarikh} />
    } else {
        return <Container maxWidth={"lg"} sx={{ textAlign: 'center', display: "flex", alignItems: 'center', justifyContent: 'center' }} >
            <Grid mt={'30vh'} container maxWidth={"sm"} textAlign={"center"} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                <Grid item xs={12}>
                    <Typography variant="h5">
                        Maaf, tiada pertandingan telah tamat.
                    </Typography>
                </Grid>
            </Grid>
        </Container>
    }
}

export default PertandinganJuara;