import moment from "moment";
import { redirect } from "next/navigation";

const { default: KolamLayoutComponent } = require("@/app/frontend/components/kolam-layout");


const KolamLayout = async props => {
    const { params } = props;
    const { tarikh } = params;

    if (moment(tarikh).startOf('day').isSameOrAfter(moment().startOf('day')) && moment(tarikh).isValid()) {
        return <KolamLayoutComponent tarikh={tarikh} />

    } else {
        redirect('/', 'push')
    }

}

export default KolamLayout;