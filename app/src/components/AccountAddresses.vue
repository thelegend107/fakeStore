<script setup>
import { onBeforeMount, ref } from 'vue';
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

async function deleteAddress(a, updatingAddress=false) {
    try {
        const { status, error } = await supabase.from('addresses')
            .delete()
            .eq('id', a.id);
        
        if (error) throw error;
        if (status == 204 && !updatingAddress) {
            customerAddresses.value = customerAddresses.value.filter(x => x.id != a.id);
            toastPrimary("Address was deleted successfully!", toastType.success);
        };
    } catch (error) {
        if (error.code == "23503") {
            a.deleted = true;
            await store.upsertAddress(a).then(() => {
                store.getCustomerAddresses();
                if (!updatingAddress) {
                    customerAddresses.value = customerAddresses.value.filter(x => x.id != a.id);
                    toastPrimary("Address was deleted successfully!", toastType.success);
                }
            })
        }
        else toastPrimary(error, toastType.error);
    }
}

async function handleAddressUpsert(a) {
    let addressIndex = -1;
    if (a.id) {
        addressIndex = customerAddresses.value.findIndex(x => x.id == a.id)
        const { data, error } = await supabase.from('orders').select().or(`billingAddressId.eq.${a.id},shippingAddressId.eq.${a.id}`);
        
        if (data && data.length > 0 && !error) {
            await deleteAddress(customerAddresses.value[addressIndex], true);
            a.deleted = false;
            a.id = undefined;
        }
    }

    await store.upsertAddress(a).then(data => {
        addressModalShow.value = false;
        store.getCustomerAddresses();
        
        if (addressIndex > -1) {
            if (a.id) {
                customerAddresses.value[addressIndex] = data;
            } 
            else {
                customerAddresses.value = customerAddresses.value.filter(x => x.id != customerAddresses.value[addressIndex].id);
                customerAddresses.value.push(data);
            }

            toastPrimary("Address was updated successfully!", toastType.success);
        } else {
            customerAddresses.value.push(data);
            toastPrimary("Address was added successfuly!", toastType.success)
        }
    }).finally(() => {
        addressId.value = null;
    })
}

onBeforeMount(async () => {
    await store.getCustomerAddresses().then(addresses => {
        customerAddresses.value = addresses;
    });
});
</script>
<template>
    <div class="flex-c jc-sb" style="gap: 1rem;">
        <transition-group mode="out-in" tag="div" name="list" class="flex-c" style="gap: 0.25rem;overflow-x: hidden; overflow-y:scroll;">
            <div class="bg-glass-rounded flex-r ai-c jc-sb" v-for="a in customerAddresses" :key="a.id">
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
                <template #body>
                    <address-input @address-upsert="handleAddressUpsert" @address-upsert-cancel="addressModalShow = false; addressId = null" :address-id="addressId" />
                </template>
            </modal>
        </transition>
    </div>
</template>