<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiHome } from '@mdi/js';
import Card from '@/components/Card.vue';

const router = useRouter();

const statusCode = {
    401: {
        name: '401: Unauthorized',
        description: [
            "You don't have permissions for this page.",
            'Please check your login info and permissions and try again.'
        ]
    },
    403: {
        name: '403: Forbidden',
        description: [
            "You don't have permissions for this page.",
            'Please check your login info and permissions and try again.'
        ]
    },
    404: {
        name: '404: Not Found',
        description: ['The requested route was not found.', 'Go home you are drunk.']
    }
}

const h1Text = ref(statusCode[404].name);
const h3Texts = ref(statusCode[404].description);

switch (router.currentRoute.value.name) {
    case "Unauthorized":
        h1Text.value = statusCode[401].name;
        h3Texts.value = statusCode[401].description;
        break;
    case "Forbidden":
        h1Text.value = statusCode[403].name;
        h3Texts.value = statusCode[403].description;
        break;
    default:
        h1Text.value = statusCode[404].name;
        h3Texts.value = statusCode[404].description;
        break;
}
</script>

<template>
    <main>
        <card :centered="true" style="text-align: center; margin-top: 1rem; height: 72vh;">
            <h1 style="color: white;">{{ h1Text }}</h1>
            <div>
                <h3 v-for="(t, index) in h3Texts" :key="index">{{ t }}</h3>
            </div>
            <button name="go-home-button" class="flex-r ai-c" @click="router.push({ name: 'home' })" style="height: 3rem;">
                <svg-icon type="mdi" :path="mdiHome"></svg-icon>
                <p>HOME</p>
            </button>
        </card>
    </main>
</template>