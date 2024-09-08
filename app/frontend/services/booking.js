import { BOOKING_AVAILABILITY, BOOKING_CREATE, BOOKING_QUEUE, BOOKING_SAVE, BOOKING_STATUS } from "../constants/api/booking"

export const save = async (body) => {
    return fetch(BOOKING_SAVE, {
        body: JSON.stringify(body),
        cache: 'no-store'
    }).then(resp => {
        return resp;
    }).catch(e => {
        throw e;
    })
}

export const create = async (body) => {
    return fetch(BOOKING_CREATE, {
        body: JSON.stringify(body),
        cache: 'no-store',
        method: 'POST',
    }).then(resp => {
        return resp;
    }).catch(e => {
        throw e;
    })
}

export const queue = async (body) => {
    return fetch(BOOKING_QUEUE, {
        body: JSON.stringify(body),
        cache: 'no-store',
        method: 'POST'
    }).then(resp => {
        return resp;
    }).catch(e => {
        throw e;
    })
}

export const getBookingStatus = (bookingId, billCode) => {
    return fetch(`${BOOKING_STATUS}?bookingId=${bookingId}&billCode=${billCode}`, {
        cache: 'no-store'
    })
        .then(resp => {
            return resp
        }).catch(e => {
            throw e;
        })
}

export const getBookingDates = () => {
    return fetch(`${BOOKING_AVAILABILITY}`, {
        cache: 'no-cache'
    })
        .then(resp => {
            return resp;
        }).catch(e => {
            throw e;
        })
}