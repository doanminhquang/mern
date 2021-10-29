import Alert from 'react-bootstrap/Alert'

const AlertMessage = ({ info }) => {
	return info === null ? null : (
		<div style={{position: 'absolute', bottom: 40, left: 10}}>
			<Alert variant={info.type}>{info.message}</Alert>
		</div>
	)
}

export default AlertMessage
