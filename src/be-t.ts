#!/usr/bin/env node
import { program } from 'commander';

program
  .command('create', 'メールのテンプレートを作成します')
  .command('send', 'メールを送信します');

program.parse();