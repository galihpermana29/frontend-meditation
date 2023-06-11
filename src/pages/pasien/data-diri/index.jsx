import { Button, DatePicker, Form, Input, Select, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import pasienAPI from '../../../api/pasien';
import moment from 'moment';

const DataDiri = () => {
	const [rsData, setRsData] = useState([]);
	const [form] = Form.useForm();
	const user = JSON.parse(localStorage.getItem('pasien_data'));
	console.log(user);
	const promptMessage = (msg) => {
		message.info(msg);
	};

	const handleEdit = async (value) => {
		const newDate = moment(value.tanggalLahir).format('YYYY-MM-DD');
		const user = JSON.parse(localStorage.getItem('pasien_data'));

		try {
			await pasienAPI.editProfile(user.user._id, {
				...value,
				tanggalLahir: newDate,
			});
			promptMessage('Edit profile berhasil!');
			setTimeout(() => {
				window.location.reload();
			}, 2000);
		} catch (error) {
			console.log(error);
			promptMessage(error.message);
		}
	};

	useEffect(() => {
		const gettingDetailUser = async () => {
			const { data } = await pasienAPI.getDetailUser();
			localStorage.setItem('pasien_data', JSON.stringify(data));
			form.setFieldsValue({
				nik: data.user.nik,
				noBpjs: data.user.noBpjs,
				noHp: data.user.noHp,
				name: data.user.name,
				tempatLahir: data.user.tempatLahir,
				tanggalLahir: data.user.tanggalLahir
					? moment(data.user.tanggalLahir)
					: moment(),

				alamatTinggal: data.user.alamatTinggal,
				faskesSatu: data.user.faskesSatu,
				jenisKelamin: data.user.jenisKelamin,
				pekerjaan: data.user.pekerjaan,
			});
		};

		gettingDetailUser();

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
	}, [form]);
	return (
		<div className="bg-white min-h-[170vh]">
			<div className="bg-riwayat-bg h-[400px] flex justify-center px-[20px]"></div>
			<div className="py-[30px] px-[40px] shadow-md rounded-lg max-w-[900px] absolute left-0 right-0 my-0 mx-auto top-[200px] z-10 bg-white">
				<h1 className="font-[600] text-[15px] md:text-[20px]">Data Diri</h1>
				<p className="font-[400] text-[14px] text-[#9CA3AF]">
					Lakukan pengisian dan pengeditan data diri Anda!
				</p>

				<Form form={form} onFinish={handleEdit}>
					<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
						NIK
					</div>
					<Form.Item name={'nik'} noStyle>
						<Input disabled placeholder="Masukkan NIK" className="text-input" />
					</Form.Item>
					<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
						No BPJS
					</div>
					<Form.Item name={'noBpjs'} noStyle>
						<Input
							disabled
							placeholder="Masukkan No BPJS"
							className="text-input"
						/>
					</Form.Item>
					<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
						No HP
					</div>
					<Form.Item name={'noHp'} noStyle>
						<Input
							disabled
							placeholder="Masukkan Nomor HP"
							className="text-input"
						/>
					</Form.Item>
					<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
						Nama
					</div>
					<Form.Item
						name={'name'}
						rules={[
							{
								required: true,
								message: 'Masukkan nama lengkap mu sesuai KTP',
							},
						]}>
						<Input placeholder="Masukkan nama lengkap" className="text-input" />
					</Form.Item>
					<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
						Tempat Lahir
					</div>
					<Form.Item
						name={'tempatLahir'}
						rules={[
							{
								required: true,
								message: 'Masukkan tempat lahir sesuai KTP',
							},
						]}>
						<Input placeholder="Masukkan tempat lahir" className="text-input" />
					</Form.Item>
					<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
						Tanggal Lahir
					</div>
					<Form.Item
						name={'tanggalLahir'}
						rules={[
							{
								required: true,
								message: 'Masukkan tanggal lahir sesuai KTP',
							},
						]}>
						<DatePicker
							placeholder="Masukkan tempat lahir"
							className="text-input w-full"
						/>
					</Form.Item>
					<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
						{' '}
						Alamat
					</div>
					<Form.Item
						name={'alamatTinggal'}
						rules={[
							{
								required: true,
								message: 'Masukkan alamat tinggal',
							},
						]}>
						<TextArea
							placeholder="Masukkan tempat lahir"
							className="text-input"
						/>
					</Form.Item>
					<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
						{' '}
						Faskes Pertama BPJS
					</div>
					<Form.Item
						name={'faskesSatu'}
						rules={[
							{
								required: true,
								message: 'Masukkan fasilitas kesehatan sesuai kartu BPJS',
							},
						]}>
						<Select
							className="w-full"
							placeholder="Pilih faskes pertama"
							options={rsData}
						/>
					</Form.Item>
					<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
						{' '}
						Jenis Kelamin
					</div>
					<Form.Item
						name={'jenisKelamin'}
						rules={[
							{
								required: true,
								message: 'Masukkan jenis kelamin',
							},
						]}>
						<Select
							placeholder="Pilih jenis kelamin"
							className="w-full text-[12px] md:text-[16px]"
							options={[
								{
									value: 'laki-laki',
									label: 'Laki-Laki',
								},
								{
									value: 'perempuan',
									label: 'Perempuan',
								},
							]}
						/>
					</Form.Item>
					<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
						Pekerjaan
					</div>
					<Form.Item name={'pekerjaan'} noStyle>
						<Input placeholder="Masukkan pekerjaan" className="text-input" />
					</Form.Item>
					<Form.Item noStyle>
						<Button
							htmlType="submit"
							className="bg-green-sage text-white text-[16px] font-[600] h-[40px] w-full mt-[30px]">
							SIMPAN
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
};

export default DataDiri;
