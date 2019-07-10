import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchData, deleteContact, setCurrentContact, 
		 updateContact, normalizeContactsData, clearUpdates,
		 addUpdatedContacts, addNewContacts, removeContacts } from 'ducks/phoneBook';
import Contact from 'components/contact';
import ModalWindow from 'components/modalWindow';
import EditContactForm from 'components/editContactForm';
import { actions } from 'resources/dictionaries';
import { ContactData } from 'resources/dataStructures'
import { genders } from 'resources/dictionaries';
import * as Papa from 'papaparse';

const uuidv1 = require('uuid/v1');
const JSONtoCSV = require("json2csv").parse;

class PhoneBook extends Component {
	componentWillMount() {
		this.props.fetchData();
	}

	addContactHandler = () => {
		this.props.setCurrentContact({id:uuidv1(), action:actions.create});
	}

	clearCurrentContact = () => {
		this.props.setCurrentContact({id:null, action: null});
	}

	savePhoneBookToFile = (e) => {
		e.preventDefault();
		const phoneBook = this.props.contactList.map(id => {
			return this.props.contacts[id]
		});
		var csv = JSONtoCSV(phoneBook, { fields: ["id", "name", "gender", "phone" ]});
		var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const fileName = 'phonebook.csv';
		var link = document.createElement("a");
		if (link.download !== undefined) { 
			var url = URL.createObjectURL(blob);
			link.setAttribute("href", url);
			link.setAttribute("download", fileName);
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}

	uploadPhoneBookFromFile = (e) => {
		const file = e.target.files[0];
		try {
			Papa.parse(file, {
				dynamicTyping: false,
				complete: (results) => {
					const [names, ...contactsRows] = results.data;
					const contacts = contactsRows.map((row, i) => {
						return names.reduce((memo, item, index) => {
							return memo = {
								...memo,
								[item]:row[index]
							} 
						}, {})							
					});
					this.props.normalizeContactsData(contacts, true);
				}
			})
		} catch (err) {
			alert(e.message);
		}
	}

	clickFileInput = (e) => {
		e.target.value = '';
	}

	confirmNewGuys = () => {
		this.props.addNewContacts();
	}

	confirmUpdatedGuys = () => {
		this.props.addUpdatedContacts();
	}

	confirmRemoveGuys = () => {
		this.props.removeContacts();
	}
	
	clearUpdated =() => {
		this.props.clearUpdates();
	}

    render() {
		const { contactList, contacts, deleteContact, updateContact,
				setCurrentContact, currentContact, currentAction,
				mergedNotInListIds, newParamsIDs, newValues, mergedToRemoveIDs } = this.props;

		const removeModalWindowContent = (
			<h6>Are you sure to delete this contact?</h6>
		);

		const editModalWindowContent = (
			<EditContactForm 
				contact={{...contacts[currentContact]}}
				cancelAction={this.clearCurrentContact} 
				submitAction={(data)=>updateContact(data)}
			/>
		)
		const createModalWindowContent = (
			<EditContactForm 
				contact={new ContactData(currentContact, '', '+', genders.male)}
				cancelAction={this.clearCurrentContact} 
				submitAction={(data)=>updateContact(data)}
			/>
		)
		const mergeModalWindowContent = (
			<div className="changes-in-contacts">
				{(!!mergedNotInListIds && mergedNotInListIds.length > 0) && 
					<React.Fragment>
						<h6>New guys</h6>	
						<div className="contacts-list">
							{mergedNotInListIds.map(id => {
									return (
										<Contact 
											key={id}
											contact={newValues[id]}
										/>
									)
								})
							}
							<button 
								className="btn btn-default"
								onClick={this.confirmNewGuys}
								>Confirm</button>
						</div>
					</React.Fragment>
				}
				<br />
				{(!!newParamsIDs && newParamsIDs.length > 0) &&
					<React.Fragment>
						<h6>Updated guys</h6>
						<div className="contacts-list">
							{!!newParamsIDs && newParamsIDs.map(id => {
									return (
										<Contact 
											key={id}
											contact={newValues[id]}
										/>
									)
								})
							}
							<button 
								className="btn btn-default"
								onClick={this.confirmUpdatedGuys}
							>
								Confirm
							</button>
						</div>
					</React.Fragment>
				}
				<br />
				{(!!mergedToRemoveIDs && mergedToRemoveIDs.length > 0) &&
					<React.Fragment>
						<h6>Guys to remove</h6>
						<div className="contacts-list">
							{!!mergedToRemoveIDs && mergedToRemoveIDs.map(id => {
									return (
										<Contact 
											key={id}
											contact={contacts[id]}
										/>
									)
								})
							}
							<button 
								className="btn btn-default"
								onClick={this.confirmRemoveGuys}
							>
								Confirm
							</button>
						</div>
					</React.Fragment>
				}
			</div>
		)
        return (
			<React.Fragment>
				{!!currentContact &&
				<React.Fragment>
					{currentAction === actions.remove &&
						<ModalWindow 
							content={removeModalWindowContent}
							okAction={()=>deleteContact(currentContact)}
							cancelAction={this.clearCurrentContact}
							closeAction={this.clearCurrentContact}
						/>
					}
					{currentAction === actions.edit &&
						<ModalWindow 
							content={editModalWindowContent}
							closeAction={this.clearCurrentContact}
						/>
					}
					{currentAction === actions.create &&
						<ModalWindow 
							content={createModalWindowContent}
							closeAction={this.clearCurrentContact}
						/>
					}
					</React.Fragment>
				}
				{((!!mergedNotInListIds && mergedNotInListIds.length > 0) || 
				  (!!newParamsIDs && newParamsIDs.length>0) || 
				  (!!mergedToRemoveIDs && mergedToRemoveIDs.length>0)) &&
					<ModalWindow
						align={'left'}
						content={mergeModalWindowContent}
						closeAction={this.clearUpdated}
					/>
				}

				<div className="contacts-list-container">
					<div className="contacts-list-header">
						<h2>Phonebook</h2> 
						<div 
							className="edit button" 
							onClick={this.addContactHandler}>
							<svg viewBox="0 0 24 24">
								<path fill="#000000" d="M15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4M15,5.9C16.16,5.9 17.1,6.84 17.1,8C17.1,9.16 16.16,10.1 15,10.1A2.1,2.1 0 0,1 12.9,8A2.1,2.1 0 0,1 15,5.9M4,7V10H1V12H4V15H6V12H9V10H6V7H4M15,13C12.33,13 7,14.33 7,17V20H23V17C23,14.33 17.67,13 15,13M15,14.9C17.97,14.9 21.1,16.36 21.1,17V18.1H8.9V17C8.9,16.36 12,14.9 15,14.9Z" />
							</svg>
						</div>
					</div>

					{(!!contactList) ? 
						(<div className="contacts-list">
							{contactList.map(id => {
								return (
										<Contact 
											key={id}
											contact={contacts[id]}
											editContact={()=>setCurrentContact({id, action:actions.edit})}
											removeContact={()=>setCurrentContact({id, action:actions.remove})}
										/>
									)
								})
							}
						</div>):
						(<div className="contacts-list">
							Guess no contacts in your phonebook..
						</div>)
					}
					<div className="files-footer">
					<button 
						className="btn btn-default download-button" 
						onClick={this.savePhoneBookToFile}>
						Download csv file
					</button>
					<input 
						type="file" 
						className="custom-file-input"
						onClick={this.clickFileInput}
						onChange={this.uploadPhoneBookFromFile}/>
					</div>
				</div>
			</React.Fragment>
        );
    }
}

const mapStateToProps = state => {
  return {
    contactList: state.phoneBook.contactList,
	contacts: state.phoneBook.contacts,
	currentContact: state.phoneBook.currentContact,
	currentAction: state.phoneBook.currentAction,
	mergedNotInListIds:state.phoneBook.mergedNotInListIds,
	newParamsIDs:state.phoneBook.newParamsIDs,
	mergedToRemoveIDs:state.phoneBook.mergedToRemoveIDs,
	newValues:state.phoneBook.newValues
  };
};

const mapDispatchToProps = dispatch => {
  return {
	fetchData: () => dispatch(fetchData()),
	deleteContact: (id) => dispatch(deleteContact(id)),
	setCurrentContact: (id) => dispatch(setCurrentContact(id)),
	updateContact: (data) => dispatch(updateContact(data)),
	normalizeContactsData: (data, fromCSV) => dispatch(normalizeContactsData(data, fromCSV)),
	addNewContacts:() => dispatch(addNewContacts()),
	addUpdatedContacts:() => dispatch(addUpdatedContacts()),
	removeContacts:() => dispatch(removeContacts()),
	clearUpdates:() => dispatch(clearUpdates()),
  };
};

export default connect(
	mapStateToProps, 
	mapDispatchToProps)
(PhoneBook);