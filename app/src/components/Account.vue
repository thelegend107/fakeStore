<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import Card from '@/components/Card.vue';
import { store } from '@/store';
import { supabase } from '@/supabase';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiLogoutVariant, mdiSync } from '@mdi/js';
import { useForm } from 'vee-validate';
import { onMounted, ref } from 'vue';
import { object, string } from 'yup';
import { toastPrimary, toastType } from '@/toast';

const updating = ref(false);
const signingOut = ref(false);

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
const [avatarurl] = defineField('avatarurl');

onMounted(async () => {
    await store.getCustomer().then(customer => {
        username.value = customer.username;
        firstname.value = customer.firstname;
        lastname.value = customer.lastname;
        avatarurl.value = store.getAvatarUrl(150);
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

        const { error } = await supabase.from('customers').upsert(updates)
        if (error) throw error
    } catch (error) {
        toastPrimary(error, toastType.error);
        await store.getCustomer().then(customer => {
            username.value = customer.username;
            firstname.value = customer.firstname;
            lastname.value = customer.lastname;
            avatarurl.value = store.getAvatarUrl(150);
        });
    } finally {
        toastPrimary('Customer account was updated successfully!', toastType.success);
        await store.getCustomer().then(customer => {
            username.value = customer.username;
            firstname.value = customer.firstname;
            lastname.value = customer.lastname;
            avatarurl.value = store.getAvatarUrl(150);
        });
        updating.value = false;
    }
});

async function signOut() {
    try {
        signingOut.value = true;
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        else {
            store.customerClear();
        }
    } 
    catch (error) {
        alert(error);
    }
    finally {
        signingOut.value = false;
    }
}
</script>
<template>
    <card class="card" :centered="true">
        <div class="flex-c" style="gap: 1rem;">
            <img :src="avatarurl" width="150" height="150" />
            <form @submit.prevent="updateCustomer" class="flex-c" style="gap: 1.5rem;">
                <div class="flex-c" style="gap: 0.5rem;">
                    <div class="flex-c">
                        <label for="username">Email: </label>
                        <input :value="store.session.user.email" :disabled="true" style="background-color: #111111;" />
                    </div>
                    <div class="flex-c">
                        <label for="username">Username: </label>
                        <input :class="{ inputError: errors.username }" v-model="username" :disabled="false" />
                        <span>{{ errors.username }}</span>
                    </div>
                    <div class="flex-c">
                        <label for="firstname">Firstname: </label>
                        <input :class="{ inputError: errors.firstname }" type="text" v-model="firstname" :disabled="false" />
                        <span>{{ errors.firstname }}</span>
                    </div>
                    <div class="flex-c">
                        <label for="lastname">Lastname: </label>
                        <input :class="{ inputError: errors.lastname }" type="text" v-model="lastname" :disabled="false" />
                        <span>{{ errors.lastname }}</span>
                    </div>
                </div>
                <button type="submit" @click="updateCustomer" :disabled="!meta.valid"><svg-icon :class="{rotating: updating}" type="mdi" :path="mdiSync" />{{ updating ? 'Updating...' : 'Update' }}</button>
            </form>
            <hr>
            <button @click="signOut"><svg-icon type="mdi" :path="mdiLogoutVariant" />{{ signingOut ? 'Logging out...' : 'Logout' }}</button>
        </div>
    </card>
</template>
<style lang="scss" scoped>
img {
    align-self: center;
    margin-top: -5rem;
    border-radius: 100%;
    border: 3px solid rgba($color: #FFFFFF, $alpha: 0.05);
}

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