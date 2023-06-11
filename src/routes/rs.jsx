import { Route, Routes } from 'react-router-dom';
import Navbar from '../components/navbar';
import Registrasi from '../pages/pasien/registrasi';
import DetailRegistrasi from '../pages/pasien/registrasi/detail';
import Tiket from '../pages/pasien/tiket';
import DataDiri from '../pages/pasien/data-diri';
import AuthenticatedGuardRoute from '../components/guard-route/authenticated';
import DataPasien from '../pages/rs/riwayat';
import DetailPasien from '../pages/rs/detail-pasien';
import RingkasanRekamMedis from '../pages/rs/ringkasan-rekam';
import Footer from '../components/footer';

const RsRoutes = () => {
	return (
		<>
			<Navbar />
			<Routes>
				<Route
					exact
					path="/"
					element={
						<AuthenticatedGuardRoute purpose="rs">
							<DataPasien />
						</AuthenticatedGuardRoute>
					}
				/>
				<Route
					exact
					path="/detail-pasien/:eventId"
					element={
						<AuthenticatedGuardRoute purpose="rs">
							<DetailPasien />
						</AuthenticatedGuardRoute>
					}
				/>
				<Route
					exact
					path="/detail-rekam-medis/:id"
					element={
						<AuthenticatedGuardRoute purpose="rs">
							<RingkasanRekamMedis />
						</AuthenticatedGuardRoute>
					}
				/>

				<Route
					exact
					path="/pasien/registrasi"
					element={
						<AuthenticatedGuardRoute>
							<Registrasi />
						</AuthenticatedGuardRoute>
					}
				/>

				<Route
					exact
					path="/pasien/registrasi/:id"
					element={
						<AuthenticatedGuardRoute>
							<DetailRegistrasi />
						</AuthenticatedGuardRoute>
					}
				/>

				<Route
					exact
					path="/pasien/tiket/:id"
					element={
						<AuthenticatedGuardRoute>
							<Tiket />
						</AuthenticatedGuardRoute>
					}
				/>
				<Route
					exact
					path="/pasien/data-diri"
					element={
						<AuthenticatedGuardRoute>
							<DataDiri />
						</AuthenticatedGuardRoute>
					}
				/>
			</Routes>
			<Footer />
		</>
	);
};

export default RsRoutes;
