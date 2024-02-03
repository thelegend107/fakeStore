<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { object, string, ref as Ref } from 'yup'
import { supabase } from '@/supabase';
import Card from '@/components/Card.vue';
import svgIcon from '@jamescoyle/vue-icon';
import { mdiAccountPlus, mdiLoginVariant } from '@mdi/js';
import AccountMessage from './AccountMessage.vue';

const router = useRouter();
const routes = router.getRoutes();
const loginRouteIndex = routes.findIndex(x => x.name == 'account');
const emailRedirectTo = window.location.origin + routes[loginRouteIndex].path;
const accountConfirm = ref(false);
const accountAlreadyExists = ref(false);

const { meta, errors, handleSubmit, isSubmitting, defineField } = useForm({
    validationSchema: object({
        firstName: string().required('please enter your first name'),
        lastName: string().required('please enter your last name'),
        email: string().required('email is a required field').matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'please enter a valid email address'),
        password: string().required()
            .min(8)
            .matches(/^(?=.*[a-z])/, "password must contain 1 lowercase character")
            .matches(/^(?=.*[A-Z])/, "password must contain 1 uppercase character")
            .matches(/^(?=.*[0-9])/, "password must contain 1 number")
            .matches(/^(?=.*[!@#$%^&*?+=,.[\]|:;<{}>_~-])/, "password must contain 1 special character"),
        confirmPassword: string().required('password is a required field').oneOf([Ref('password')], 'password does not match'),
    }),
});

const [firstName] = defineField('firstName');
const [lastName] = defineField('lastName');
const [email] = defineField('email');
const [password] = defineField('password');
const [confirmPassword] = defineField('confirmPassword');

const onSubmit = handleSubmit(async values => {
    try {
        const { data: customerData } = await supabase.from('customers').select().eq('username', values.email);

        if (customerData.length > 0)
            accountAlreadyExists.value = true;
        else {
            let { data, error } = await supabase.auth.signUp({
                email: values.email,
                password: values.password,
                options: {
                    emailRedirectTo: emailRedirectTo,
                    data: {
                        username: values.email,
                        firstname: values.firstName,
                        lastname: values.lastName,
                    }
                }
            });
            if (error) throw error;
            if (data) accountConfirm.value = true;
        }
    } catch (error) {
        console.log(error)
    }
})
</script>
<template>
    <card v-if="accountAlreadyExists || accountConfirm" :centered="true">
        <account-message 
            :account-already-exists="accountAlreadyExists" 
            :account-confirm="accountConfirm" 
            :email-address="email">
        </account-message>
    </card>
    <card v-else class="card" :centered="true">
        <form @submit.prevent="onSubmit">
            <h1 style="text-align: center; font-size: 75px;color: rgba(255, 255, 255, 0.55);">Register.</h1>
            <div class="flex-c" style="gap: 0.5rem;">
                <div class="flex-c">
                    <label>Firstname: </label>
                    <input :class="{ inputError: errors.firstName }" type="text" v-model="firstName">
                    <span>{{ errors.firstName }}</span>
                </div>
                <div class="flex-c">
                    <label>Lastname: </label>
                    <input :class="{ inputError: errors.lastName }" type="text" v-model="lastName">
                    <span>{{ errors.lastName }}</span>
                </div>
                <div class="flex-c">
                    <label>Email: </label>
                    <input :class="{ inputError: errors.email }" type="email" v-model="email">
                    <span>{{ errors.email }}</span>
                </div>
                <div class="flex-c">
                    <label>Password: </label>
                    <input :class="{ inputError: errors.password }" type="password" v-model="password">
                    <span>{{ errors.password }}</span>
                </div>
                <div class="flex-c">
                    <label>Confirm Password: </label>
                    <input :class="{ inputError: errors.confirmPassword }" type="password" v-model="confirmPassword">
                    <span>{{ errors.confirmPassword }}</span>
                </div>
                <button name="register-button" type="submit" style="margin-top: 0.5rem;" :disabled="!meta.valid">
                    <svg-icon type="mdi" :path="mdiAccountPlus" :size="25" />
                    <p>{{ isSubmitting ? 'Registering...' : 'Register' }}</p>
                </button>
                <pre class="separator"> OR </pre>
                <button name="go-to-login" type="button" @click="$router.push({ name: 'login' })">
                    <svg-icon type="mdi" :path="mdiLoginVariant" :size="25" />
                    <p>Login</p>
                </button>
            </div>
        </form>
    </card>
</template>