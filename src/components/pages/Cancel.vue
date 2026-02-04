<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">
                <div class="card shadow-lg border-0">
                    <div class="card-body text-center py-5">
                        <div class="mb-4">
                            <i class="bi bi-x-circle-fill text-warning" style="font-size: 5rem;"></i>
                        </div>
                        <h2 class="card-title text-warning mb-3">Pago Cancelado</h2>
                        <p class="card-text text-muted mb-4">
                            Has cancelado el proceso de pago. No se ha realizado ningún cargo.
                        </p>

                        <div class="alert alert-info" role="alert">
                            <i class="bi bi-info-circle me-2"></i>
                            Tus artículos siguen en la cesta. Puedes completar tu compra cuando quieras.
                        </div>

                        <div class="d-flex justify-content-center gap-3 mt-4">
                            <router-link to="/cesta" class="btn btn-primary">
                                <i class="bi bi-cart3 me-2"></i>Volver a la cesta
                            </router-link>
                            <router-link to="/ventas" class="btn btn-outline-primary">
                                <i class="bi bi-car-front me-2"></i>Seguir comprando
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// No necesita limpiar la cesta en este caso
</script>

<style scoped>
.card {
    border-radius: 15px;
}

.bi-x-circle-fill {
    animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
    from {
        transform: scale(0);
    }

    to {
        transform: scale(1);
    }
}
</style>
