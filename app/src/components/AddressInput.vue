<script setup>
import { store } from '@/store';
import { supabase, addressSelect } from '@/supabase';
import { useForm } from 'vee-validate';
import { onMounted, ref } from 'vue';
import { number, object, string } from 'yup';

const emit = defineEmits(['address-upsert']);

const prop = defineProps({
    addressId: Number
})

const existingAddress = ref();

const { meta, errors, handleSubmit, defineField } = useForm({
    validationSchema: object({
        address1: string().required(),
        address2: string().optional().nullable(),
        city: string().required(),
        postalCode: number().required(),
        stateId: number().required(),
        countryId: number().required().min(0)
    }),
});

const [address1] = defineField('address1');
const [address2] = defineField('address2');
const [city] = defineField('city');
const [postalCode] = defineField('postalCode');
const [stateId] = defineField('stateId');
const [countryId] = defineField('countryId');

const states = ref([]);
const countries = ref([]);

async function getCustomerAddressById (addressId) {
    try {
        const { user } = store.session;
        const { data, error, status } = await supabase
            .from('addresses')
            .select(addressSelect)
            .eq('userId', user.id)
            .eq('id', addressId)
            .single();

        if (error && status !== 406) throw error
        return data;
    } catch (error) {
        alert(error.message)
    }
}

async function getStates() {
    try {
        const { data, error, status } = await supabase
            .from('state')
            .select('id, name')
            .eq('countryId', countryId.value)
            .order('name', { ascending: true });

        if (error && status !== 406) throw error
        if (data) {
            states.value = data;
            stateId.value = -1;
        }
        if (data && data.length == 0){
            states.value = [{Id: 0, Name: 'N/A'}]
            stateId.value = 0;
        }
    } catch (error) {
        alert(error.message)
    }
}

async function getCountries() {
    try {
        const { data, error, status } = await supabase
            .from('country')
            .select('id, name, ISO2, emoji')
            .order('name', { ascending: true });

        if (error && status !== 406) throw error
        if (data) countries.value = data;
    } catch (error) {
        alert(error.message)
    }
}

const onSubmit = handleSubmit((values) => {
    if (prop.addressId) { 
        values.id = existingAddress.value.id;
        values.createdAt = existingAddress.value.createdAt;
    }
    emit('address-upsert', values);
});

onMounted(async () => {
    await getCountries();
    if (prop.addressId) {
        existingAddress.value = await getCustomerAddressById(prop.addressId);
        address1.value = existingAddress.value.address1;
        address2.value = existingAddress.value.address2;
        city.value = existingAddress.value.city;
        postalCode.value = existingAddress.value.postalCode;
        countryId.value = existingAddress.value.countryId;
        await getStates();
        stateId.value = existingAddress.value.stateId;
    }
    else {
        countryId.value = 233;
        await getStates();
    }
})
</script>
<template>
    <form @submit.prevent="onSubmit" class="flex-c" style="gap: 1rem;">
        <div class="flex-c" style="gap: 0.5rem;">
            <div class="flex-c">
                <label for="address1">Address 1:</label>
                <input :class="{ inputError: errors.address1 }" type="text" v-model="address1">
                <span>{{ errors.address1 }}</span>
            </div>
            <div class="flex-c">
                <label for="address2">Address 2:</label>
                <input :class="{ inputError: errors.address2 }" type="text" v-model="address2">
                <span>{{ errors.address2 }}</span>
            </div>
            <div class="flex-c w-100">
                <label for="city">City:</label>
                <input :class="{ inputError: errors.city }" type="text" v-model="city">
                <span>{{ errors.city }}</span>
            </div>
            <div class="flex-c w-100">
                <label for="stateId">State:</label>
                <select style="display: flex; flex-wrap: wrap;" :class="{ inputError: errors.stateId }" v-model="stateId" >
                    <option style="display: flex; flex-wrap: wrap;" :value='-1' disabled selected hidden>Please select a state</option>
                    <option style="display: flex; flex-wrap: wrap;" v-for="s in states" :key="s.id" :value="s.id">{{ s.name }}</option>
                </select>
                <span>{{ errors.stateId }}</span>
            </div>
            <div class="flex-c w-100">
                <label for="postalCode">Postal Code:</label>
                <input  :class="{ inputError: errors.postalCode }" type="number" inputmode="numeric" v-model="postalCode">
                <span>{{ errors.postalCode }}</span>
            </div>
            <div class="flex-c w-100">
                <label for="countryId">Country:</label>
                <select style="display: flex; flex-wrap: wrap;" :class="{ inputError: errors.countryId }" v-on:change="getStates" v-model="countryId">
                    <option style="display: flex; flex-wrap: wrap;" v-for="c in countries" :key="c.id" :value="c.id">{{ c.emoji + ' ' + c.name }}</option>
                </select>
                <span>{{ errors.countryId }}</span>
            </div>
        </div>
        <button type="submit" :disabled="!meta.valid" >{{ prop.addressId ? "Update " : "Add " }}Address</button>
    </form>
</template>