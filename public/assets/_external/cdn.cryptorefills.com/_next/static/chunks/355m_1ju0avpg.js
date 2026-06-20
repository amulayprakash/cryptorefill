(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,405586,72765,e=>{"use strict";class r extends Error{constructor(e){super(e.message),this.message=e.message,this.code=e.code,this.data=e.data}}e.s(["ProviderRpcError",0,r],72765);e.s(["createEIP1193Provider",0,(e,o)=>{let t,s;return e.request?t=e.request.bind(e):e.sendAsync&&(s=e,t=({method:e,params:r})=>new Promise((o,t)=>{s.sendAsync({id:0,jsonrpc:"2.0",method:e,params:r},(e,{result:r})=>{e?t(JSON.parse(e)):o(void 0==r?null:r)})})),e.request=async({method:e,params:s})=>{if(o&&null===o[e])throw new r({code:4200,message:`The Provider does not support the requested method: ${e}`});if(o&&o[e])return o[e]({baseRequest:t,params:s});if(t)return t({method:e,params:s});throw new r({code:4200,message:`The Provider does not support the requested method: ${e}`})},e}],405586)},402228,e=>{"use strict";e.i(997524);var r=e.i(72765),o=e.i(405586);let t=`
@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 300 600;
  font-display: swap;
  src: url("https://rsms.me/inter/font-files/InterVariable.woff2") format("woff2-variations");
}
`;e.i(373859);var s=e.i(646992);e.i(535758),e.i(679991);var i=e.i(4739),d=e.i(803843),n=e.i(549812);e.s(["InterVar",0,t,"ProviderRpcError",()=>r.ProviderRpcError,"ProviderRpcErrorCode",()=>s.ProviderRpcErrorCode,"createEIP1193Provider",()=>o.createEIP1193Provider,"fromHex",()=>n.fromHex,"isHex",()=>i.isHex,"toHex",()=>d.toHex],402228)}]);