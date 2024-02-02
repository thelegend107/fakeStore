import { ref, watch } from "vue";
import * as cryptoJS from 'crypto-js';

const _key = import.meta.env.VITE_ENCRYPTION_KEY;

export default function (key, initialValue) {
    const val = ref(initialValue);
    const storageVal = window.localStorage.getItem(key);

    if (storageVal) {
        try {
            val.value = JSON.parse(decrypt(storageVal));
        }
        catch {
            window.localStorage.setItem(key, encrypt(JSON.stringify(val.value)));
        }
    }

    watch(val, val => {
        window.localStorage.setItem(key, encrypt(JSON.stringify(val)));
    }, 
    {
        deep: true
    });

    return val;
}

function encrypt(txt) {
    return cryptoJS.AES.encrypt(txt, _key).toString();
}

function decrypt(txtToDecrypt) {
    return cryptoJS.AES.decrypt(txtToDecrypt, _key).toString(cryptoJS.enc.Utf8);
}