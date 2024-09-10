import { getAllPertandingan } from "../backend/actions/pertandingan";
import TapakComponent from "../frontend/components/tapak";

export const revalidate = 1;

const Tapak = async props => {
    const pertandingan = await getAllPertandingan();

    return <TapakComponent pertandingan={pertandingan} />
}

export default Tapak;