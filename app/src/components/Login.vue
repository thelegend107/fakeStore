<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'
import Card from './Card.vue'
import svgIcon from '@jamescoyle/vue-icon'
import { mdiAccountPlus, mdiLoginVariant } from '@mdi/js'
import { useForm } from 'vee-validate'
import { object, string } from 'yup'

const router = useRouter();
const { meta, errors, handleSubmit, isSubmitting, defineField } = useForm({
    validationSchema: object({
        email: string()
            .required('email is a required field')
            .matches(
                /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                'please enter a valid email address'
            ),
        password: string().required()
    })
})

const [email] = defineField('email')
const [password] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password
        })

        if (error) errors.value.email = error.message
        if (data && data.session) router.push({name: 'home'})
    } catch (error) {
        console.log(error)
    }
})
</script>
<template>
    <card class="card" :centered="true">
        <form @submit.prevent="onSubmit">
            <h1 style="text-align: center; font-size: 75px;color:rgba(255, 255, 255, 0.55);">Login.</h1>
            <div class="flex-c" style="gap: 0.5rem">
                <div class="flex-c">
                    <label>Email:</label>
                    <input :class="{ inputError: errors.email }" type="email" v-model="email" />
                    <span>{{ errors.email }}</span>
                </div>
                <div class="flex-c">
                    <label>Password:</label>
                    <input :class="{ inputError: errors.password }" type="password" v-model="password" />
                    <span>{{ errors.password }}</span>
                </div>
                <button name="login-button" type="submit" style="margin-top: 0.5rem" :disabled="!meta.valid">
                    <svg-icon type="mdi" :path="mdiLoginVariant" :size="25" />
                    <p>{{ isSubmitting ? 'Logging in...' : 'Login' }}</p>
                </button>
                <!-- <button type="button">
                    <svg-icon type="mdi" :path="mdiLockQuestion" :size="25" />
                    <p>Forgot Password?</p>
                </button> -->
                <pre class="separator"> OR </pre>
                <button name="go-to-register" type="button" @click="$router.push({ name: 'register' })">
                    <svg-icon type="mdi" :path="mdiAccountPlus" :size="25" />
                    <p>Register</p>
                </button>
                <div class="bg-glass-rounded" style="margin-top: 1rem;">
                    <h3 style="color: white;">Don't want to register?</h3>
                    <div style="padding-left: 1rem;">
                        <p>- Username: test@email.com</p>
                        <p>- Password: G9#tu8DTyO5U^qy9</p>
                    </div>
                </div>
            </div>
        </form>
    </card>
</template>
