#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
commander_1.program
    .option('-k, --key [apiKey]', 'blastengineのAPIキーを指定してください')
    .option('-u, --username [username]', 'blastengineのユーザー名を指定してください')
    .option('-f, --from [emailaddress]', 'デフォルトの送信元アドレスを指定してください', '')
    .option('-p, --path [path]', '設定ファイルを保存するパスを指定してください（デフォルトはホームディレクトリ）', process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"])
    .parse();
const options = commander_1.program.opts();
((options) => __awaiter(void 0, void 0, void 0, function* () {
    if (!options.path || options.path.trim() === '') {
        console.log('保存先のパスが指定されていません');
        process.exit(1);
    }
    const configPath = path_1.default.join(options.path, '.blastengine', 'config.json');
    const config = {
        apiKey: options.key,
        username: options.username,
        from: options.from,
    };
    try {
        // ディレクトリが存在しない場合は作成する
        yield (0, util_1.promisify)(fs_1.default.mkdir)(path_1.default.dirname(configPath), { recursive: true });
        // 設定ファイルを保存する
        yield (0, util_1.promisify)(fs_1.default.writeFile)(configPath, JSON.stringify(config, null, 2));
        console.log(`APIキーとユーザー名を${configPath}に保存しました。`);
    }
    catch (e) {
        console.error('エラーが発生しました。設定ファイルが保存できませんでした。');
        console.error(e);
    }
}))(options);
