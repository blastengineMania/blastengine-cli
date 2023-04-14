#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
commander_1.program
    .command('create', 'メールのテンプレートを作成します')
    .command('send', 'メールを送信します');
commander_1.program.parse();
