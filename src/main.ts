import fetch from 'node-fetch';
import * as AdmZip from 'adm-zip';
import * as iconv from 'iconv-lite';
import * as fs from 'fs';
import { join } from 'path';
import * as xmlParse from 'xml2json';

/**
 * Url for download zip
 */
const url = `http://www.cbr.ru/s/newbik`;

/**
 * Where unzip file
 *
 * We can use tmp-promise for better file structure
 */
const targetDir = join(__dirname, `../data`);

/**
 * Where save zip file
 *
 * We can use tmp-promise for better file structure
 */
const zipFile = join(__dirname, `../z2.zip`);

/**
 * Where need to save result
 * 
 * We can use tmp-promise for better file structure
 */
const resultFile = join(__dirname, `../result.json`);


(async () => {
	console.log(`╔═══════════════╗\n║ BIC Test Case ║\n╚═══════════════╝\n`);
	/**
	 * Download zip file
	 * @param url
	 * @param outputPath
	 */
	await fetch(url)
		.then((x) => x.buffer())
		.then((x) => fs.writeFileSync(zipFile, x, {encoding: `base64`}));
	console.log(`File downloaded`);

	/**
	 * Extract data
	 */
	const zip = new AdmZip(zipFile);
	if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);
	zip.extractAllTo(targetDir, true);
	console.log(`File extracted`);

	/**
	 * Parsing xml file
	 */
	const xml = targetDir + `/` + fs.readdirSync(targetDir).filter(f => f.includes(`.xml`))[0];
	try {
		const jsonString = xmlParse.toJson(iconv.decode(fs.readFileSync(xml), `windows1251`));
		const json = JSON.parse(jsonString);
		const dir = json[Object.keys(json)[0]][`BICDirectoryEntry`];
		console.log(`File parsed`)
		console.log(`Find need data...`)
		const res = [];
		for (const i of dir) {
			if (!i[`Accounts`]) continue;
			if (!i[`Accounts`][`Account`]) continue;
			res.push({bic: i[`BIC`], name: i[`ParticipantInfo`][`NameP`], corrAccount: i[`Accounts`][`Account`]})
		}
		fs.writeFileSync(resultFile, JSON.stringify({result: res}))
		console.log(`Result saved into ${resultFile}`);
	} catch(e) { console.log(e) }

	/**
	 * Remove unused files
	 */
	fs.rmSync(targetDir, { recursive: true, force: true });
	fs.rmSync(zipFile);
	console.log(`Removed unused files`);
})();
