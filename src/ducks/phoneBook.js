import { createAction, createReducer } from 'redux-act';
import axios from 'axios';
import { normalize, schema } from 'normalizr';

const REDUCER = 'CONTACTS';
const NS = `@@${REDUCER}/`;
export const loadPhonebookToStore = createAction(`${NS}_PHONE_BOOK_IS_ONBOARD`);
export const deleteContact = createAction(`${NS}_CONTACT_WAS_DELETED`);
export const setCurrentContact = createAction(`${NS}_CONTACT_IS_CURRENT`);
export const updateContact = createAction(`${NS}_CONTACT_WAS_UPDATED`);
export const loadMergeToStore = createAction(`${NS}_STUFF_TO_MERGE_IS_ONBOARD`);
export const addNewContacts = createAction(`${NS}_NEW_CONTACTS_WERE_ADDED`);
export const addUpdatedContacts = createAction(`${NS}_UPDATED_CONTACTS_WERE_REPLACED`);
export const removeContacts = createAction(`${NS}_CONTACTS_WERE_REMOVED`);
export const clearUpdates = createAction(`${NS}_UPDATES_WERE_CLEARED`);


export const normalizeContactsData = (data, fromCSV = false) => (dispatch, getState) => {
	const originalData = {
		contacts : data
	}
	const contact = new schema.Entity('contacts');
	const normalizedData = normalize(originalData, {
			contacts: [contact]
	});
	const contacts = normalizedData.entities.contacts;
	const contactList = normalizedData.result.contacts;

	if (!fromCSV) {
		dispatch(loadPhonebookToStore({
			contacts,
			contactList
		}))
	} else {
		const oldcontactList = getState().phoneBook.contactList;
		const oldContacts = getState().phoneBook.contacts;
		//new contacts
		const mergedNotInListIDs = contactList.filter(value => !oldcontactList.includes(value));
		//contacts to remove
		const mergedToRemoveIDs = oldcontactList.filter(value => !contactList.includes(value));
		//old contacts with new parameters
		const isInList = contactList.filter(value => oldcontactList.includes(value));
		const newParamsIDs = isInList.reduce((memo, id) => {
			return JSON.stringify(oldContacts[id]) !== JSON.stringify(contacts[id]) ? [...memo, id] : memo;
		}, []);

		dispatch(loadMergeToStore({ 
			mergedNotInListIDs,
			newParamsIDs,
			contacts,
			mergedToRemoveIDs
		}))
		
	}
}

export const fetchData = () => (dispatch) => {
	axios.get(`/files/phonebook.json`)
	.then(response => {
		if (!!response && 'data' in response) {
			dispatch(normalizeContactsData(response.data));
		}
	}).catch(error => {
		alert(error.message);
	});
};

const initialState = {
	contacts: {},
	contactList: [],
	currentContact: null,
	currentAction: null,
	//merge from file
	mergedNotInListIds: null,
	newParamsIDs: null,
	newValues: null,
	mergedToRemoveIDs: null
};

export default createReducer(
    {
        [loadPhonebookToStore]: (state, data) => ({
			...state,
			contacts: data.contacts,
			contactList: data.contactList,
        }),
		[deleteContact]: (state, id) => {
			const newContactList = state.contactList.filter(item => {return item !== id && item });
			const {[id]:toRemove, ...newContacts} = state.contacts;
			return {
				...state,
				contacts: newContacts,
				contactList: newContactList,
				currentContact: null,
				currentAction: null
			}
		},
		[setCurrentContact]: (state, data) => ({
			...state,
			currentContact: data.id,
			currentAction: data.action
        }),
		[updateContact]: (state, data) => {
			const currentContact = state.currentContact;
			const oldContactList = state.contactList;
			const contactList = currentContact in state.contacts ? oldContactList : [...oldContactList, currentContact];
			return {
				...state,
				contacts: {
					...state.contacts,
					[state.currentContact]:data
				},
				contactList: contactList,
				currentContact: null,
				currentAction: null
			}
		},
		[loadMergeToStore]: (state, data) => {
			return {
				...state,
				mergedNotInListIds: data.mergedNotInListIDs,
				newParamsIDs: data.newParamsIDs,
				newValues: data.contacts,
				mergedToRemoveIDs: data.mergedToRemoveIDs
			}
		},
		[addNewContacts]: (state) => {
			const newContactList = [...state.contactList, ...state.mergedNotInListIds];
			const newContacts = state.mergedNotInListIds.reduce((memo, id) => {
				return {...memo,
						[id]: state.newValues[id]}
				}, state.contacts);

			return {
				...state,
				contacts: newContacts,
				contactList: newContactList,
				mergedNotInListIds: null
			}
		},
		[addUpdatedContacts]: (state) => {
			const newContacts = state.contactList.reduce((memo, id) => {
				if (state.newParamsIDs.includes(id)) {
					return {...memo,
						[id]: state.newValues[id]
					}
				} else {
					return {...memo,
						[id]: state.contacts[id]
					}
				}
			}, state.contacts);
			return {
				...state,
				contacts: newContacts,
				newParamsIDs: null,
			}
		},
		[removeContacts]: (state) => {
			const newContacts = state.contactList.reduce((memo, id) => {
				if (state.mergedToRemoveIDs.includes(id)) {
					const {removed, ...newMemo} = memo;
					return {...newMemo}
				} else {
					return {...memo}
				}
			}, state.contacts);
			const newContactList = state.contactList.filter(item => !state.mergedToRemoveIDs.includes(item));

			return {
				...state,
				contacts: newContacts,
				contactList: newContactList,
				mergedToRemoveIDs: null,
			}
		},
		[clearUpdates]: (state) => ({
			...state,
			mergedNotInListIds: null,
			newParamsIDs: null,
			newValues: null,
			mergedToRemoveIDs: null
		})
    },
    initialState
);