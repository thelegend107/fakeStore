import { ref } from 'vue';
import { supabase } from '@/supabase';

export default function () {
    const session = ref();

    supabase.auth.getSession().then(({ data }) => {
        session.value = data.session;
    });

    supabase.auth.onAuthStateChange((_, _session) => {
        session.value = _session;
    });

    return session;
}
