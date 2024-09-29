export function isUrl(str) {
    if (!str.startsWith('http')) {
        return false;
    }

    try {
        new URL(str);
        return true;
    } catch (e) {
        return false;
    }
}
