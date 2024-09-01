import { validateForgotPasswordToken } from "@/app/api/users/reset_password/route";
import ForgotPasswordComponent from "@/app/frontend/components/forgotPassword";


const ForgotPassword = async (props) => {
    const { params } = props;
    const { token } = params;
    const resp = await validateForgotPasswordToken(token);

    return <ForgotPasswordComponent token={token} isValid={resp} />

}

export default ForgotPassword;