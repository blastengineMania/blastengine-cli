#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
commander_1.program
    .command('init', 'APIキーとユーザー名を設定します')
    .command('t [options]', 'トランザクションメールの作成、送信を行います');
commander_1.program.parse();
