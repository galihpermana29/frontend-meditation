import { Link } from 'react-router-dom';

function dotString(text, count, insertDots) {
	return (
		text.slice(0, count) + (text.length > count && insertDots ? '...' : '')
	);
}

const Card = ({ data, purpose = 'pasien', path = '/pasien/detail/' }) => {
	if (purpose === 'rs') {
		return (
			<Link to={`/rs/detail-pasien/${data._id}`}>
				<div className="border-[1px] border-[#EAEAEA] rounded-lg p-[10px] max-w-[315px] hover:bg-[#EAEAEA] cursor-pointer min-h-[230px] relative">
					<div className="flex gap-[20px] mb-[5px]">
						<p className="text-[14px] font-[300] text-[#6D7280] min-w-[110px]">
							Nama
						</p>
						<p className="text-[14px] font-[600] text-black capitalize">
							: {data.pasien.name}
						</p>
					</div>
					<div className="flex gap-[20px] mb-[5px]">
						<p className="text-[14px] font-[300] text-[#6D7280] min-w-[110px]">
							No BPJS
						</p>
						<p className="text-[14px] font-[600] text-black">
							: {data.pasien.noBpjs}
						</p>
					</div>
					<div className="flex gap-[20px] mb-[5px]">
						<p className="text-[14px] font-[300] text-[#6D7280] min-w-[110px] capitalize">
							Poliklinik
						</p>
						<p className="text-[14px] font-[600] text-black capitalize">
							: {data.poliklinik}
						</p>
					</div>
					<div className="flex gap-[20px] mb-[5px]">
						<p className="text-[14px] font-[300] text-[#6D7280] min-w-[110px]">
							Faskes Tingkat 1
						</p>
						<p className="text-[14px] font-[600] text-black">
							:{' '}
							{data.detailFaskesSatu === null
								? '-'
								: data.detailFaskesSatu.rsName}
						</p>
					</div>
					<div className="flex gap-[20px] mb-[5px]">
						<p className="text-[14px] font-[300] text-[#6D7280] min-w-[110px]">
							Faskes Rujukan
						</p>
						<p className="text-[14px] font-[600] text-black">
							:{' '}
							{data.detailFaskesRujukan === null
								? '-'
								: data.detailFaskesRujukan.rsName}
						</p>
					</div>
					<div className="flex justify-between absolute bottom-[12px] left-[10px] right-[10px]">
						<p className="text-[12px] font-[300] text-[#6D7280] px-[10px] rounded-lg bg-[#B9D1CA] capitalize">
							{data.eventStatus}
						</p>
						<Link className="text-[12px] font-[500] green-sage px-[10px] border-[0.8px] border-[#0C513F] rounded-lg">
							Lihat Detail
						</Link>
					</div>
				</div>
			</Link>
		);
	}
	return (
		<Link to={`${path}${data._id}`}>
			<div className="border-[1px] border-[#EAEAEA] rounded-lg p-[10px] max-w-[315px] hover:bg-[#EAEAEA] cursor-pointer min-h-[230px] relative">
				<div className="flex gap-[20px] mb-[5px]">
					<p className="text-[14px] font-[300] text-[#6D7280] min-w-[110px]">
						No Rekam Medis
					</p>
					<p className="text-[14px] font-[600] text-black">
						: {dotString(data._id, 10, true)}
					</p>
				</div>
				<div className="flex gap-[20px] mb-[5px]">
					<p className="text-[14px] font-[300] text-[#6D7280] min-w-[110px]">
						Tanggal Masuk
					</p>
					<p className="text-[14px] font-[600] text-black">
						: {data.tanggalKunjungan}
					</p>
				</div>
				<div className="flex gap-[20px] mb-[5px]">
					<p className="text-[14px] font-[300] text-[#6D7280] min-w-[110px]">
						Tanggal Keluar
					</p>
					<p className="text-[14px] font-[600] text-black">
						: {data.tanggalKeluar}
					</p>
				</div>
				<div className="flex gap-[20px] mb-[5px]">
					<p className="text-[14px] font-[300] text-[#6D7280] min-w-[110px]">
						Faskes Tingkat 1
					</p>
					<p className="text-[14px] font-[600] text-black">
						:{' '}
						{data.detailFaskesSatu === null
							? '-'
							: data.detailFaskesSatu.rsName}
					</p>
				</div>
				<div className="flex gap-[20px] mb-[5px]">
					<p className="text-[14px] font-[300] text-[#6D7280] min-w-[110px]">
						Faskes Rujukan
					</p>
					<p className="text-[14px] font-[600] text-black">
						:{' '}
						{data.detailFaskesRujukan === null
							? '-'
							: data.detailFaskesRujukan.rsName}
					</p>
				</div>
				<div className="flex justify-between absolute bottom-[12px] left-[10px] right-[10px]">
					<p className="text-[12px] font-[300] text-[#6D7280] px-[10px] rounded-lg bg-[#B9D1CA] capitalize">
						{data.eventStatus}
					</p>
					<Link className="text-[12px] font-[500] green-sage px-[10px] border-[0.8px] border-[#0C513F] rounded-lg">
						Lihat Rekam Medis
					</Link>
				</div>
			</div>
		</Link>
	);
};

export default Card;
