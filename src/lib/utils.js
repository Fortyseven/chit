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

/******************************************************************************
 * Converts a Blob URL to a base64 string.
 *
 * @param {string} blobUrl - The Blob URL to convert to a base64 string.
 * @return {Promise<string>} A Promise that resolves to the base64 string.
 ******************************************************************************/
export async function convertBlobUrlToBase64(blobUrl) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
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

/******************************************************************************
 * Removes the last, potentially incomplete, sentence from a given text
 * if present.
 *
 * @param {string} text - The text from which to remove the incomplete sentence.
 * @return {string} The text with any unfinished sentences removed.
 ******************************************************************************/
export function stripIncompleteSentence(text) {
    const reSentences = /[\w\n\r\*\?\.\!\"].*/gm;

    let sentences = [];
    let m;

    while ((m = reSentences.exec(text)) !== null) {
        if (m.index === reSentences.lastIndex) {
            reSentences.lastIndex++;
        }

        m.forEach((m, gr) => {
            console.log('m', m, 'gr', gr);
            sentences.push(m);
        });
    }

    sentences = sentences.filter((sent) => '!?.*"\'\n'.includes(sent.at(-1)));

    return sentences.join(' ');
}
