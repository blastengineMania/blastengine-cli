#!/usr/bin/env node
import { program } from 'commander';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

program
  .option('-k, --key [apiKey]', 'blastengineのAPIキーを指定してください')
  .option('-u, --username [username]', 'blastengineのユーザー名を指定してください')
  .option('-f, --from [emailaddress]', 'デフォルトの送信元アドレスを指定してください', '')
  .option('-p, --path [path]', '設定ファイルを保存するパスを指定してください（デフォルトはホームディレクトリ）', process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"])
  .parse();

const options = program.opts();
(async (options) => {
  if (!options.path || options.path.trim() === '') {
    console.log('保存先のパスが指定されていません');
    process.exit(1);
  }
  const configPath = path.join(options.path, '.blastengine', 'config.json');
  const config = {
    apiKey: options.key,
    username: options.username,
    from: options.from,
  };
  try {
    // ディレクトリが存在しない場合は作成する
    await promisify(fs.mkdir)(path.dirname(configPath), { recursive: true });
    // 設定ファイルを保存する
    await promisify(fs.writeFile)(configPath, JSON.stringify(config, null, 2));
    console.log(`APIキーとユーザー名を${configPath}に保存しました。`);
  } catch (e) {
    console.error('エラーが発生しました。設定ファイルが保存できませんでした。');
    console.error(e);
  }
})(options);