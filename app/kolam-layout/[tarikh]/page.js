import moment from "moment";
import { redirect } from "next/navigation";

const { getBookingAvailabilityByDate } = require("@/app/api/booking/availability/route");
const { default: KolamLayoutComponent } = require("@/app/frontend/components/kolam-layout");


const KolamLayout = async props => {
    const { params } = props;
    const { tarikh } = params;

    if (moment(tarikh).startOf('day').isSameOrAfter(moment().startOf('day')) && moment(tarikh).isValid()) {
        const dateAvailable = await getBookingAvailabilityByDate(new Date(tarikh));
        if (dateAvailable?.tarikh) {
            return <KolamLayoutComponent tarikh={tarikh} />
        } else {
            redirect('/', 'push')
        }
    }

}

export default KolamLayout;