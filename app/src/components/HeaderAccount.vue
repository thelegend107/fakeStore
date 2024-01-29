<script setup>
import { onMounted } from 'vue';
import { store } from '@/store';

onMounted(async () => {
    await store.getCustomer();
})
</script>
<template>
    <div class="h-account bg-glass flex-r ai-c" style="gap: 10px;">
        <img :src="store.getAvatarUrl(47)" width="25" height="25" />
        <div class="h-account-name flex-r ai-c" style="gap: 3.5px;">
            <p>{{ store.customer.firstname }}</p>
            <p>{{ store.customer.lastname }}</p>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.bg-glass::before {
    border-radius: 25px;
}

.h-account {
    color: white;
    padding: 0;
    border-radius: 25px;
    border: 2px solid var(--primaryV);
    transition: all 0.3s ease;
    cursor: pointer;

    img {
        display: flex;
        align-items: center;
        height: 28px;
        width: 28px;
        border-radius: 100%;
    }

    cursor: pointer;
}

.h-account:hover{
    border: 2px solid var(--primary);
    opacity: 70%;
}

.h-account-name {
    display: none;
}

@media (min-width: 1024px) and (min-height: 788px) {
    .h-account {
        padding: 0 0.5rem 0 0rem;
    }
    .h-account-name {
        display: flex;
    }
}
</style>