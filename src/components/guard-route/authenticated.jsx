import { Navigate } from 'react-router-dom';

const AuthenticatedGuardRoute = ({ children, purpose = 'pasien' }) => {
	const token = localStorage.getItem(`${purpose}_token`);
	return token ? children : <Navigate to={`/${purpose}/login`} />;
};

export default AuthenticatedGuardRoute;
