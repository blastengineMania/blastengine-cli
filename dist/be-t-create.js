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
const strftime_1 = __importDefault(require("strftime"));
commander_1.program
    .option('-s, --subject [subject]', 'メールの件名を指定してください', '')
    .option('-t, --to [emailaddress]', 'メールの宛先を指定してください', '')
    .option('-f, --from [emailaddress]', 'メールのFromを指定してください', '')
    .option('-c, --cc [emailaddress]', 'メールのCCを指定してください', '')
    .option('-b, --bcc [emailaddress]', 'メールのBCCを指定してください', '')
    .option('-p, --path [path]', 'メールファイルを保存するディレクトリを指定してください', path_1.default.resolve('.'))
    .parse();
const options = commander_1.program.opts();
((options) => __awaiter(void 0, void 0, void 0, function* () {
    if (!options.path || options.path.trim() === '')
        throw '保存先が指定されていません';
    const d = new Date();
    const fileName = `${(0, strftime_1.default)('%Y-%m-%d-%H-%M-%S', d)}.md`;
    const mailPath = path_1.default.join(options.path, fileName);
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
        yield (0, util_1.promisify)(fs_1.default.writeFile)(mailPath, text);
        console.log(`メールを${mailPath}に保存しました。編集してください。`);
    }
    catch (e) {
        console.error('エラーが発生しました。ファイルを保存できませんでした。');
        console.error(e);
    }
    console.log('');
}))(options);
