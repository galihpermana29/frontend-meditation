import { Button, Form, Input, message } from 'antd';

import login from '../../../assets/login.png';
import { Link, useNavigate } from 'react-router-dom';
import pasienAPI from '../../../api/pasien';

const LogIn = () => {
	const navigate = useNavigate();
	const promptMessage = (msg) => {
		message.info(msg);
	};

	const handleLogin = async (value) => {
		try {
			const { data } = await pasienAPI.login(value);
			localStorage.setItem('pasien_token', data);
			promptMessage('Login berhasil');
			navigate('/pasien');
			window.location.reload();
		} catch (error) {
			console.log(error);
			promptMessage(error.message);
		}
	};
	return (
		<div className="mx-[10px] md:mr-[0] md:ml-[20px] lg:ml-[70px] sm:gap-[10px] md:gap-[20px] lg:gap-[60px] flex sm:flex-row  min-h-screen justify-center items-center">
			<div className="left flex-1 md:flex-[0.7] h-screen flex justify-center flex-col">
				<div className="form">
					<h1 className="font-[600] text-[20px] md:text-[24px]">
						Masuk Sebagai Pasien
					</h1>
					<p className="font-[400] text-[12px] md:text-[16px] text-black">
						Jika Anda belum memiliki akun,{' '}
						<Link to="/pasien/signup" className="green-sage font-[600]">
							Daftar di sini!
						</Link>
					</p>

					<Form onFinish={handleLogin}>
						<div className="text-label">NIK</div>
						<Form.Item
							name={'nik'}
							rules={[
								{
									required: true,
									message: 'Masukkan NIK',
								},
							]}>
							<Input placeholder="Masukkan NIK" className="text-input" />
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
						<Form.Item>
							<Button
								htmlType="submit"
								className="bg-green-sage text-white text-[16px] font-[600] h-[40px] w-full mt-[30px]">
								MASUK
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

export default LogIn;
