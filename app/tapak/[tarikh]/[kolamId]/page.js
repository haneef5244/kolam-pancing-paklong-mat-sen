
import TapakTarikhKolamComponent from "@/app/frontend/components/tapakTarikhKolam";

const { getAvailabilityByKolamAndTarikh } = require("@/app/backend/actions/bookingAvailability");
const { redirect } = require("next/navigation");

const TapakTarikhKolam = async props => {
    const { params } = props;
    const { tarikh, kolamId } = params;

    const data = await getAvailabilityByKolamAndTarikh(Number(kolamId), new Date(tarikh));

    if (!data?.length) {
        return <></>
    }

    const leftItems = data?.filter(e => e?.pancang?.is_left)?.sort((a, b) => {
        // Extract and convert the numeric parts of the pancang.value properties
        const numA = parseInt(a.pancang.value.slice(1), 10);
        const numB = parseInt(b.pancang.value.slice(1), 10);

        // Compare the numeric values
        return numA - numB;
    });
    const rightItems = data?.filter(e => e?.pancang?.is_right)?.sort((a, b) => {
        // Extract and convert the numeric parts of the pancang.value properties
        const numA = parseInt(a.pancang.value.slice(1), 10);
        const numB = parseInt(b.pancang.value.slice(1), 10);

        // Compare the numeric values
        return numA - numB;
    });

    return <TapakTarikhKolamComponent leftItems={leftItems} rightItems={rightItems} />


}

export default TapakTarikhKolam;