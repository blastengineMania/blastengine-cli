#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
commander_1.program
    .command('init', 'Initialize API Key and User')
    .command('transaction [options]', 'Send transaction email');
commander_1.program.parse();
