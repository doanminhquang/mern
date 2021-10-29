import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'
import { AuthContext } from '../contexts/AuthContext'
import { useContext } from 'react'
import { Redirect } from 'react-router-dom'
import Spinner from 'react-bootstrap/Spinner'
import LogoBlue from '../assets/logo-blue.svg'

const Auth = ({ authRoute }) => {
	const {
		authState: { authLoading, isAuthenticated }
	} = useContext(AuthContext)

	let body

	if (authLoading)
		body = (
			<div className='d-flex justify-content-center mt-2'>
				<Spinner animation='border' variant='info' />
			</div>
		)
	else if (isAuthenticated) return <Redirect to='/dashboard' />
	else
		body = (
			<>
				{authRoute === 'login' && <LoginForm />}
				{authRoute === 'register' && <RegisterForm />}
			</>
		)

	return ( 
		<div className='landing'>
			<div className='landing-inner'>
				<img src={LogoBlue} width="60px" height="60px" alt="" />
				{body}
			</div>
		</div>
	)
}

export default Auth
