import { create } from 'ipfs-http-client';

const projectId = '2IgLfSjJkh4rqMgcE9c1SJdu4Yb';
const projectSecret = 'e31edc76c41b4e4664d544f14930eae8';
const auth =
	'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

async function ipfsClient() {
	const ipfs = await create({
		host: 'ipfs.infura.io',
		port: 5001,
		protocol: 'https',
		headers: {
			authorization: auth,
			'Access-Control-Allow-Origin': ['*'],
		},
	});
	return ipfs;
}

export async function saveText(data) {
	let ipfs = await ipfsClient();
	let options = {
		warpWithDirectory: false,
		progress: (prog) => console.log(`Saved :${prog}`),
	};
	let result = await ipfs.add(data, options);
	return result;
}

export async function getData(hash) {
	let ipfs = await ipfsClient();

	let asyncitr = ipfs.cat(hash);

	for await (const itr of asyncitr) {
		let data = Buffer.from(itr).toString();
		console.log(data);
	}
}
