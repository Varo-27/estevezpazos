import Swal from "sweetalert2";

export function useNotifications() {

    const success = (title, text = null, timer = 1500) =>{
        return Swal.fire({
            icon: 'success',
            title,
            text,
            showConfirmButton: false,
            timer
        })
    } 

    const error = (title, text = null, timer = 2000) =>{
        return Swal.fire({
            icon: 'error',
            title,
            text,
            showConfirmButton: false,
            timer
        })
    }

    const warning = (title, text = null) =>{
        return Swal.fire({
            icon: 'warning',
            title,
            text,
            confirmButtonText: "Aceptar"
        })
    }

    const confirm = (title, text = null, options = {}) => {
        // Opciones por defecto
        const defaultOptions = {
            title,
            text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar'
        }
    }

    return {
        success,
        error,
        warning,
        confirm
    }
}