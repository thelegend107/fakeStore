<script setup>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiSync } from '@mdi/js';
import { store } from '@/store';
import { useForm } from 'vee-validate';
import { onBeforeMount, ref } from 'vue';
import { object, string } from 'yup';
import { toastPrimary, toastType } from '@/toast';
import { supabase } from '@/supabase';

const updating = ref(false);

const { meta, errors, handleSubmit, defineField } = useForm({
    validationSchema: object({
        firstname: string().required('please enter your first name'),
        lastname: string().required('please enter your last name'),
        username: string().required('please enter your username').min(8)
    }),
});

const [firstname] = defineField('firstname');
const [lastname] = defineField('lastname');
const [username] = defineField('username');

onBeforeMount(async () => {
    await store.getCustomer().then(customer => {
        username.value = customer.username;
        firstname.value = customer.firstname;
        lastname.value = customer.lastname;
    });
});

const updateCustomer = handleSubmit(async () => {
    try {
        updating.value = true
        const { user } = store.session

        const updates = {
            id: user.id,
            username: username.value,
            firstname: firstname.value,
            lastname: lastname.value,
            updatedat: new Date(),
        }

        const { data, error } = await supabase.from('customers').upsert(updates).select().single();
        if (error) throw error
        if (data) store.customer = data;
        toastPrimary('Customer account was updated successfully!', toastType.success);
    } catch (error) {
        toastPrimary(error.message, toastType.error);
    } finally {
        updating.value = false;
    }
});
</script>
<template>
    <form @submit.prevent="updateCustomer" class="flex-c jc-sb" style="gap: 1rem;">
        <div class="bg-glass-rounded flex-c" style="gap: 0.25rem;">
            <div class="flex-c">
                <label for="username">Email: </label>
                <input :value="store.session.user.email" :disabled="true" style="background-color: #111111;" />
            </div>
            <div class="flex-c">
                <label for="username">Username: </label>
                <input :class="{ inputError: errors.username }" v-model="username" />
                <span>{{ errors.username }}</span>
            </div>
            <div class="flex-c">
                <label for="firstname">Firstname: </label>
                <input :class="{ inputError: errors.firstname }" type="text" v-model="firstname" />
                <span>{{ errors.firstname }}</span>
            </div>
            <div class="flex-c">
                <label for="lastname">Lastname: </label>
                <input :class="{ inputError: errors.lastname }" type="text" v-model="lastname" />
                <span>{{ errors.lastname }}</span>
            </div>
        </div>
        <button type="submit" :disabled="!meta.valid">
            <svg-icon :class="{rotating: updating}" type="mdi" :path="mdiSync" />
            {{ updating ? 'Updating...' : 'Update' }}
        </button>
    </form>
</template>
<style lang="scss" scoped>
@keyframes rotating {
    from{
        transform: rotate(0deg);
    }
    to{
        transform: rotate(360deg);
    }
}

.rotating {
    animation: rotating 0.5s linear infinite;
}
</style>