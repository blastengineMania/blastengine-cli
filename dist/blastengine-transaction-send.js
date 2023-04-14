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
const blastengine_1 = require("blastengine");
const configDir = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
const configPath = path_1.default.join(configDir, '.blastengine', 'config.json');
commander_1.program
    .option('-p, --path [path]', 'メールファイルを保存するパスを指定してください')
    .option('-c, --config [path]', '設定ファイルのパスを指定してください', configPath)
    .parse();
const options = commander_1.program.opts();
((options) => __awaiter(void 0, void 0, void 0, function* () {
    const parseMD = (yield import('parse-md')).default;
    try {
        if (!options.path || options.path.trim() === '') {
            console.log('メールが指定されていません');
            process.exit(1);
        }
        // メールを取得する
        const mailPath = path_1.default.join(path_1.default.resolve(options.path));
        // 読み込む
        const text = yield (0, util_1.promisify)(fs_1.default.readFile)(mailPath, 'utf-8');
        const parsed = parseMD(text);
        const metadata = parsed.metadata;
        const content = parsed.content;
        // 設定ファイルを読み込む
        const configPath = path_1.default.join(options.config);
        const config = JSON.parse(yield (0, util_1.promisify)(fs_1.default.readFile)(configPath, 'utf-8'));
        new blastengine_1.BlastEngine(config.username, config.apiKey);
        const transaction = new blastengine_1.Transaction();
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
        if (metadata.cc)
            transaction.cc = metadata.cc.split(',').map((address) => address.trim());
        if (metadata.bcc)
            transaction.bcc = metadata.bcc.split(',').map((address) => address.trim());
        const fromAddress = config.from && config.from.trim() !== '' ? config.from : metadata.from.address;
        if (!fromAddress) {
            console.log('送信元アドレスが指定されていません');
            process.exit(1);
        }
        transaction.setFrom(fromAddress, metadata.from.name);
        const result = yield transaction.send();
        console.log(`メールを送信しました。ID: ${result.delivery_id}`);
    }
    catch (e) {
        console.error('エラーが発生しました。ファイルを保存できませんでした。');
        console.error(e);
    }
    console.log('');
}))(options);
