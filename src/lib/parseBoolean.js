export function parseBoolean(string) {
    return !!((string === 'true') || parseInt(string));
}
