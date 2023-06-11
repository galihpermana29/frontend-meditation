import {
	Button,
	Col,
	Form,
	Input,
	Modal,
	Row,
	Select,
	Spin,
	message,
} from 'antd';

import TextArea from 'antd/es/input/TextArea';

import notfound from '../../../assets/notfound.png';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import pasienAPI from '../../../api/pasien';
import rsAPI from '../../../api/rs';
import Card from '../../../components/card';
import {
	useAccount,
	useConnect,
	useContractRead,
	useContractWrite,
	usePrepareContractWrite,
	useWaitForTransaction,
} from 'wagmi';
import { saveText } from '../../../blockchain/ipfs';

const DetailPasien = () => {
	const { eventId: id } = useParams();
	const user = JSON.parse(localStorage.getItem('rs_data'));
	const [form] = Form.useForm();

	const { connector: activeConnector, isConnected } = useAccount();
	const { connect, connectors } = useConnect();
	const [ipfsHashing, setIpfsHashing] = useState(null);

	const [viewData, setViewData] = useState(null);
	const [isEditData, setIsEditData] = useState(false);

	const { data: isMedicalRecordExist = [] } = useContractRead({
		address: '0x848a9B6b7fcA56Bc27a17b933fCB25a8E07862A2',
		abi: [
			{
				name: 'searchByEventID',
				type: 'function',
				stateMutability: 'view',
				outputs: [
					{ internalType: 'string', name: 'eventID', type: 'string' },
					{ internalType: 'string', name: 'ipfsURL', type: 'string' },
					{ internalType: 'address', name: 'writer', type: 'address' },
					{ internalType: 'string', name: 'rsCode', type: 'string' },
				],
				inputs: [{ internalType: 'string', name: 'evID', type: 'string' }],
			},
		],
		functionName: 'searchByEventID',
		args: [id], //cocokin idx 0 sama detail pasien event, klo ga cocok berarti undefined
	});

	const { config, error: prepareError } = usePrepareContractWrite({
		address: '0x848a9B6b7fcA56Bc27a17b933fCB25a8E07862A2',
		abi: [
			{
				name: 'storeMedicalRecords',
				type: 'function',
				stateMutability: 'nonpayable',
				inputs: [
					{ internalType: 'string', name: 'evID', type: 'string' },
					{ internalType: 'string', name: 'ipURL', type: 'string' },
					{ internalType: 'string', name: '_rsCode', type: 'string' },
				],
				outputs: [],
			},
		],
		functionName: 'storeMedicalRecords',
		args: [id, ipfsHashing, user.rsCode],
		enabled: ipfsHashing !== null,
	});
	const { data, write } = useContractWrite(config);
	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash,
	});

	const { config: configUpdate } = usePrepareContractWrite({
		address: '0x848a9B6b7fcA56Bc27a17b933fCB25a8E07862A2',
		abi: [
			{
				name: 'updateMedicalRecords',
				type: 'function',
				stateMutability: 'nonpayable',
				inputs: [
					{ internalType: 'string', name: 'evID', type: 'string' },
					{ internalType: 'string', name: 'ipURL', type: 'string' },
					{ internalType: 'string', name: '_rsCode', type: 'string' },
				],
				outputs: [],
			},
		],
		functionName: 'updateMedicalRecords',
		args: [id, ipfsHashing, user.rsCode],
		enabled: ipfsHashing !== null,
	});
	const { data: dataUpdate, write: writeUpdate } =
		useContractWrite(configUpdate);
	const { isLoading: loadingUpdate, isSuccess: successUpdate } =
		useWaitForTransaction({
			hash: dataUpdate?.hash,
		});

	const [faskesRujukanEdit, setFaskesRujukanEdit] = useState(false);
	const [rsData, setRsData] = useState([]);
	const [eventsData, setEventsData] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
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

	const promptMessage = (msg) => {
		message.info(msg);
	};
	const handleSubmit = async (value) => {
		try {
			await rsAPI.changeStatus(id, {
				...value,
				faskesSatu: detail.faskesSatu,
				eventStatus: 'dirawat di faskes 2',
			});
			await rsAPI.postNotif({
				title: 'dirujuk ke faskes 2',
				desc: 'Rumah Sakit merujukmmu untuk berobat ke fasilitas kesehatan tingkat 2',
				eventId: id,
				pasienId: detail.user,
			});
			promptMessage('Pasien akan dirawat di faskes 2');
			setTimeout(() => {
				window.location.reload();
			}, 1200);
		} catch (error) {
			console.log(error, 'error');
		}
	};

	const handleChangeStatus = async (purpose) => {
		try {
			if (purpose === 'dirawat di faskes 2' && detailFaskesRujukan === null) {
				setFaskesRujukanEdit(true);
			} else {
				await rsAPI.changeStatus(id, {
					faskesRujukan: detail.faskesRujukan,
					faskesSatu: detail.faskesSatu,
					eventStatus: purpose,
				});
				await rsAPI.postNotif({
					title: purpose,
					desc:
						purpose !== 'selesai'
							? 'Rumah Sakit merujukmmu untuk berobat ke fasilitas kesehatan tingkat 2'
							: 'Pengobatan selesai',
					eventId: id,
					pasienId: detail.user,
				});
				promptMessage('Pasien ' + purpose);
				setTimeout(() => {
					window.location.reload();
				}, 1200);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const sendMedicalPermission = async () => {
		try {
			await rsAPI.postNotif({
				title: 'medical permission',
				desc: 'Rumah Sakit meminta persetujuanmu untuk melihat akses ke riwayat medismu',
				eventId: id,
				pasienId: detail.user,
			});
			promptMessage('Permintaan akses berhasil dikirim!');
		} catch (error) {
			console.log(error, 'error while notif');
		}
	};

	const handleChangeRujukan = (value) => {
		console.log(value);
	};

	const handleSubmitMedicalRecord = async (value) => {
		const d = await saveText({ content: JSON.stringify(value) });
		setIpfsHashing(d.path);
		if (isEditData) {
			setTimeout(() => {
				writeUpdate?.();
			}, 2000);
		} else {
			write?.();
		}
	};

	const retrieveIPFS = async () => {
		const data = await fetch(
			`https://ipfs.io/ipfs/${isMedicalRecordExist[1]}`,
			{
				method: 'GET',
			}
		);
		if (data) {
			setIsModalOpen(true);
			const pp = await data.json();
			setViewData(pp);
			form.setFieldsValue(pp);
		}
	};

	useEffect(() => {
		const getAllEvents = async (userId, medicalHide) => {
			if (!medicalHide) {
				const {
					data: { data },
				} = await rsAPI.getPasienEvents(userId);
				setEventsData(data);
			} else {
				setEventsData([]);
			}
		};

		const getDetailEvent = async () => {
			const {
				data: { data },
			} = await pasienAPI.getDetailEvent(id, 'rs');
			setDetail(data);
			getAllEvents(data.user, data.medicalHide);
		};

		const getRsData = async () => {
			const {
				data: { user },
			} = await pasienAPI.getAllRS('rs');
			const newRsData = user.map((data) => ({
				value: data._id,
				label: data.rsName,
			}));

			setRsData(newRsData);
		};

		connect({ connector: connectors[0] });

		getRsData();
		getDetailEvent();
	}, [id]);

	useEffect(() => {
		if (isSuccess) {
			setIsModalOpen(false);
			promptMessage('Berhasil membuat catatan medis');
			window.location.reload();
		}
		if (successUpdate) {
			setIsModalOpen(false);
			promptMessage('Berhasil mengupdate catatan medis');
		}
	}, [isSuccess, successUpdate]);

	if (!isConnected) {
		return (
			<div className="flex justify-center items-center h-screen flex-col">
				<Spin />
				<div>Loading connecting to wallet account</div>
			</div>
		);
	}

	return (
		<div className="bg-white min-h-[200vh]">
			<Modal
				onCancel={() => setIsModalOpen(false)}
				width={900}
				title={
					viewData
						? 'Catatan Rekam Medis Pasien'
						: 'Buat Catatan Rekam Medis Pasien'
				}
				open={isModalOpen}
				footer={[]}>
				<Form form={form} onFinish={handleSubmitMedicalRecord}>
					<div className="text-label">Nama Dokter Pemeriksa</div>
					<Form.Item
						name={'namaDokter'}
						rules={[
							{
								required: true,
								message: 'Masukkan nama dokter pemeriksa',
							},
						]}>
						<Input
							disabled={viewData}
							placeholder="Masukkan nama dokter pemeriksa"
							className="text-input"
						/>
					</Form.Item>
					<div className="text-label">Nama Keluarga Terdekat</div>
					<Form.Item
						name={'namaKeluarga'}
						rules={[
							{
								required: true,
								message: 'Masukkan keluarga pasien terdekat',
							},
						]}>
						<Input
							disabled={viewData}
							placeholder="Masukkan keluarga pasien terdekat"
							className="text-input"
						/>
					</Form.Item>
					<div className="text-label">Cara Masuk</div>
					<Form.Item
						name={'caraMasuk'}
						rules={[
							{
								required: true,
								message: 'Masukkan cara masuk pasien',
							},
						]}>
						<Select
							disabled={viewData}
							className="w-full"
							placeholder="Pilih cara masuk pasien"
							options={[
								{
									value: 'dokter',
									label: 'Dokter',
								},
								{
									value: 'datang sendiri',
									label: 'Datang sendiri',
								},
								{
									value: 'kasus polisi',
									label: 'Kasus polisi',
								},
							]}
						/>
					</Form.Item>
					<div className="text-label">Diagnosa Masuk</div>
					<Form.Item
						name={'dianosaMasuk'}
						rules={[
							{
								required: true,
								message: 'Masukkan diagnosa pasien ketika masuk',
							},
						]}>
						<TextArea
							disabled={viewData}
							placeholder="Masukkan diagnosa masuk pasien"
							className="text-input"
						/>
					</Form.Item>
					<div className="text-label">Komplikasi</div>
					<Form.Item
						name={'komplikasi'}
						rules={[
							{
								required: true,
								message: 'Masukkan komplikasi pasien',
							},
						]}>
						<TextArea
							disabled={viewData}
							placeholder="Masukkan komplikasi pasien"
							className="text-input"
						/>
					</Form.Item>
					<div className="text-label">Data Tindakan</div>
					<Form.Item
						name={'dataTindakan'}
						rules={[
							{
								required: true,
								message: 'Masukkan data tindakan yang dilakukan',
							},
						]}>
						<TextArea
							disabled={viewData}
							placeholder="Masukkan data tindakan yang dilakukan"
							className="text-input"
						/>
					</Form.Item>
					<div className="text-label">Transfusi Darah</div>
					<Form.Item
						name={'transfusiDarah'}
						rules={[
							{
								required: true,
								message: 'Masukkan transfusi darah pasien',
							},
						]}>
						<Input
							disabled={viewData}
							placeholder="Masukkan transfusi darah pasien"
							className="text-input"
						/>
					</Form.Item>
					<div className="text-label">Keadaan Keluar</div>
					<Form.Item
						name={'keadaanKeluar'}
						rules={[
							{
								required: true,
								message: 'Masukkan keadaan keluar pasien',
							},
						]}>
						<Select
							disabled={viewData}
							className="w-full"
							placeholder="Pilih keadaan keluar pasien"
							options={[
								{
									value: 'sembuh',
									label: 'Sembuh',
								},
								{
									value: 'membaik',
									label: 'Membaik',
								},
								{
									value: 'belum sembuh',
									label: 'Belum Sembuh',
								},
								{
									value: 'mati < 48jam',
									label: 'Mati < 48jam',
								},
								{
									value: 'mati > 48jam',
									label: 'Mati > 48jam',
								},
							]}
						/>
					</Form.Item>
					<Form.Item noStyle>
						{viewData ? (
							<div
								onClick={() => {
									setViewData(null);
									setIsEditData(true);
								}}
								htmlType="button"
								className="rounded-lg text-center flex justify-center items-center border-[1px] text-[#0C513F] border-[#0C513F] text-[16px] font-[600] h-[40px] w-full mt-[30px]">
								Edit
							</div>
						) : (
							<Button
								loading={isLoading}
								htmlType="submit"
								className="rounded-lg text-center flex justify-center items-center border-[1px] text-[#0C513F] border-[#0C513F] text-[16px] font-[600] h-[40px] w-full mt-[30px]">
								{isEditData ? 'Edit Data' : 'Upload'}
							</Button>
						)}
					</Form.Item>
				</Form>
			</Modal>
			<div className="bg-riwayat-bg h-[400px] flex justify-center px-[20px]"></div>

			<div className="py-[30px] px-[40px] shadow-md rounded-lg md:max-w-[80%] absolute left-0 right-0 my-0 mx-auto top-[200px] z-10 bg-white">
				<div>
					<div className="flex items-center justify-between">
						<h1 className="font-[600] text-[15px] md:text-[20px]">
							Detail Registrasi
						</h1>
						<span className="ml-[10px] capitalize font-[300] text-[15px] bg-[#B9D1CA] rounded-[20px] py-[5px] px-[10px]">
							{detail.eventStatus}
						</span>
					</div>

					<Form onFinish={handleSubmit}>
						<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
							Nama
						</div>
						<p className="font-[400] text-[14px] text-[#9CA3AF]">
							{detail?.pasien?.name}
						</p>
						<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
							Tanggal Lahir
						</div>
						<p className="font-[400] text-[14px] text-[#9CA3AF]">
							{detail?.pasien?.tanggalLahir}
						</p>
						<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
							No BPJS
						</div>
						<p className="font-[400] text-[14px] text-[#9CA3AF]">
							{detail?.pasien?.noBpjs}
						</p>
						<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
							Status Kunjungan
						</div>
						<p className="font-[400] text-[14px] text-[#9CA3AF]">
							{detail.eventStatus === 'terdaftar' &&
								' Menunggu tanggapan faskes pertama'}
							{detail.eventStatus === 'dirawat di faskes 1' &&
								' Pasien akan dirawat di faskes 1'}
							{detail.eventStatus === 'dirawat di faskes 2' &&
								' Pasien akan dirawat di faskes 2'}
							{detail.eventStatus === 'selesai' && 'Pengobatan telah selesai'}
						</p>
						<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
							Fasilitas Kesehatan Pertama
						</div>
						<p className="font-[400] text-[14px] text-[#9CA3AF]">
							{detailFaskesSatu.rsName}
						</p>
						{faskesRujukanEdit ? (
							<Form.Item name="faskesRujukan" noStyle>
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
										onChange={handleChangeRujukan}
										className="w-full"
										placeholder="Masukkan faskes rujukan"
										options={rsData}
									/>
								</Form.Item>
							</Form.Item>
						) : (
							<>
								<div className="font-[600] text-[13px] md:text-[16px] mb-[8px] mt-[10px]">
									Fasilitas Kesehatan Rujukan
								</div>
								<p className="font-[400] text-[14px] text-[#9CA3AF]">
									{detailFaskesRujukan === null
										? '-'
										: `${detailFaskesRujukan.rsName}`}
								</p>
							</>
						)}
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
						{['selesai'].includes(detail?.eventStatus) ? (
							isMedicalRecordExist[0] === id ? (
								<Form.Item noStyle>
									<Link
										to={`/rs/detail-rekam-medis/${id}`}
										// onClick={retrieveIPFS}
										htmlType="submit"
										className="rounded-lg text-center flex justify-center items-center border-[1px] text-[#0C513F] border-[#0C513F] text-[16px] font-[600] h-[40px] w-full mt-[30px]">
										LIHAT CATATAN MEDIS
									</Link>
								</Form.Item>
							) : (
								<Form.Item noStyle>
									<Link
										onClick={() => {
											if (isConnected) {
												setIsModalOpen(true);
											} else {
												connect({ connector: connectors[0] });
												setIsModalOpen(true);
											}
										}}
										htmlType="submit"
										className="rounded-lg text-center flex justify-center items-center border-[1px] text-[#0C513F] border-[#0C513F] text-[16px] font-[600] h-[40px] w-full mt-[30px]">
										BUAT CATATAN MEDIS
									</Link>
								</Form.Item>
							)
						) : faskesRujukanEdit ? (
							<Form.Item noStyle>
								<Button
									htmlType="submit"
									className="rounded-lg text-center flex justify-center items-center border-[1px] text-[#0C513F] border-[#0C513F] text-[16px] font-[600] h-[40px] w-full mt-[30px]">
									SIMPAN
								</Button>
							</Form.Item>
						) : ['dirawat di faskes 1', 'dirawat di faskes 2'].includes(
								detail?.eventStatus
						  ) ? (
							user._id === detail?.faskesActive ? (
								<Form.Item noStyle>
									<Button
										onClick={() => handleChangeStatus('selesai')}
										className="rounded-lg text-center flex justify-center items-center border-[1px] text-[#0C513F] border-[#0C513F] text-[16px] font-[600] h-[40px] w-full mt-[30px]">
										Selesai
									</Button>
								</Form.Item>
							) : (
								<Form.Item noStyle>
									<Button
										// onClick={() => handleChangeStatus('selesai')}
										className="rounded-lg text-center flex justify-center items-center border-[1px] text-[#0C513F] border-[#0C513F] text-[16px] font-[600] h-[40px] w-full mt-[30px]">
										PASIEN DIRUJUK
									</Button>
								</Form.Item>
							)
						) : (
							<>
								<Form.Item noStyle>
									<Button
										onClick={() => handleChangeStatus('dirawat di faskes 2')}
										className="rounded-lg text-center flex justify-center items-center border-[1px] text-[#0C513F] border-[#0C513F] text-[16px] font-[600] h-[40px] w-full mt-[30px]">
										RUJUK PASIEN KE RS RUJUKAN
									</Button>
								</Form.Item>
								<Form.Item noStyle>
									<Button
										onClick={() => handleChangeStatus('dirawat di faskes 1')}
										className="rounded-lg text-center flex justify-center items-center bg-green-sage text-white text-[16px] font-[600] h-[40px] w-full mt-[10px]">
										RAWAT PASIEN DI SINI
									</Button>
								</Form.Item>
							</>
						)}
					</Form>
				</div>
				<div className="mt-[40px]">
					<div className="flex justify-between items-center">
						<p className="font-[600] text-[20px] text-center sm:text-left">
							Riwayat Kunjungan Pasien
						</p>
						<div className="w-full max-w-[450px]">
							<Input.Search placeholder="Cari berdasarkan no rekam medis" />
						</div>
					</div>
					{detail?.medicalHide ? (
						<div className="my-[40px] flex justify-center items-center flex-col">
							<div>
								<img src={notfound} alt="not found" className="max-w-[400px]" />
							</div>
							<div className="font-[600] text-[24px mt-[24px]">
								Anda tidak memiliki akses untuk melihat riwayat medis pasien
							</div>
							<div className="font-[300] text-[24px mb-[24px] max-w-[400px] text-center">
								Minta akses kepada pasien agar bisa melihat riwayat medisnya
							</div>
						</div>
					) : eventsData.length > 0 ? (
						<Row
							className="mt-[30px]"
							justify={eventsData.length < 3 ? 'start' : 'center'}
							gutter={[12, 24]}>
							{eventsData.map((dat, idx) => (
								<Col xs={24} sm={12} md={7} key={idx}>
									<Card data={dat} path="/rs/detail-pasien/" />
								</Col>
							))}
						</Row>
					) : (
						<div className="my-[40px] flex justify-center items-center flex-col">
							<div>
								<img src={notfound} alt="not found" className="max-w-[400px]" />
							</div>
							<div className="font-[600] text-[24px mt-[24px]">
								Belum ada riwayat kunjungan
							</div>
							<div className="font-[300] text-[24px my-[24px] max-w-[400px] text-center">
								Pasien ini belum memiliki ringkasan kepulangan pasien, silakan
								menambahkan ringkasan kepulangan pasien terlebih dahulu!
							</div>
						</div>
					)}

					{detail?.medicalHide && (
						<Form.Item noStyle>
							<Button
								onClick={() => sendMedicalPermission()}
								className="rounded-lg text-center flex justify-center items-center bg-green-sage text-white text-[16px] font-[600] h-[40px] w-full mt-[10px]">
								MINTA AKSES RIWAYAT MEDIS
							</Button>
						</Form.Item>
					)}
				</div>
			</div>
		</div>
	);
};

export default DetailPasien;
