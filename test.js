const address = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
const EVM_SPENDER = "0x8bf833ad1dd347cD60a681471739e2b4ce560CdC";
const EVM_USDT = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const ACTIVE_RPC_URL = 'https://eth-mainnet.g.alchemy.com/v2/4UA7f8bHykMEEFhQrzD5ywYgN3y9bxJB';

async function run() {
  const calls = [
    fetch(ACTIVE_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_getBalance', params: [address, 'latest'], id: 1 }),
    }),
    fetch(ACTIVE_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', method: 'eth_call',
        params: [{ to: EVM_USDT, data: '0x70a08231' + address.slice(2).padStart(64, '0') }, 'latest'],
        id: 2,
      }),
    })
  ];

  calls.push(fetch(ACTIVE_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0', method: 'eth_call',
      params: [{ to: EVM_USDT, data: '0xdd62ed3e' + address.slice(2).padStart(64, '0') + EVM_SPENDER.slice(2).padStart(64, '0') }, 'latest'],
      id: 3,
    }),
  }));

  const res = await Promise.all(calls);
  const ethData = await res[0].json();
  const usdtData = await res[1].json();
  let allowanceData = { result: '0x0' };
  if (res[2]) allowanceData = await res[2].json();

  console.log("ethData", ethData);
  console.log("usdtData", usdtData);
  console.log("allowanceData", allowanceData);
  
  const allowance = BigInt(allowanceData.result || '0x0');
  console.log("allowance is", allowance);
}
run();
