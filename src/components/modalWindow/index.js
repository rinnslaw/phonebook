import React from 'react';
import ActionButtons from 'components/actionButtons';

class ModalWindow extends React.Component {
    render() {
		const { content, okAction, cancelAction, closeAction, align } = this.props;
        return (
			<div className="modal-window">
				<div className={!!align ? `modal-container ${align}` : 'modal-container'}>
					<div className="close" onClick={closeAction}></div>
					{content}
					{(!!cancelAction && !!okAction) &&
						<ActionButtons 
							okAction={okAction}
							cancelAction={cancelAction}
						/>
					}
				</div>					
			</div>
		)
      }
}

export default ModalWindow;