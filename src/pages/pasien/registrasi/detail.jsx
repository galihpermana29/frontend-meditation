import { Form } from 'antd';

import rs from '../../../assets/RS.png';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import pasienAPI from '../../../api/pasien';

const DetailRegistrasi = () => {
	const { id } = useParams();
	const [detail, setDetail] = useState({
		detailFaskesSatu: '',
		detailFaskesRujukan: '',
		jaminanPembiayaan: '',
		poliklinik: '',
		tanggalKunjungan: '',
	});
	const {
		detailFaskesSatu,
		detailFaskesRujukan,
		jaminanPembiayaan,
		poliklinik,
		tanggalKunjungan,
	} = detail;

	useEffect(() => {
		const getDetailEvent = async () => {
			const {
				data: { data },
			} = await pasienAPI.getDetailEvent(id);
			setDetail(data);
		};
		getDetailEvent();
	}, []);
	return (
		<div className="bg-white min-h-[140vh]">
			<div className="bg-riwayat-bg h-[400px] flex justify-center px-[20px]"></div>
			<div className="py-[30px] px-[40px] shadow-md rounded-lg max-w-[900px] absolute left-0 right-0 my-0 mx-auto top-[200px] z-10 bg-white">
				<div className="flex gap-[20px] flex-wrap">
					<div className="md:flex-1">
						<img src={rs} alt="rs" />
					</div>
					<div className="flex-1">
						<div className="font-[600] text-[18px]">
							Detail Rumah Sakit Tujuan
						</div>
						<div className="font-[600] text-[18px] mt-[10px]">
							{detail.faskesActive === detail.faskesSatu
								? detailFaskesSatu.rsName
								: detailFaskesRujukan.rsName}
						</div>
						<div className="font-[400] text-[14px] mt-[10px]">
							Alamat: Lorem ipsum dolor sit amet, consectetur adipisicing elit.
							Aliquid, fugiat. Lorem ipsum, dolor sit amet consectetur
							adipisicing elit. Sit, tempora.
							<br />
							<br />
							Jam: Senin, 07.00 - 15.00
							<br />
							<br />
							Telepon: (0341) 403000
						</div>
					</div>
				</div>
				<div className="mt-[40px]">
					<h1 className="font-[600] text-[15px] md:text-[20px]">
						Detail Registrasi
					</h1>

					<Form>
						<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
							Status Kunjungan
						</div>
						<p className="font-[400] text-[14px] text-[#9CA3AF]">
							{detail.eventStatus === 'terdaftar' &&
								' Menunggu tanggapan faskes pertama'}
							{detail.eventStatus === 'dirawat di faskes 1' &&
								' Anda mendapatkan penanganan di faskes 1'}
							{detail.eventStatus === 'dirawat di faskes 2' &&
								' Anda mendapatkan penanganan di faskes 2'}
							{detail.eventStatus === 'selesai' && 'Pengobatan anda selesai'}
						</p>
						<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
							Fasilitas Kesehatan Pertama
						</div>
						<p className="font-[400] text-[14px] text-[#9CA3AF]">
							{detailFaskesSatu.rsName}
						</p>
						<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
							Fasilitas Kesehatan Rujukan
						</div>
						<p className="font-[400] text-[14px] text-[#9CA3AF]">
							{detailFaskesRujukan === null
								? '-'
								: ` ${detailFaskesRujukan.rsName}`}
						</p>
						<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
							Jaminan Pembiayaan
						</div>
						<p className="font-[400] text-[14px] text-[#9CA3AF] capitalize">
							{jaminanPembiayaan}
						</p>
						<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
							Poliklinik
						</div>
						<p className="font-[400] text-[14px] text-[#9CA3AF] capitalize">
							{poliklinik}
						</p>
						<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
							Tanggal Kunjungan
						</div>
						<p className="font-[400] text-[14px] text-[#9CA3AF] capitalize">
							{tanggalKunjungan}
						</p>
						<Form.Item noStyle>
							<Link
								to={`/pasien/tiket/${id}`}
								className="rounded-lg text-center flex justify-center items-center bg-green-sage text-white text-[16px] font-[600] h-[40px] w-full mt-[30px]">
								LIHAT NOMOR TIKET
							</Link>
						</Form.Item>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default DetailRegistrasi;
