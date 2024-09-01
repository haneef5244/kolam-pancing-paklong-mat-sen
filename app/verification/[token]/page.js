'use client';
import { SnackbarContext } from "@/app/frontend/contexts/SnackbarContext";
import { verification } from "@/app/frontend/services/user";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

const Verifikasi = (props) => {
    const { setSnackbarProps } = useContext(SnackbarContext);

    const navigate = useRouter();

    const { params } = props;

    const { token } = params;

    useEffect(() => {
        verification(token).then(resp => {
            if (resp?.ok) {
                setSnackbarProps({
                    open: true,
                    message: 'Akaun anda telah disahkan! Sila login untuk booking',
                    severity: 'success'
                })
                navigate.push('/')
            }
        });
    }, [])
    return <div>

    </div>
}

export default Verifikasi;