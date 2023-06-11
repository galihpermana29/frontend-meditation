import { Link } from 'react-router-dom';
import logoBeranda from '../../../assets/beranda.png';
import card from '../../../assets/card.png';
import cardHiasan from '../../../assets/card-hiasan.png';
import Card from '../../../components/card';
import { useEffect, useState } from 'react';
import pasienAPI from '../../../api/pasien';

import notfound from '../../../assets/notfound.png';

const PasienHome = () => {
	const [eventsData, setEventsData] = useState([]);
	useEffect(() => {
		const gettingDetailUser = async () => {
			const { data } = await pasienAPI.getDetailUser();
			localStorage.setItem('pasien_data', JSON.stringify(data));
		};

		const getAllEvents = async () => {
			const {
				data: { data },
			} = await pasienAPI.getAllEvents();
			setEventsData(data);
		};
		getAllEvents();
		gettingDetailUser();
	}, []);
	return (
		<div className="md:px-[80px] sm:px-[40px]">
			<div className="sm:flex sm:flex-row-reverse sm:items-center sm:justify-between my-[60px] px-[20px]">
				<div className="img">
					<img src={logoBeranda} alt="verabda" />
				</div>
				<div className="w-full max-w-[400px]">
					<h1 className="text-[30px] sm:text-[40px] font-[700] text-black sm:mb-[40px] mt-[20px]">
						Masa depan sehat dimulai hari ini!
					</h1>
					<p className="text-[12px] sm:text-[16px] font-[400] sm:mb-[50px] mb-[30px]">
						Solusi digital terbaru untuk memudahkan registrasi dan monitoring
						rekam medik di rumah sakit Anda. Hemat waktu dan tenaga dengan
						layanan kami, serta akses catatan kesehatan dari mana saja dan kapan
						saja. Keamanan data Anda adalah prioritas kami dengan teknologi
						enkripsi terbaru.
					</p>
					<Link
						to="/pasien/registrasi"
						className="md:text-[16px] text-[12px] font-[600] bg-green-sage text-white py-[10px] px-[20px] rounded-lg uppercase">
						kunjungi rumah sakit
					</Link>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row items-center bg-[#FFC501] p-[20px] md:p-[30px] relative my-[60px]">
				<div>
					<img src={card} alt="gambar" />
				</div>
				<div className="sm:max-w-[350px] sm:ml-[20px] md:ml-[50px] lg:ml-[70px] mt-[20px] sm:mt-[0]">
					<h1 className="text-[30px] md:text-[40px] font-[700] text-black">
						Masa depan sehat dimulai hari ini!
					</h1>
					<p className="text-[12px] sm:text-[16px] font-[400] sm:mb-[50px] mb-[30px]">
						Lakukan pengisian atau pengeditan kelengkapan data diri sesuai
						dengan data faktual!
					</p>
					<Link
						to="/pasien/data-diri"
						className="md:text-[16px] text-[12px] font-[600] bg-green-sage text-white py-[10px] px-[20px] rounded-lg uppercase">
						edit data diri
					</Link>
				</div>
				<img
					src={cardHiasan}
					alt="gambar"
					className="max-w-[300px] hidden md:block lg:absolute md:right-0 md:top-[30px]"
				/>
			</div>

			<div>
				<p className="font-[600] text-[20px] text-center sm:text-left">
					Riwayat Kunjungan ke Rumah Sakit
				</p>
				{eventsData.length > 0 ? (
					<div className="grid items-start justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 min-h-[70vh] mt-[30px]">
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

export default PasienHome;
