import { ref, watch } from "vue";

export default function (key, initialValue) {
    const val = ref(initialValue);

    const storageVal = window.localStorage.getItem(key);

    if (storageVal) {
        try {
            val.value = JSON.parse(storageVal);
        }
        catch {
            window.localStorage.setItem(key, val.value);
        }
    }

    watch(val, val => {
        window.localStorage.setItem(key, JSON.stringify(val));
    }, 
    {
        deep: true
    });

    return val;
}