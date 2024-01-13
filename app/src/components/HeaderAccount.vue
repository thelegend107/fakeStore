<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '@/store';

const router = useRouter();

onMounted(async () => {
    await store.getCustomer();
})
</script>
<template>
    <div @click="router.push({name: 'account'})" class="h-account flex-r ai-c" style="gap: 10px;">
        <img :src="store.getAvatarUrl(50)" width="25px" height="25px" />
        <div class="h-account-name flex-r ai-c" style="gap: 3.5px;">
            <p>{{ store.customer.firstname }}</p>
            <p>{{ store.customer.lastname }}</p>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.h-account {
    background-color: var(--primary);
    color: white;
    padding: 0;
    border-radius: 15px;
    transition: all 0.3s ease;
    cursor: pointer;

    img {
        display: flex;
        align-items: center;
        border: 2px solid var(--primary);
        border-radius: 100%;
    }

    cursor: pointer;
}

.h-account-name {
    display: none;
}

@media (min-width: 1024px) and (min-height: 788px) {
    .h-account {
        padding: 0 0.5rem 0 0.1rem;
    }
    .h-account-name {
        display: flex;
    }
}
</style>