import { onMounted } from 'vue';
import { store } from '@/store';
import { supabase } from '@/supabase';
import { onBeforeRouteUpdate } from 'vue-router';

export function useSession() { 
    onMounted(() => {
        supabase.auth.getSession().then(({ data }) => {
            store.session = data.session;
        });

        supabase.auth.onAuthStateChange((_, _session) => {
            store.session = _session;
        });

        onBeforeRouteUpdate((to) => {
            if (!store.session && to.name == 'account')
                return {name:'login'};

            if (store.session && to.name == 'register')
                return {name:'account'};
        });
    });
}
