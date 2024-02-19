import * as Storages from '../stores/stores';

const PREFIX = 'CHIT';
const unSubscriptions = [];

const STORE_BLACKLIST = [];

/***
 * Gets a value from browser local storage
 * @param key {string}
 * @returns {string | null}
 */
export function getLocalStore(key) {
    return localStorage.getItem(PREFIX + '_' + key);
}

/***
 * Sets up subscriptions to our svelte stores, and saves their values
 * to browser local storage on change. Don't provide this for stores
 * that don't need to be persisted in the STORE_BLACKLIST.
 *
 * @returns {void}
 */
export function setLocalStorageSubscriptions() {
    Object.keys(Storages)
        .filter((key) => !STORE_BLACKLIST.includes(key))
        .forEach((key) => {
            unSubscriptions.push(
                Storages[key].subscribe((value) => {
                    localStorage.setItem(
                        PREFIX + '_' + key,
                        JSON.stringify(value)
                    );
                })
            );
        });
}

/***
 * Imports data from browser local storage into our svelte stores, where possible.
 * Don't provide this for stores that don't need to be persisted in the STORE_BLACKLIST.
 * @param quizId
 */

export function syncLocalStorageStores() {
    console.debug('Attempting to restore local storage stores...');

    Object.keys(Storages)
        .filter((key) => !STORE_BLACKLIST.includes(key))
        .forEach((key) => {
            // try to get the saved value from browser localstorage
            const value = getLocalStore(key);

            // if we have a value and the store has a set method
            if (value && Storages[key]?.set) {
                // set the svelte store value from the localstorage value
                Storages[key].set(JSON.parse(value));
            }
        });
}
