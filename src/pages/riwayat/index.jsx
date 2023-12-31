import { Input } from 'antd';
import Card from '../../components/card';
import { useEffect, useState } from 'react';
import pasienAPI from '../../api/pasien';

import notfound from '../../assets/notfound.png';

const RiwayatKunjungan = () => {
	const [eventsData, setEventsData] = useState([]);
	const [idSearch, setIdSearch] = useState(null);
	const [statusSearch, setStatusSearch] = useState(null);

	const handleChangeSearch = async (e) => {
		setIdSearch(e.target.value);
	};
	useEffect(() => {
		const getAllEvents = async () => {
			let params = '';

			if (idSearch && statusSearch) {
				params = new URLSearchParams({ id: idSearch, status: statusSearch });
			}
			if (idSearch) {
				params = new URLSearchParams({ id: idSearch });
			}
			if (statusSearch) {
				params = new URLSearchParams({ status: statusSearch });
			}
			try {
				const {
					data: { data },
				} = await pasienAPI.getAllEvents(params);
				setEventsData(data);
			} catch (error) {
				setEventsData([]);
			}
		};
		getAllEvents();
	}, [idSearch, statusSearch]);
	return (
		<div>
			<div className="bg-riwayat-bg h-[400px] flex justify-center px-[20px]">
				<div className=" flex justify-center flex-col max-w-[800px] w-full">
					<p className="text-center text-[24px] font-[600] text-white mb-[15px]">
						Riwayat Kunjungan
					</p>
					<Input
						onChange={handleChangeSearch}
						placeholder="Cari berdasarkan nomor rekam medis"
						className="text-input"
					/>
					<div className="flex items-center justify-center gap-[10px] mt-[20px] flex-wrap">
						<div
							onClick={() =>
								setStatusSearch(
									statusSearch === 'terdaftar' ? null : 'terdaftar'
								)
							}
							className={`border-[1px] border-white rounded-[32px] px-[10px] text-white font-[300] text-[13px] py-[5px] cursor-pointer ${
								statusSearch === 'terdaftar' ? 'bg-slate-500' : ''
							}`}>
							Terdaftar
						</div>
						<div
							onClick={() =>
								setStatusSearch(
									statusSearch === 'dirawat di faskes 1'
										? null
										: 'dirawat di faskes 1'
								)
							}
							className={`${
								statusSearch === 'dirawat di faskes 1' ? 'bg-slate-500' : ''
							} border-[1px] border-white rounded-[32px] px-[10px] text-white font-[300] text-[13px] py-[5px] cursor-pointer`}>
							Dirawat di Faskes 1
						</div>
						<div
							onClick={() =>
								setStatusSearch(
									statusSearch === 'dirawat di faskes 2'
										? null
										: 'dirawat di faskes 2'
								)
							}
							className={`${
								statusSearch === 'dirawat di faskes 2' ? 'bg-slate-500' : ''
							} border-[1px] border-white rounded-[32px] px-[10px] text-white font-[300] text-[13px] py-[5px] cursor-pointer`}>
							Dirawat di Faskes 2
						</div>
						<div
							onClick={() =>
								setStatusSearch(statusSearch === 'selesai' ? null : 'selesai')
							}
							className={`${
								statusSearch === 'selesai' ? 'bg-slate-500' : ''
							} border-[1px] border-white rounded-[32px] px-[10px] text-white font-[300] text-[13px] py-[5px] cursor-pointer`}>
							Selesai Pengobatan
						</div>
					</div>
				</div>
			</div>
			<div className="md:px-[80px] sm:px-[40px] mt-[40px]">
				{eventsData.length > 0 ? (
					<div className="grid items-start justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-[10px] min-h-[70vh]">
						{eventsData.map((dat) => (
							<div>
								<Card data={dat} />
							</div>
						))}
					</div>
				) : (
					<div className="my-[40px] flex justify-center items-center flex-col">
						<div>
							<img src={notfound} alt="not found" className="max-w-[400px]" />
						</div>
						<div className="font-[600] text-[24px mt-[24px]">
							Belum ada riwayat kunjungan{' '}
						</div>
						<div className="font-[300] text-[24px my-[24px] max-w-[400px] text-center">
							Pasien ini belum memiliki ringkasan kepulangan pasien, silakan
							menambahkan ringkasan kepulangan pasien terlebih dahulu!{' '}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default RiwayatKunjungan;
