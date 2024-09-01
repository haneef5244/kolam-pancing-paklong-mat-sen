const { cookies } = require("next/headers")
const { default: ResponsiveAppBar } = require(".")

export const ServerHeader = async (props) => {
    const token = cookies().get('token');

    return <ResponsiveAppBar token={token} />
}