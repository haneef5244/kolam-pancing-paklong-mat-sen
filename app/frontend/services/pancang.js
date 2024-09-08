import moment from "moment";
import { GET_BOOKED_PANCANG } from "../constants/api/pancang"

export const getBookedPancang = async (kolamId, tarikh) => {
    return fetch(`${GET_BOOKED_PANCANG}?kolamId=${Number(kolamId)}&tarikh=${moment(tarikh).format('YYYY-MM-DD')}`, {
        cache: 'no-store'
    }).then(resp => {
        return resp;
    }).catch(e => {
        throw e;
    })
}