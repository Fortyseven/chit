import * as Storages from '../stores/stores';
import * as Storages_ChatState from '../stores/chat_state';

const PREFIX = 'CHIT';
const unSubscriptions = [];

const STORE_BLACKLIST = [
    'model_settings',
    'DEFAULT_API_ENDPOINT',
    'inferringInProgress',
    'isInferring',
    'chat_state_type',
    'chat_state_defaults'
];

/***
 * Gets a value from browser local storage
 * @param key {string}
 * @returns {string | null}
 */
export function getLocalStore(key) {
    return localStorage.getItem(PREFIX + '_' + key);
}

function _setLocalStoreSubscriptionsGroup(group) {
    Object.keys(group)
        .filter((key) => !STORE_BLACKLIST.includes(key))
        .forEach((key) => {
            if (group[key].constructor == 'Array') {
                //
            } else {
                try {
                    unSubscriptions.push(
                        group[key].subscribe((value) => {
                            localStorage.setItem(
                                PREFIX + '_' + key,
                                JSON.stringify(value)
                            );
                        })
                    );
                } catch (e) {
                    console.error(`Error subscribing to '${key}' skipping...`);
                }
            }
        });
}

/***
 * Sets up subscriptions to our svelte stores, and saves their values
 * to browser local storage on change. Don't provide this for stores
 * that don't need to be persisted in the STORE_BLACKLIST.
 *
 * @returns {void}
 */
export function setLocalStorageSubscriptions() {
    _setLocalStoreSubscriptionsGroup(Storages);
    _setLocalStoreSubscriptionsGroup(Storages_ChatState);
}

function _syncLocalStorageStores_Group(group) {
    Object.keys(group)
        .filter((key) => !STORE_BLACKLIST.includes(key))
        .forEach((key) => {
            // try to get the saved value from browser localstorage
            const value = getLocalStore(key);

            // if we have a value and the store has a set method
            if (value && group[key]?.set) {
                // set the svelte store value from the localstorage value
                try {
                    group[key].set(JSON.parse(value));
                } catch (e) {
                    console.error(`Error setting ${key}; skipping...`);
                }
            }
        });
}

/***
 * Imports data from browser local storage into our svelte stores, where possible.
 * Don't provide this for stores that don't need to be persisted in the STORE_BLACKLIST.
 * @param quizId
 */

export function restoreLocalStorageStores() {
    console.debug('Attempting to restore local storage stores...');

    _syncLocalStorageStores_Group(Storages);
    _syncLocalStorageStores_Group(Storages_ChatState);
}
