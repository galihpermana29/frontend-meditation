import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import AuthContextProvider from './providers/AuthProviders';
import PasienRoutes from './routes/pasien';
import { useEffect } from 'react';
import RsRoutes from './routes/rs';

import {
	WagmiConfig,
	configureChains,
	createClient,
	goerli,
	mainnet,
	sepolia,
} from 'wagmi';
import { bscTestnet, bsc } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

function App() {
	const loc = window.location.pathname;

	const { chains, provider, webSocketProvider } = configureChains(
		[mainnet, goerli, sepolia, bscTestnet, bsc],
		[publicProvider()]
	);

	const client = createClient({
		provider,
		webSocketProvider,
		autoConnect: true,
		connectors: [new MetaMaskConnector({ chains })],
	});

	useEffect(() => {
		if (loc === '/') window.location.replace('/pasien/login');
	}, []);
	return (
		<BrowserRouter>
			<WagmiConfig client={client}>
				<Routes>
					<Route path="/pasien/*" element={<PasienRoutes />} />
					<Route path="/rs/*" element={<RsRoutes />} />
					<Route
						path="*"
						element={<div> Not Found or You do not have permission.</div>}
					/>
				</Routes>
			</WagmiConfig>
		</BrowserRouter>
	);
}

export default App;
