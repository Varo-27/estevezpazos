import Swal from "sweetalert2";

export function useNotifications() {
    const success = (title, text = null, timer = 1500) => {
        return Swal.fire({
            icon: "success",
            title,
            text,
            showConfirmButton: false,
            timer,
        });
    };

    const error = (title, text = null, timer = 2000) => {
        return Swal.fire({
            icon: "error",
            title,
            text,
            showConfirmButton: true,
            timer,
        });
    };

    const warning = (title, text = null) => {
        return Swal.fire({
            icon: "warning",
            title,
            text,
            showConfirmButton: true,
        });
    };

    const info = (title, text = null) => {
        return Swal.fire({
            icon: "info",
            title,
            text,
            showConfirmButton: true,
        });
    };

    // ✅ Confirmación para eliminar
    const confirmDelete = (itemDescription) => {
        return Swal.fire({
            title: `¿Eliminar ${itemDescription}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            // confirmButtonColor: "#d33",
            // cancelButtonColor: "#d33",
        });
    };

    // ✅ Confirmación para guardar/modificar
    const confirmSave = (isEditing) => {
        return Swal.fire({
            title: isEditing
                ? `¿Desea modificar este cliente?`
                : `¿Desea grabar este cliente?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: isEditing ? "Modificar" : "Grabar",
            cancelButtonText: "Cancelar",
            // confirmButtonColor: "#3085d6",
            // cancelButtonColor: "#d33",
        });
    };

    // ✅ Confirmación para activar
    const confirmActivate = (itemDescription) => {
        return Swal.fire({
            title: `¿Activar al cliente ${itemDescription}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Activar",
            cancelButtonText: "Cancelar",
            // confirmButtonColor: "#3085d6",
            // cancelButtonColor: "#d33",
        });
    };

    return {
        success,
        error,
        warning,
        info,
        confirmDelete,
        confirmSave,
        confirmActivate,
    };
}
