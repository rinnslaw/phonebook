import React from 'react';
import { genders } from 'resources/dictionaries';

class Contact extends React.Component {
	render() {
		const { contact, editContact, removeContact } = this.props;
        return (
			<div className="contact">
				<div className="info-part">
					<div className={
						contact.gender === genders.male ? 
							"like-avatar male" : 
							(contact.gender === genders.female ? 
								"like-avatar female" : 
								'like-avatar')
					}></div>
					<div className="main-info">
						<h5 className="name">{contact.name}</h5>
						<span className="phone">{contact.phone}</span>
					</div>
				</div>
				<div className="controls">
					{!!editContact &&
						<div className="edit button"
							onClick={editContact}>
							<svg viewBox="0 0 24 24">
								<path d="M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19H5V5H12V3H5M17.78,4C17.61,4 17.43,4.07 17.3,4.2L16.08,5.41L18.58,7.91L19.8,6.7C20.06,6.44 20.06,6 19.8,5.75L18.25,4.2C18.12,4.07 17.95,4 17.78,4M15.37,6.12L8,13.5V16H10.5L17.87,8.62L15.37,6.12Z" />
							</svg>
						</div>
					}
					{!!removeContact &&
						<div className="remove button"
							onClick={removeContact}>
							<svg viewBox="0 0 24 24">
								<path fill="#000000" d="M1.46,8.88L2.88,7.46L5,9.59L7.12,7.46L8.54,8.88L6.41,11L8.54,13.12L7.12,14.54L5,12.41L2.88,14.54L1.46,13.12L3.59,11L1.46,8.88M15,4A4,4 0 0,1 19,8A4,4 0 0,1 15,12A4,4 0 0,1 11,8A4,4 0 0,1 15,4M15,5.9A2.1,2.1 0 0,0 12.9,8A2.1,2.1 0 0,0 15,10.1C16.16,10.1 17.1,9.16 17.1,8C17.1,6.84 16.16,5.9 15,5.9M15,13C17.67,13 23,14.33 23,17V20H7V17C7,14.33 12.33,13 15,13M15,14.9C12,14.9 8.9,16.36 8.9,17V18.1H21.1V17C21.1,16.36 17.97,14.9 15,14.9Z" />
							</svg>
						</div>
					}
				</div>
			</div>
		)
      }
}

export default Contact;