import { getUserBookings } from "@/app/api/users/booking/route"

const { default: UserBookingComponent } = require("@/app/frontend/components/userBooking")

const UserBooking = async props => {

    return <UserBookingComponent />
}

export default UserBooking