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
            <h1 style="text-align: center; font-size: 75px;">Login.</h1>
            <div class="flex-c" style="gap: 0.5rem">
                <div class="flex-c">
                    <p>Email:</p>
                    <input :class="{ inputError: errors.email }" type="email" v-model="email" />
                    <span>{{ errors.email }}</span>
                </div>
                <div class="flex-c">
                    <p>Password:</p>
                    <input :class="{ inputError: errors.password }" type="password" v-model="password" />
                    <span>{{ errors.password }}</span>
                </div>
                <button type="submit" style="margin-top: 0.5rem" :disabled="!meta.valid">
                    <svg-icon type="mdi" :path="mdiLoginVariant" :size="25" />
                    <p>{{ isSubmitting ? 'Logging in...' : 'Login' }}</p>
                </button>
                <!-- <button type="button">
                    <svg-icon type="mdi" :path="mdiLockQuestion" :size="25" />
                    <p>Forgot Password?</p>
                </button> -->
                <pre class="separator"> OR </pre>
                <button type="button" @click="$router.push({ name: 'register' })">
                    <svg-icon type="mdi" :path="mdiAccountPlus" :size="25" />
                    <p>Register</p>
                </button>
            </div>
        </form>
    </card>
</template>
