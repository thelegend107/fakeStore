import { toast, updateGlobalOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

updateGlobalOptions({
    autoClose: 2500,
    position: 'bottom-center',
    style: {
      opacity: '1',
      userSelect: 'initial',
    },
    theme: 'dark',
});

export const toastType = {
    default: 0,
    info: 1,
    error: 2,
    success: 3,
    warning: 4
}

export function toastPrimary(msg, type = toastType.default) {
    switch (type) {
        case toastType.info:
            toast.info(msg);
            break;
        case toastType.error:
            toast.error(msg);
            break;
        case toastType.success:
            toast.success(msg);
            break;
        case toastType.warning:
            toast.warning(msg);
            break;
        default:
            toast(msg);
            break;
    }
}