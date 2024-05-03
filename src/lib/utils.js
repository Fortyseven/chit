// https://stackoverflow.com/a/51302511
export function mergeDeep(...objects) {
    const isObject = (obj) => obj && typeof obj === 'object';

    return objects.reduce((prev, obj) => {
        Object.keys(obj).forEach((key) => {
            const pVal = prev[key];
            const oVal = obj[key];

            if (Array.isArray(pVal) && Array.isArray(oVal)) {
                prev[key] = pVal.concat(...oVal);
            } else if (isObject(pVal) && isObject(oVal)) {
                prev[key] = mergeDeep(pVal, oVal);
            } else {
                prev[key] = oVal;
            }
        });

        return prev;
    }, {});
}
/**
 *
 * @param {*} blobUrl
 * @returns
 */
export async function convertBlobUrlToBase64(blobUrl) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                debugger;
                let strip = reader.result.split(',')[1];
                resolve(strip);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', blobUrl);
        xhr.responseType = 'blob';
        xhr.send();
    });
}
