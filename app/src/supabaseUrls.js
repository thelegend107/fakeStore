/** Normalize project URL from env (no trailing slash). */
export function normalizeSupabaseProjectUrl(url) {
    if (!url || typeof url !== 'string') return '';
    return url.replace(/\/+$/, '');
}

const STORAGE_OBJECT_PATH = /^\/storage\/v1\/object\//;

/**
 * Rewrites Supabase Storage public URLs that still point at a previous project host
 * (common after DB copy) to the project URL from VITE_SUPABASE_URL.
 * Non-storage URLs and third-party hosts are returned unchanged.
 */
export function resolveSupabaseHostedUrl(rawUrl, projectUrl = import.meta.env.VITE_SUPABASE_URL) {
    if (!rawUrl || typeof rawUrl !== 'string') return rawUrl;

    const current = normalizeSupabaseProjectUrl(projectUrl);
    if (!current) return rawUrl;

    const legacyPrefix = normalizeSupabaseProjectUrl(import.meta.env.VITE_SUPABASE_LEGACY_URL);
    if (legacyPrefix && rawUrl.startsWith(legacyPrefix)) {
        return current + rawUrl.slice(legacyPrefix.length);
    }

    try {
        const parsed = new URL(rawUrl);
        if (!parsed.hostname.endsWith('.supabase.co')) return rawUrl;
        if (!STORAGE_OBJECT_PATH.test(parsed.pathname)) return rawUrl;

        const currentOrigin = new URL(`${current}/`).origin;
        if (parsed.origin === currentOrigin) return rawUrl;

        parsed.protocol = new URL(`${current}/`).protocol;
        parsed.hostname = new URL(`${current}/`).hostname;
        return parsed.toString();
    } catch {
        return rawUrl;
    }
}

/** Origin + path for Supabase Auth redirect targets (email confirm, etc.). */
export function getAuthRedirectUrl(path) {
    if (typeof window === 'undefined') return path;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${window.location.origin}${normalizedPath}`;
}
