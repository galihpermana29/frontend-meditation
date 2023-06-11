import { Divider } from 'antd';
import footerLogo from '../../assets/logo-footer.png';

const Footer = () => {
	return (
		<div className="bg-[#0C513F] text-white p-[30px] md:p-[60px] mt-[50px]">
			<div className="flex flex-col md:flex-row gap-[20px] justify-between w-full min-h-[160px]">
				<div className="flex-1 max-w-[400px]">
					<img
						src={footerLogo}
						alt="footer logo"
						className="max-w-[200px] md:max-w-[250px]"
					/>
					<div className=" md:text-[20px] font-[600] mt-[10px]">
						Masa depan sehat dimulai hari ini!
					</div>
				</div>
				<div className="flex-1 max-w-[300px]">
					<div className=" md:text-[20px] font-[600]">Alamat</div>
					<div className=" md:text-[20px] font-[300]">
						Karanglewas, Melbern Ausi 45745 (+62) 547 5475 2364
					</div>
				</div>
				<div className="flex-1 max-w-[200px]">
					<div className=" md:text-[20px] font-[600]">Kontak</div>
					<div className=" md:text-[20px] font-[300]">+6289621490655</div>
				</div>
				<div className="flex-1 max-w-[200px]">
					<div className=" md:text-[20px] font-[600]">Layanan</div>
					<div className=" md:text-[20px] font-[300]">Ambulance</div>
				</div>
			</div>
			<Divider />
			<div className="text-[14px] font-[400]">
				© 2023 Meditation, All Rights Reserved
			</div>
		</div>
	);
};

export default Footer;
