import React from 'react';
import { genders } from 'resources/dictionaries';
import { ContactData } from 'resources/dataStructures';

class EditContactForm extends React.Component {
	state = {
		name: '',
		phone: '',
		gender: '',
		warningText: ''
	}

	componentWillMount() {
		const {name, phone, gender} = this.props.contact;
		this.setState({name, phone, gender});
	}

	onNameChange = (e) => {
		const name = e.target.value;
		this.setState({name});
	}

	onPhoneChange = (e) => {
		const phone = e.target.value;
		if (/^[\d  +]+$/.test(phone)) {
			this.setState({phone});
		} else {
			this.setState({warningText: 'You phone number can contain only numbers spacebars and plus'});
		}
	}

	onGenderChange = (e) => {
		const gender = e.target.name;
		this.setState({gender});
	}

	hideNotification = () => {
		this.setState({warningText:''});
	}
	
	submitForm = (e) => {
		e.preventDefault();
		const { name, phone, gender } = this.state;
		if (name.length < 1) {
			this.setState({warningText: 'Please enter name'});
			return;
		}
		if (name.indexOf('\'') >= 0 || name.indexOf('"') >= 0) {
			this.setState({warningText: 'Please dont use quotation marks in name'});
			return;
		}
		if (phone.length < 10) {
			this.setState({warningText: 'You phone number less then 10 symbols'});
			return;
		}
		if (phone.substring(0, 1) !== "+") {
			this.setState({warningText: 'You phone number must starts with +'});
			console.log(phone.substring(0, 1))
			return;
		}
		const {id} = this.props.contact;
		const newContact = new ContactData(id, name, phone, gender);
		this.props.submitAction(newContact);
	}

    render() {
		const { name, phone, gender, warningText } = this.state;
		return (
			<React.Fragment>
				<h6>Contact</h6>
				<form className="edit-contact-form" onSubmit={this.submitForm}>
					<input 
						value={name} 
						onChange={this.onNameChange} 
					/>
					<input 
						value={phone}
						onChange={this.onPhoneChange} 
					/>
					<div className="radio-group-row">
						{Object.keys(genders).map(item => {
							return (
								<span key={item} className="radio-group">
									<input 
										type="radio" 
										id={item}
										name={item} 
										checked={item === gender}
										onChange={this.onGenderChange}
									/>
									<label htmlFor={item}>{item}</label>
								</span>
							)
						})}
					</div>
					<br/>
					<button 
						style={{margin: 0}}
						className="btn btn-primary" 
						>
						Save contact
					</button>
					{!!warningText &&
						<div className="warning">
							<div className="close" onClick={this.hideNotification}></div>
							{warningText}
						</div>
					}
				</form>
			</React.Fragment>
		)
    }
}

export default EditContactForm;