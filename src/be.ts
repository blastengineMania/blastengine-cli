#!/usr/bin/env node
import { program } from 'commander';
program
  .command('init', 'APIキーとユーザー名を設定します')
  .command('t [options]', 'トランザクションメールの作成、送信を行います');
program.parse();
