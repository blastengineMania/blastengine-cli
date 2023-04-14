#!/usr/bin/env node
import { program } from 'commander';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { BlastEngine, Transaction } from 'blastengine';

const configDir = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
const configPath = path.join(configDir!, '.blastengine', 'config.json');

program
  .option('-p, --path [path]', 'メールファイルを保存するパスを指定してください')
  .option('-c, --config [path]', '設定ファイルのパスを指定してください', configPath)
  .parse();

type Metadata = {
	subject: string;
	to: string;
	cc: string | null;
	bcc: string | null;
	from: {
		address: string;
		name: string;
	}
};

const options = program.opts();
(async (options) => {
	const parseMD = (await import('parse-md')).default;
	try {
		if (!options.path || options.path.trim() === '') {
			console.log('メールが指定されていません');
			process.exit(1);
		}
    // メールを取得する
		const mailPath = path.join(path.resolve(options.path));
		// 読み込む
		const text = await promisify(fs.readFile)(mailPath, 'utf-8');
		const parsed = parseMD(text);
		const metadata = parsed.metadata as Metadata;
		const content = parsed.content;
		// 設定ファイルを読み込む
		const configPath = path.join(options.config);
		const config = JSON.parse(await promisify(fs.readFile)(configPath, 'utf-8'));
		new BlastEngine(config.username, config.apiKey);
		const transaction = new Transaction();
		if (!metadata.to || metadata.to.trim() === '') {
			console.log('宛先が指定されていません');
			process.exit(1);
		}
		if (!metadata.subject || metadata.subject.trim() === '') {
			console.log('件名が指定されていません');
			process.exit(1);
		}
		transaction.subject = metadata.subject;
		transaction.to = metadata.to;
		transaction.text_part = content;
		if (metadata.cc) transaction.cc = metadata.cc.split(',').map((address) => address.trim());
		if (metadata.bcc) transaction.bcc = metadata.bcc.split(',').map((address) => address.trim());
		const fromAddress = config.from && config.from.trim() !== '' ? config.from : metadata.from.address;
		if (!fromAddress) {
			console.log('送信元アドレスが指定されていません');
			process.exit(1);
		}
		transaction.setFrom(fromAddress, metadata.from.name);
		const result = await transaction.send();
		console.log(`メールを送信しました。ID: ${result.delivery_id}`);
  } catch (e) {
    console.error('エラーが発生しました。ファイルを保存できませんでした。');
    console.error(e);
  }
	console.log('');
})(options);
