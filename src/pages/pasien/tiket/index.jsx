import { Button } from 'antd';
import tiket from '../../../assets/pana.png';
import { useParams } from 'react-router-dom';
const Tiket = () => {
	const { id } = useParams();
	return (
		<div className="flex justify-center items-center h-screen">
			<div className="flex flex-col items-center w-full max-w-[500px] flex-1">
				<div>
					<img src={tiket} alt="tiket" />
				</div>
				<div className="font-[400] text-[16px] my-[30px] text-center text-[#6D7280]">
					Berikut merupakan nomor antrian dan kode tiket anda, silahkan
					tunjukkan tiket kepada petugas yang melayani.
				</div>
				<div className="text-center">
					<div className="font-[400] text-[16px] my-[30px] text-center text-[#6D7280]">
						Kode Tiket:
					</div>
					<div className="text-[#FFC501] text-[25px] md:text-[40px] font-[600]">
						{id}
					</div>
				</div>
				<div className="w-full">
					<Button className="bg-green-sage text-white text-[16px] font-[600] h-[40px] w-full mt-[30px]">
						UNDUH TIKET
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Tiket;
