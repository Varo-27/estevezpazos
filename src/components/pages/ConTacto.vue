<template>
    <div class="my-5">
        <div class="row justify-content-center">
            <div style="width: 400px;">
                <div class="card shadow">
                    <div class="card-body p-4">
                        <h2 class="card-title text-center mb-4">Contacto</h2>
                        <form @submit.prevent="handleSubmit">
                            <div class="mb-3">
                                <label for="nombre" class="form-label">Nombre</label>
                                <input type="text" class="form-control" id="nombre" v-model="formData.nombre" required
                                    placeholder="Tu nombre" :disabled="enviando" />
                            </div>

                            <div class="mb-3">
                                <label for="correo" class="form-label">Correo</label>
                                <input type="email" class="form-control" id="correo" v-model="formData.correo" required
                                    placeholder="tu@email.com" :disabled="enviando" />
                            </div>

                            <div class="mb-3">
                                <label for="asunto" class="form-label">Asunto</label>
                                <input type="text" class="form-control" id="asunto" v-model="formData.asunto" required
                                    placeholder="Asunto del mensaje" :disabled="enviando" />
                            </div>

                            <div class="mb-3">
                                <label for="mensaje" class="form-label">Mensaje</label>
                                <textarea class="form-control" id="mensaje" v-model="formData.mensaje" required rows="5"
                                    placeholder="Escribe tu mensaje aquí" :disabled="enviando"></textarea>
                            </div>

                            <button type="submit" class="btn btn-primary w-100" :disabled="enviando">
                                {{ enviando ? 'Enviando...' : 'Enviar' }}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <div class="row justify-content-center mt-5">
            <div class="card shadow">
                <div class="card-body p-0">
                    <h3 class="card-title text-center py-3 mb-0">Nuestra Ubicación</h3>
                    <div class="ratio ratio-16x9">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2953.271190705747!2d-8.6900709!3d42.2513809!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd2f62e588cfce69%3A0x378485bfa6edd1be!2sIES%20de%20Teis!5e0!3m2!1ses!2ses!4v1765527695611!5m2!1ses!2ses"
                            style="border:0;" allowfullscreen loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useNotifications } from '@/composables/useNotifications';
import { enviarMensajeContacto } from '@/api/contacto.js';

const formData = reactive({
    nombre: '',
    correo: '',
    asunto: '',
    mensaje: ''
});

const enviando = ref(false);
const { success, error } = useNotifications();

const handleSubmit = async () => {
    if (enviando.value) return;

    enviando.value = true;

    try {
        await enviarMensajeContacto(formData);
        await success('Mensaje enviado con éxito', 'Te contactaremos pronto');

        // Limpiar formulario
        formData.nombre = '';
        formData.correo = '';
        formData.asunto = '';
        formData.mensaje = '';
    } catch (err) {
        console.error('Error enviando mensaje:', err);
        error('Error de conexión', 'No se pudo conectar con el servidor');
    } finally {
        enviando.value = false;
    }
};
</script>