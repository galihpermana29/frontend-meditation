import { Button, Checkbox, DatePicker, Form, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import pasienAPI from '../../../api/pasien';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const Registrasi = () => {
	const [form] = Form.useForm();
	const user = JSON.parse(localStorage.getItem('pasien_data'));

	const navigate = useNavigate();
	const [rsData, setRsData] = useState([]);
	const [rujukanStatus, setRujukanStatus] = useState(false);

	const promptMessage = (msg) => {
		message.info(msg);
	};

	const handleRegis = async (value) => {
		const newTanggalKunjungan = moment(value.tanggalKunjungan.$d).format(
			'YYYY-MM-DD'
		);

		try {
			const {
				data: { data },
			} = await pasienAPI.createEvent({
				...value,
				tanggalKunjungan: newTanggalKunjungan,
				eventStatus: 'terdaftar',
			});
			promptMessage('Registrasi berhasil!');
			navigate(`/pasien/registrasi/${data._id}`);
		} catch (error) {
			console.log(error, 'error');
			promptMessage(error.message);
		}
	};

	const onChangeRujukan = (e) => {
		setRujukanStatus(e.target.checked);
	};

	useEffect(() => {
		const getRsData = async () => {
			const {
				data: { user },
			} = await pasienAPI.getAllRS();
			const newRsData = user.map((data) => ({
				value: data._id,
				label: data.rsName,
			}));

			setRsData(newRsData);
		};

		getRsData();
		form.setFieldsValue({ faskesSatu: user.user.faskesSatu });
	}, []);
	return (
		<div className="bg-white min-h-[100vh]">
			<div className="bg-riwayat-bg h-[400px] flex justify-center px-[20px] "></div>
			<div className="py-[30px] px-[40px] shadow-md rounded-lg max-w-[900px] absolute left-0 right-0 my-0 mx-auto top-[200px] z-10 bg-white">
				<h1 className="font-[600] text-[15px] md:text-[20px]">
					Form Registrasi
				</h1>
				<p className="font-[400] text-[14px] text-[#9CA3AF]">
					Lengkapi form regristrasi dibawah ini!
				</p>
				<Form form={form} onFinish={handleRegis}>
					<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
						Status Kunjungan
					</div>
					<Form.Item noStyle>
						<Checkbox onChange={onChangeRujukan}>Rujukan</Checkbox>
					</Form.Item>
					<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
						Fasilitas Kesehatan Pertama
					</div>
					<Form.Item
						name={'faskesSatu'}
						rules={[
							{
								required: true,
								message: 'Masukkan faskes pertama sesuai BPJS',
							},
						]}>
						<Select
							disabled
							className="w-full"
							placeholder="Masukkan faskes pertama"
							options={rsData}
						/>
					</Form.Item>
					{rujukanStatus && (
						<>
							<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
								Fasilitas Kesehatan Rujukan
							</div>
							<Form.Item
								name={'faskesRujukan'}
								rules={[
									{
										required: true,
										message: 'Masukkan faskes rujukan',
									},
								]}>
								<Select
									className="w-full"
									placeholder="Masukkan faskes rujukan"
									options={rsData}
								/>
							</Form.Item>
						</>
					)}
					<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
						Pilih Jaminan Pembiayaan
					</div>
					<Form.Item
						name={'jaminanPembiayaan'}
						rules={[
							{
								required: true,
								message: 'Masukkan jaminan pembiayaan',
							},
						]}>
						<Select
							className="w-full"
							placeholder="Masukkan jaminan pembiayaan"
							options={[
								{
									value: 'bpjs',
									label: 'BPJS',
								},
								{
									value: 'asuransi kesehatan',
									label: 'Asuransi Kesehatan',
								},
								{
									value: 'mandiri',
									label: 'Mandiri',
								},
							]}
						/>
					</Form.Item>
					<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
						Pilih Poliklinik
					</div>
					<Form.Item
						name={'poliklinik'}
						rules={[
							{
								required: true,
								message: 'Masukkan poliklinik tujuan',
							},
						]}>
						<Select
							className="w-full"
							placeholder="Pilih poliklinik tujuan"
							options={[
								{
									value: 'poli gigi',
									label: 'Poli Gigi',
								},
								{
									value: 'poli paru',
									label: 'Poli Paru',
								},
								{
									value: 'poli kandungan',
									label: 'Poli Kandungan',
								},
							]}
						/>
					</Form.Item>
					<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
						Pilih Tanggal Kunjungan
					</div>
					<Form.Item
						name={'tanggalKunjungan'}
						rules={[
							{
								required: true,
								message: 'Masukkan tanggal kunjungan',
							},
						]}>
						<DatePicker
							placeholder="Masukkan tanggal kunjungan"
							className="text-input w-full"
						/>
					</Form.Item>

					<Form.Item>
						<Button
							htmlType="submit"
							className="bg-green-sage text-white text-[16px] font-[600] h-[40px] w-full mt-[30px]">
							SELESAI
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
};

export default Registrasi;
