import { getUserBookings } from "@/app/api/users/booking/route"

const { default: UserBookingComponent } = require("@/app/frontend/components/userBooking")

const UserBooking = async props => {

    const data = await getUserBookings();
    return <UserBookingComponent data={data} />
}

export default UserBooking