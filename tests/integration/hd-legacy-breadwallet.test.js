/* global it, jasmine, afterAll, beforeAll */
import { HDLegacyBreadwalletWallet } from '../../class';
const assert = require('assert');
global.net = require('net'); // needed by Electrum client. For RN it is proviced in shim.js
global.tls = require('tls'); // needed by Electrum client. For RN it is proviced in shim.js
const BlueElectrum = require('../../blue_modules/BlueElectrum'); // so it connects ASAP

jasmine.DEFAULT_TIMEOUT_INTERVAL = 300 * 1000;

afterAll(async () => {
  // after all tests we close socket so the test suite can actually terminate
  BlueElectrum.forceDisconnect();
});

beforeAll(async () => {
  // awaiting for Electrum to be connected. For RN Electrum would naturally connect
  // while app starts up, but for tests we need to wait for it
  await BlueElectrum.waitTillConnected();
});

it('Legacy HD Breadwallet can fetch balance', async () => {
  if (!process.env.HD_MNEMONIC_BREAD) {
    console.error('process.env.HD_MNEMONIC_BREAD not set, skipped');
    return;
  }
  const wallet = new HDLegacyBreadwalletWallet();
  wallet.setSecret(process.env.HD_MNEMONIC_BREAD);

  await wallet.fetchBalance();
  assert.strictEqual(wallet.getBalance(), 2973200);
});
