import { Link, useNavigate } from 'react-router-dom';
import navbarLogo from '../../assets/logo-nav.png';
import { BellOutlined, CloseOutlined, MenuOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { Avatar, Badge, Popover, Row, message } from 'antd';
import pasienAPI from '../../api/pasien';

const Navbar = () => {
	const [navbarStatus, setNavbar] = useState(false);
	const [notif, setNotif] = useState([]);
	const navigate = useNavigate();

	const rsData = JSON.parse(localStorage.getItem('rs_data'));
	const locRoute = window.location.pathname.split('/')[1];

	const { user } = localStorage.getItem('pasien_data')
		? JSON.parse(localStorage.getItem('pasien_data'))
		: { user: null };

	const handleLogout = () => {
		if (locRoute === 'pasien') {
			localStorage.removeItem('pasien_token');
			localStorage.removeItem('pasien_data');
		} else {
			localStorage.removeItem('rs_token');
			localStorage.removeItem('rs_data');
		}
		navigate('/');
		window.location.reload();
	};

	const promptMessage = (msg) => {
		message.info(msg);
	};

	const handleMedicalAccess = async (id, purpose) => {
		try {
			await pasienAPI.changeMedicalStatus(id, {
				medicalStatus: purpose === 'reject' ? false : true,
			});
			promptMessage('Berhasil mengirimkan konfirmasi');
		} catch (error) {
			console.log(error);
		}
	};

	const content = () => {
		return notif.map((d, idx) =>
			notif.length > 0 ? (
				<div className="max-w-[350px] my-[10px]" key={idx}>
					<p className="capitalize font-[600]">{d.title}</p>
					<p>{d.desc}</p>
					{d.title === 'medical permission' &&
						d.medicRecordVisibility === null && (
							<Row className="mt-[10px]">
								<button
									onClick={() => handleMedicalAccess(d._id, 'reject')}
									className="border-[1px] border-[#0C513F] rounded-lg px-[10px] text-[13px]">
									Decline
								</button>
								<button
									onClick={() => handleMedicalAccess(d._id, 'accept')}
									className=" bg-[#0C513F] rounded-lg px-[10px] text-white text-[13px] ml-[10px]">
									Accept
								</button>
							</Row>
						)}
				</div>
			) : (
				<>
					<div>Tidak ada notifikasi</div>
				</>
			)
		);
	};
	useEffect(() => {
		const getNotif = async () => {
			const {
				data: { status },
			} = await pasienAPI.getAllNotif();
			setNotif(status);
		};
		if (locRoute === 'pasien') {
			getNotif();
		}
	}, []);

	return (
		<div className="flex justify-between h-[60px] items-center px-[10px] md:px-[80px] sm:px-[40px]">
			<Link to={locRoute === 'rs' ? '/rs' : '/pasien'}>
				<img
					src={navbarLogo}
					alt="meditation"
					className="w-full max-w-[150px]"
				/>
			</Link>
			<div>
				<div className="md:hidden">
					{navbarStatus ? (
						<CloseOutlined
							className="text-[20px] cursor-pointer"
							onClick={() => setNavbar(false)}
						/>
					) : (
						<MenuOutlined
							className="text-[20px] cursor-pointer"
							onClick={() => setNavbar(true)}
						/>
					)}
				</div>
				<div
					className={`${
						navbarStatus
							? 'flex absolute top-[60px] left-0 flex-col bg-white right-0 bottom-0 justify-center items-center'
							: 'hidden md:flex md:gap-[10px] lg:gap-[30px] items-center'
					} `}>
					<Link
						to={locRoute === 'rs' ? '/rs' : '/pasien'}
						className="text-[20px] md:text-[14px] lg:text-[16px] mb-[10px] md:mb-0 font-[300] text-[#9CA3AF]">
						Beranda
					</Link>
					{locRoute === 'pasien' && (
						<Link
							to={'/pasien/registrasi'}
							className="text-[20px] md:text-[14px] lg:text-[16px] mb-[10px] md:mb-0 font-[300] text-[#9CA3AF]">
							Registrasi
						</Link>
					)}
					{locRoute === 'pasien' && (
						<Link
							to={'/pasien/riwayat-kunjungan'}
							className="text-[20px] md:text-[14px] lg:text-[16px] mb-[10px] md:mb-0 font-[300] text-[#9CA3AF]">
							Riwayat Kunjungan
						</Link>
					)}
					<div
						onClick={handleLogout}
						className="text-[20px] md:text-[14px] lg:text-[16px] mb-[10px] md:mb-0 font-[300] text-[#9CA3AF] cursor-pointer">
						Keluar
					</div>
				</div>
			</div>
			<div className="items-center hidden md:flex">
				{locRoute === 'pasien' && (
					<Popover content={content} title="Notifications" trigger="click">
						<Badge size="small" count={notif.length}>
							<BellOutlined className="text-[20px] cursor-pointer " />
						</Badge>
					</Popover>
				)}
				<Link
					className="flex items-center ml-[10px]"
					to={locRoute === 'pasien' ? '/pasien/data-diri' : null}>
					<p className="mr-[10px]">
						{locRoute === 'pasien' && user && user.name}
						{locRoute === 'rs' && rsData && rsData.rsName}
					</p>
					<Avatar />
				</Link>
			</div>
		</div>
	);
};

export default Navbar;
