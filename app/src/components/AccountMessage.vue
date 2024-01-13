<script setup>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiAccount, mdiEmail, mdiHome, mdiLoginVariant } from '@mdi/js';

defineProps({
    emailAddress: {
        type: String,
        default: ''
    },
    accountConfirmed: Boolean,
    accountConfirm: Boolean,
    accountAlreadyExists: Boolean,
})
</script>

<template>
    <div class="flex-c ai-c" style="gap: 1rem;">
        <div v-if="accountConfirm" class="flex-c ai-c">
            <svg-icon class="icon" type="mdi" :path="mdiEmail" :size="100"></svg-icon>
            <h2>Confirm your email address by clicking the link we sent to <b v-if="emailAddress">{{ emailAddress }}</b></h2>
        </div>
        <div v-if="accountAlreadyExists" class="flex-c ai-c">
            <svg-icon class="icon" type="mdi" :path="mdiAccount" :size="100"></svg-icon>
            <h2>The email address, <b v-if="emailAddress">{{ emailAddress }}</b>, is already a registered account</h2>
        </div>
        <div class="flex-r ai-c jc-sa w-100" style="gap: 1rem;">
            <button @click="$router.push({name: 'home'})"><svg-icon type="mdi" :path="mdiHome" />HOME</button>
            <button @click="$router.push({name: 'login'})"><svg-icon type="mdi" :path="mdiLoginVariant" />LOGIN</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.icon {
    margin-top: -5rem;
    border-radius: 100%;
    padding: 1rem;
    background-color: var(--primary);
    color: white;
}

b {
    font-weight: bold;
    color: var(--primary);
}

button {
    height: 2rem;
    width: 100%;
}
</style>