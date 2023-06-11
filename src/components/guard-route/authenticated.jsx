import { Navigate } from 'react-router-dom';

const AuthenticatedGuardRoute = ({ children, purpose = 'pasien' }) => {
	console.log(purpose);
	const token = localStorage.getItem(`${purpose}_token`);
	console.log(token);
	return token ? children : <Navigate to={`/${purpose}/login`} />;
};

export default AuthenticatedGuardRoute;
