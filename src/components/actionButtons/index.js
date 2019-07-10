import React from 'react';

class ActionButtons extends React.Component {
    render() {
		const { okAction, cancelAction } = this.props;
        return (
			<div className="action-buttons">
				<button 
					className="btn btn-primary" 
					onClick={okAction}>
					Ok
				</button> 
				<button 
					className="btn btn-default" 
					onClick={cancelAction}>
					Cancel
				</button> 
			</div>
		)
      }
}

export default ActionButtons;