export const revalidate = 1; // Revalidate every second

import { getBookingAvailability } from "../api/booking/availability/route";
import KolamHome from "../frontend/components/kolam-home"


const Home = async () => {
    const dates = await getBookingAvailability();

    return <KolamHome data={dates} />
}

export default Home