import * as Storages from '../stores/stores';
import * as Storages_ChatState from '../stores/chatState';
import * as Storages_Templates from '../stores/templates';

const PREFIX = 'CHIT';
const unSubscriptions = [];

const STORE_BLACKLIST = [
    'model_settings',
    'DEFAULT_OL_ENDPOINT',
    'responseInProgress',
    'chatState_type',
    'chatState_defaults',
    'chatState_resetToDefaults',
    'sysVariables',
    'systemPromptTemplated',
    'contentEl',
    'isBeingEditedIndex'
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
    console.debug('💾 Setting up local storage subscriptions...');
    _setLocalStoreSubscriptionsGroup(Storages);
    _setLocalStoreSubscriptionsGroup(Storages_ChatState);
    _setLocalStoreSubscriptionsGroup(Storages_Templates);
}

function _syncLocalStorageStores_Group(group) {
    Object.keys(group)
        .filter((key) => !STORE_BLACKLIST.includes(key))
        .forEach((key) => {
            // try to get the saved value from browser localstorage
            let value = getLocalStore(key);

            // console.debug(`💾 Syncing ${key} from local storage...`, value);

            if (key === 'chatTimeline' && !Array.isArray(value)) {
                console.error('💾 chatTimeline is not an array; ignoring');
                return;
            }

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
    console.debug('💾 Attempting to restore local storage stores...');

    _syncLocalStorageStores_Group(Storages);
    _syncLocalStorageStores_Group(Storages_ChatState);
    _syncLocalStorageStores_Group(Storages_Templates);

    Storages_Templates.cleanupTemplateVars();
}
