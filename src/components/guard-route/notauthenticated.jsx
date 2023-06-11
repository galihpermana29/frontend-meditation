import { Navigate } from 'react-router-dom';

const NotauthenticatedGuardRoute = ({ children, purpose = 'pasien' }) => {
	const token = localStorage.getItem(`${purpose}_token`);
	//check if cookie is empty then guard
	return token ? <Navigate to={purpose} /> : children;
};

export default NotauthenticatedGuardRoute;
