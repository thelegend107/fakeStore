<script setup>
import { onMounted, ref } from 'vue';
import { store, displayAddress } from '@/store';
import { toastPrimary, toastType } from '@/toast';
import { supabase } from '@/supabase';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiDeleteCircle, mdiMapMarkerPlus, mdiPencilCircle } from '@mdi/js';
import Modal from './Modal.vue';
import AddressInput from './AddressInput.vue';

const addressId = ref();
const addressModalShow = ref(false);
const customerAddresses = ref([]);

async function deleteAddress(a) {
    try {
        const { status, error } = await supabase.from('addresses')
            .delete()
            .eq('id', a.id);
        
        if (error) throw error;
        if (status == 204) {
            store.getCustomerAddresses();
            customerAddresses.value = customerAddresses.value.filter(x => x.id != a.id);
            toastPrimary("Address was deleted successfully!", toastType.success);
        };
    } catch (error) {
        toastPrimary(error.message, toastType.error)
    }
}

async function handleAddressUpsert(a) {
    await store.upsertAddress(a).then(data => {
        addressModalShow.value = false;
        store.getCustomerAddresses();
        const addressIndex = customerAddresses.value.findIndex(x => x.id == data.id)
        if (a.id && addressIndex >= 0) {
            customerAddresses.value[addressIndex].id = data.id;
            customerAddresses.value[addressIndex].userId = data.userId;
            customerAddresses.value[addressIndex].address1 = data.address1;
            customerAddresses.value[addressIndex].address2 = data.address2;
            customerAddresses.value[addressIndex].city = data.city;
            customerAddresses.value[addressIndex].postalCode = data.postalCode;
            customerAddresses.value[addressIndex].stateId = data.stateId;
            customerAddresses.value[addressIndex].countryId = data.countryId;
            customerAddresses.value[addressIndex].country = data.country;
            customerAddresses.value[addressIndex].state = data.state;
            customerAddresses.value[addressIndex].lastUpdated = data.lastUpdated;
            customerAddresses.value[addressIndex].createdAt = data.createdAt;
            toastPrimary("Address was updated successfully!", toastType.success);
        }
        else {
            customerAddresses.value.push(data);
            toastPrimary("Address was added successfuly!", toastType.success); 
        }
    }).finally(() => {
        addressId.value = null;
    })
}

onMounted(async () => {
    await store.getCustomerAddresses().then(addresses => {
        customerAddresses.value = addresses;
    });
});
</script>
<template>
    <div class="flex-c jc-sb" style="gap: 1rem;">
        <transition-group mode="out-in" tag="div" name="list" class="flex-c" style="gap: 0.25rem;">
            <div class="account-s flex-r ai-c jc-sb" v-for="a in customerAddresses" :key="a">
                <p>{{ displayAddress(a) }}</p>
                <div class="flex-r" style="gap: 0.25rem;">
                    <svg-icon @click="addressId = a.id; addressModalShow=true;" class="address-action" type="mdi" :path="mdiPencilCircle" :size="25" />
                    <svg-icon @click="deleteAddress(a)" class="address-action delete" type="mdi" :path="mdiDeleteCircle" :size="25" />
                </div>
            </div>
        </transition-group>
        <button @click="addressId = null; addressModalShow=true;">
            <svg-icon type="mdi" :path="mdiMapMarkerPlus" /> Add Address
        </button>
        <transition>
            <modal v-if="addressModalShow" @close-modal="addressModalShow = false" :title="addressId ? 'Update Address' : 'New Address'">
                <template #body><address-input @address-upsert="handleAddressUpsert" :address-id="addressId" /></template>
            </modal>
        </transition>
    </div>
</template>
<style lang="scss" scoped>
.address-action {
    transition: all 0.3s ease;
    cursor: pointer;
}

.address-action:hover {
    opacity: 70%;
}

.delete:hover {
    color: var(--error);
}
</style>