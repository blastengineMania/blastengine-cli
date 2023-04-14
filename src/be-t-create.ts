#!/usr/bin/env node
import { program } from 'commander';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import strftime from 'strftime';

program
  .option('-s, --subject [subject]', 'メールの件名を指定してください', '')
  .option('-t, --to [emailaddress]', 'メールの宛先を指定してください', '')
	.option('-f, --from [emailaddress]', 'メールのFromを指定してください', '')
  .option('-c, --cc [emailaddress]', 'メールのCCを指定してください', '')
  .option('-b, --bcc [emailaddress]', 'メールのBCCを指定してください', '')
  .option('-p, --path [path]', 'メールファイルを保存するディレクトリを指定してください', path.resolve('.'))
  .parse();

const options = program.opts();
(async (options) => {
  if (!options.path || options.path.trim() === '') throw '保存先が指定されていません';
	const d = new Date();
	const fileName = `${strftime('%Y-%m-%d-%H-%M-%S', d)}.md`;
  const mailPath = path.join(options.path, fileName);
  const text = `---
subject: ${options.subject}
to: ${options.to}
from:
  name: 
  address: ${options.from}
cc: ${options.cc}
bcc: ${options.bcc}
---

`;
  try {
    // メールを保存する
		await promisify(fs.writeFile)(mailPath, text);
    console.log(`メールを${mailPath}に保存しました。編集してください。`);
  } catch (e) {
    console.error('エラーが発生しました。ファイルを保存できませんでした。');
    console.error(e);
  }
	console.log('');
})(options);