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

export function concatenateEntries(data) {
    const result = data.map(
        (entry) => `${entry.role.toUpperCase()}: ${entry.content}`
    );

    return result.join('\n\n');
}
