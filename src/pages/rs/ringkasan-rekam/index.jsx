import { Button, Form, Input, Select, Spin, message } from 'antd';

import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
	useContractRead,
	useContractWrite,
	usePrepareContractWrite,
	useWaitForTransaction,
} from 'wagmi';
import { saveText } from '../../../blockchain/ipfs';
import pasienAPI from '../../../api/pasien';

const RingkasanRekamMedis = () => {
	const user = JSON.parse(localStorage.getItem('rs_data'));
	const { id } = useParams();
	const [form] = Form.useForm();

	const [viewData, setViewData] = useState(null);
	const [ipfsHashing, setIpfsHashing] = useState(null);
	const [detail, setDetail] = useState({
		pasien: null,
		eventStatus: null,
		detailFaskesSatu: null,
	});
	const [editData, setEditData] = useState(false);

	const { pasien, eventStatus, detailFaskesSatu, detailFaskesRujukan } = detail;

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

	const retrieveIPFS = async () => {
		const data = await fetch(
			`https://ipfs.io/ipfs/${isMedicalRecordExist?.[1]}`,
			{
				method: 'GET',
			}
		);
		if (data) {
			const pp = await data.json();
			setViewData(pp);
			form.setFieldsValue(pp);
		}
	};

	const handleSubmitMedicalRecord = async (value) => {
		const d = await saveText({ content: JSON.stringify(value) });
		setIpfsHashing(d.path);
		setTimeout(() => {
			writeUpdate?.();
		}, 2000);
	};

	const promptMessage = (msg) => {
		message.info(msg);
	};

	useEffect(() => {
		if (successUpdate) {
			promptMessage('Berhasil mengupdate catatan medis');
			window.location.reload();
		}
	}, [successUpdate]);

	useEffect(() => {
		const getDetailEvent = async () => {
			const {
				data: { data },
			} = await pasienAPI.getDetailEvent(id, 'rs');
			setDetail(data);
		};

		getDetailEvent();
		retrieveIPFS();
	}, [isMedicalRecordExist]);

	return (
		<div className="bg-white min-h-[100vh]">
			<div className="bg-riwayat-bg h-[400px] flex justify-center px-[20px]"></div>

			<div className="py-[30px] px-[40px] shadow-md rounded-lg md:max-w-[70%] absolute left-0 right-0 my-0 mx-auto top-[200px] z-10 bg-white">
				<div>
					<div className="flex items-center justify-between">
						<h1 className="font-[600] text-[15px] md:text-[20px]">
							Rekam Medis Pasien
						</h1>
					</div>
				</div>
				<br />
				{!editData && (
					<div>
						<div className="flex flex-col md:flex-row md:gap-[80px] mb-[5px]">
							<p className="text-[14px] font-[300] text-[#6D7280] min-w-[170px]">
								No Rekam Medis:
							</p>
							<p className="text-[14px] font-[600] text-black capitalize">
								{id}
							</p>
						</div>
						<div className="flex flex-col md:flex-row md:gap-[80px] mb-[5px]">
							<p className="text-[14px] font-[300] text-[#6D7280] min-w-[170px]">
								Status:
							</p>
							<p className="text-[14px] font-[600] text-black capitalize">
								{eventStatus}
							</p>
						</div>
						<div className="flex flex-col md:flex-row md:gap-[80px] mb-[5px]">
							<p className="text-[14px] font-[300] text-[#6D7280] min-w-[170px]">
								Faskes 1:
							</p>
							<p className="text-[14px] font-[600] text-black capitalize">
								{detailFaskesSatu?.rsName}
							</p>
						</div>
						<div className="flex flex-col md:flex-row md:gap-[80px] mb-[5px]">
							<p className="text-[14px] font-[300] text-[#6D7280] min-w-[170px]">
								Faskes Rujukan:
							</p>
							<p className="text-[14px] font-[600] text-black capitalize">
								{detailFaskesRujukan === null
									? '-'
									: detailFaskesRujukan?.rsName}
							</p>
						</div>
						<br />
						<div className="flex flex-col md:flex-row md:gap-[80px] mb-[5px]">
							<p className="text-[14px] font-[300] text-[#6D7280] min-w-[170px]">
								Nama:
							</p>
							<p className="text-[14px] font-[600] text-black capitalize">
								{pasien?.name}
							</p>
						</div>
						<div className="flex flex-col md:flex-row md:gap-[80px] mb-[5px]">
							<p className="text-[14px] font-[300] text-[#6D7280] min-w-[170px]">
								NIK:
							</p>
							<p className="text-[14px] font-[600] text-black capitalize">
								{pasien?.nik}
							</p>
						</div>
						<div className="flex flex-col md:flex-row md:gap-[80px] mb-[5px]">
							<p className="text-[14px] font-[300] text-[#6D7280] min-w-[170px]">
								No BPJS:
							</p>
							<p className="text-[14px] font-[600] text-black capitalize">
								{pasien?.noBpjs}
							</p>
						</div>
						<div className="flex flex-col md:flex-row md:gap-[80px] mb-[5px]">
							<p className="text-[14px] font-[300] text-[#6D7280] min-w-[170px]">
								Tanggal Lahir:
							</p>
							<p className="text-[14px] font-[600] text-black capitalize">
								{pasien?.tanggalLahir}
							</p>
						</div>
						<br />
						<div className="flex flex-col md:flex-row md:gap-[80px] mb-[5px]">
							<p className="text-[14px] font-[300] text-[#6D7280] min-w-[170px]">
								Nama Dokter Pemeriksa:
							</p>
							<p className="text-[14px] font-[600] text-black capitalize">
								{viewData?.namaDokter}
							</p>
						</div>
						<div className="flex flex-col md:flex-row md:gap-[80px] mb-[5px]">
							<p className="text-[14px] font-[300] text-[#6D7280] min-w-[170px]">
								Nama Keluarga Terdekat:
							</p>
							<p className="text-[14px] font-[600] text-black capitalize">
								{viewData?.namaKeluarga}
							</p>
						</div>
						<div className="flex flex-col md:flex-row md:gap-[80px] mb-[5px]">
							<p className="text-[14px] font-[300] text-[#6D7280] min-w-[170px]">
								Cara Masuk:
							</p>
							<p className="text-[14px] font-[600] text-black capitalize">
								{viewData?.caraMasuk}
							</p>
						</div>
						<div className="flex flex-col md:flex-row md:gap-[80px] mb-[5px]">
							<p className="text-[14px] font-[300] text-[#6D7280] min-w-[170px]">
								Diagnosa Masuk:
							</p>
							<p className="text-[14px] font-[600] text-black capitalize">
								{viewData?.dianosaMasuk}
							</p>
						</div>
						<div className="flex flex-col md:flex-row md:gap-[80px] mb-[5px]">
							<p className="text-[14px] font-[300] text-[#6D7280] min-w-[170px]">
								Komplikasi:
							</p>
							<p className="text-[14px] font-[600] text-black capitalize">
								{viewData?.komplikasi}
							</p>
						</div>
						<div className="flex flex-col md:flex-row md:gap-[80px] mb-[5px]">
							<p className="text-[14px] font-[300] text-[#6D7280] min-w-[170px]">
								Data Tindakan:
							</p>
							<p className="text-[14px] font-[600] text-black capitalize">
								{viewData?.dataTindakan}
							</p>
						</div>
						<div className="flex flex-col md:flex-row md:gap-[80px] mb-[5px]">
							<p className="text-[14px] font-[300] text-[#6D7280] min-w-[170px]">
								Transfusi Darah:
							</p>
							<p className="text-[14px] font-[600] text-black capitalize">
								{viewData?.transfusiDarah}
							</p>
						</div>
						<div className="flex flex-col md:flex-row md:gap-[80px] mb-[5px]">
							<p className="text-[14px] font-[300] text-[#6D7280] min-w-[170px]">
								Keadaan Keluar:
							</p>
							<p className="text-[14px] font-[600] text-black capitalize">
								{viewData?.keadaanKeluar}
							</p>
						</div>
						<Button
							onClick={() => setEditData(true)}
							htmlType="button"
							className="rounded-lg uppercase text-center flex justify-center items-center border-[1px] text-[#0C513F] border-[#0C513F] text-[16px] font-[600] h-[40px] w-full mt-[30px]">
							Edit data Rekam Medis
						</Button>
					</div>
				)}
				{editData && (
					<div>
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
								<Button
									loading={loadingUpdate}
									htmlType="submit"
									className="rounded-lg text-center flex justify-center items-center border-[1px] text-[#0C513F] border-[#0C513F] text-[16px] font-[600] h-[40px] w-full mt-[30px]">
									Edit Data
								</Button>
							</Form.Item>
						</Form>
					</div>
				)}
			</div>
		</div>
	);
};

export default RingkasanRekamMedis;
