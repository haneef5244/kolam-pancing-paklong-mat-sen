import prisma from "../helpers/prisma"

export const getAvailabilityByKolamAndTarikh = async (kolamId, tarikh) => {
    return await prisma.booking_availability.findMany({
        where: {
            kolam_id: kolamId,
            tarikh: tarikh,
        },
        select: {
            'pancang': {
                select: {
                    'value': true,
                    'is_left': true,
                    'is_right': true,
                }
            },
            'is_available': true,
        }
    })
}