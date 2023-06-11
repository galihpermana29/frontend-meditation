import { Button, DatePicker, Form, Input, Select, message } from 'antd';

import login from '../../../assets/login.png';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import pasienAPI from '../../../api/pasien';
import moment from 'moment';

const SignUp = () => {
	const [form] = Form.useForm();
	const [registered, setRegistered] = useState(false);
	const [rsData, setRsData] = useState([]);
	const navigate = useNavigate();
  const user = localStorage.getItem('pasien_token')

	const promptMessage = (msg) => {
		message.info(msg);
	};

	const handleSecondRegis = async (value) => {
		const newDate = moment(value.tanggalLahir).format('YYYY-MM-DD');
		const user = JSON.parse(localStorage.getItem('pasien_data'));

		try {
			await pasienAPI.editProfile(user.user._id, {
				...value,
				tanggalLahir: newDate,
			});
			promptMessage('Registrasi Berhasil!');
			navigate('/pasien');
		} catch (error) {
			console.log(error);
			promptMessage(error.message);
		}
	};

	const handleFirstRegis = async (value) => {
		const { nik, noHp, noBpjs, password } = value;
		if (nik.length !== 16) {
			promptMessage('Pastikan NIK berjumlah 16 digit!');
			return;
		}

		if (noBpjs.length !== 11) {
			promptMessage('Pastikan NO BPJS berjumlah 11 digit!');
			return;
		}

		if (password.length < 6) {
			promptMessage('Panjang password minimum 6 karakter!');
			return;
		}

		try {
			const token = await pasienAPI.signup(value);
			localStorage.setItem('pasien_token', token.data);
			promptMessage('Berhasil Mendaftar');
			setTimeout(async () => {
				const { data } = await pasienAPI.getDetailUser();

				localStorage.setItem('pasien_data', JSON.stringify(data));
				setRegistered(true);
			}, 1000);
		} catch (error) {
			console.log(error);
			promptMessage(error.message);
		}
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
		setTimeout(() => {
			getRsData();
		}, 2000);
	}, [user]);

	return registered ? (
		<div className="flex flex-col justify-center items-center m-[20px]">
			<h1 className="font-[600] text-[20px] md:text-[24px]">Data Diri</h1>
			<p className="font-[400] text-[12px] md:text-[16px] text-black">
				Lakukan pengisian data diri anda!
			</p>
			<Form
				className="w-full max-w-[700px]"
				form={form}
				onFinish={handleSecondRegis}>
				<div className="text-label">Nama</div>
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
				<div className="text-label">Tempat Lahir</div>
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
				<div className="text-label">Tanggal Lahir</div>
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
				<div className="text-label"> Alamat</div>
				<Form.Item
					name={'alamat'}
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
				<div className="text-label"> Faskes Pertama BPJS</div>
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
				<div className="text-label"> Jenis Kelamin</div>
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
				<div className="text-label">Pekerjaan</div>
				<Form.Item name={'pekerjaan'} noStyle>
					<Input placeholder="Masukkan pekerjaan" className="text-input" />
				</Form.Item>
				<Form.Item noStyle>
					<Button
						htmlType="submit"
						className="bg-green-sage text-white text-[16px] font-[600] h-[40px] w-full mt-[30px]">
						SELESAI
					</Button>
				</Form.Item>
			</Form>
		</div>
	) : (
		<div className="mx-[10px] md:mr-[0] md:ml-[20px] lg:ml-[70px] sm:gap-[10px] md:gap-[20px] lg:gap-[60px] flex sm:flex-row  min-h-screen justify-center items-center">
			<div className="left flex-1 md:flex-[0.7] h-screen flex justify-center flex-col">
				<div className="form">
					<h1 className="font-[600] text-[20px] md:text-[24px]">
						Daftar Sebagai Pasien
					</h1>
					<p className="font-[400] text-[12px] md:text-[16px] text-black">
						Jika Anda sudah memiliki akun,{' '}
						<Link to="/pasien/login" className="green-sage font-[600]">
							Masuk di sini!
						</Link>
					</p>

					<Form onFinish={handleFirstRegis}>
						<div className="text-label">NIK</div>
						<Form.Item
							name={'nik'}
							rules={[
								{
									required: true,
									message: 'Masukkan NIK sesuai KTP',
								},
							]}>
							<Input placeholder="Masukkan NIK" className="text-input" />
						</Form.Item>
						<div className="text-label">No BPJS</div>
						<Form.Item
							name={'noBpjs'}
							rules={[
								{
									required: true,
									message: 'Masukkan No BPJS',
								},
							]}>
							<Input placeholder="Masukkan No BPJS" className="text-input" />
						</Form.Item>
						<div className="text-label">No HP</div>
						<Form.Item
							name={'noHp'}
							rules={[
								{
									required: true,
									message: 'Masukkan No HP',
								},
							]}>
							<Input placeholder="Masukkan Nomor HP" className="text-input" />
						</Form.Item>
						<div className="text-label">Password</div>
						<Form.Item
							name={'password'}
							rules={[
								{
									required: true,
									message: 'Masukkan password',
								},
							]}>
							<Input.Password
								placeholder="Masukkan Password"
								className="text-input"
							/>
						</Form.Item>
						<Form.Item noStyle>
							<Button
								htmlType="submit"
								className="bg-green-sage text-white text-[16px] font-[600] h-[40px] w-full mt-[30px]">
								DAFTAR
							</Button>
						</Form.Item>
					</Form>
				</div>
			</div>
			<div className="right hidden sm:flex flex-1">
				<img src={login} alt="" className="w-full h-screen object-cover" />
			</div>
		</div>
	);
};

export default SignUp;
