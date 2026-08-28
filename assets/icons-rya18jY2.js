function et(c){return c&&c.__esModule&&Object.prototype.hasOwnProperty.call(c,"default")?c.default:c}var P={exports:{}},n={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var D;function nt(){if(D)return n;D=1;var c=Symbol.for("react.transitional.element"),f=Symbol.for("react.portal"),y=Symbol.for("react.fragment"),_=Symbol.for("react.strict_mode"),k=Symbol.for("react.profiler"),h=Symbol.for("react.consumer"),g=Symbol.for("react.context"),C=Symbol.for("react.forward_ref"),T=Symbol.for("react.suspense"),A=Symbol.for("react.memo"),R=Symbol.for("react.lazy"),W=Symbol.for("react.activity"),O=Symbol.iterator;function Z(t){return t===null||typeof t!="object"?null:(t=O&&t[O]||t["@@iterator"],typeof t=="function"?t:null)}var H={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},b=Object.assign,L={};function E(t,e,o){this.props=t,this.context=e,this.refs=L,this.updater=o||H}E.prototype.isReactComponent={},E.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")},E.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function I(){}I.prototype=E.prototype;function M(t,e,o){this.props=t,this.context=e,this.refs=L,this.updater=o||H}var $=M.prototype=new I;$.constructor=M,b($,E.prototype),$.isPureReactComponent=!0;var q=Array.isArray;function N(){}var i={H:null,A:null,T:null,S:null},Y=Object.prototype.hasOwnProperty;function j(t,e,o){var r=o.ref;return{$$typeof:c,type:t,key:e,ref:r!==void 0?r:null,props:o}}function X(t,e){return j(t.type,e,t.props)}function S(t){return typeof t=="object"&&t!==null&&t.$$typeof===c}function Q(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(o){return e[o]})}var U=/\/+/g;function x(t,e){return typeof t=="object"&&t!==null&&t.key!=null?Q(""+t.key):e.toString(36)}function V(t){switch(t.status){case"fulfilled":return t.value;case"rejected":throw t.reason;default:switch(typeof t.status=="string"?t.then(N,N):(t.status="pending",t.then(function(e){t.status==="pending"&&(t.status="fulfilled",t.value=e)},function(e){t.status==="pending"&&(t.status="rejected",t.reason=e)})),t.status){case"fulfilled":return t.value;case"rejected":throw t.reason}}throw t}function v(t,e,o,r,u){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var a=!1;if(t===null)a=!0;else switch(s){case"bigint":case"string":case"number":a=!0;break;case"object":switch(t.$$typeof){case c:case f:a=!0;break;case R:return a=t._init,v(a(t._payload),e,o,r,u)}}if(a)return u=u(t),a=r===""?"."+x(t,0):r,q(u)?(o="",a!=null&&(o=a.replace(U,"$&/")+"/"),v(u,e,o,"",function(tt){return tt})):u!=null&&(S(u)&&(u=X(u,o+(u.key==null||t&&t.key===u.key?"":(""+u.key).replace(U,"$&/")+"/")+a)),e.push(u)),1;a=0;var d=r===""?".":r+":";if(q(t))for(var l=0;l<t.length;l++)r=t[l],s=d+x(r,l),a+=v(r,e,o,s,u);else if(l=Z(t),typeof l=="function")for(t=l.call(t),l=0;!(r=t.next()).done;)r=r.value,s=d+x(r,l++),a+=v(r,e,o,s,u);else if(s==="object"){if(typeof t.then=="function")return v(V(t),e,o,r,u);throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.")}return a}function w(t,e,o){if(t==null)return t;var r=[],u=0;return v(t,r,"","",function(s){return e.call(o,s,u++)}),r}function J(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(o){(t._status===0||t._status===-1)&&(t._status=1,t._result=o)},function(o){(t._status===0||t._status===-1)&&(t._status=2,t._result=o)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var z=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var e=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(e))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)},F={map:w,forEach:function(t,e,o){w(t,function(){e.apply(this,arguments)},o)},count:function(t){var e=0;return w(t,function(){e++}),e},toArray:function(t){return w(t,function(e){return e})||[]},only:function(t){if(!S(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};return n.Activity=W,n.Children=F,n.Component=E,n.Fragment=y,n.Profiler=k,n.PureComponent=M,n.StrictMode=_,n.Suspense=T,n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=i,n.__COMPILER_RUNTIME={__proto__:null,c:function(t){return i.H.useMemoCache(t)}},n.cache=function(t){return function(){return t.apply(null,arguments)}},n.cacheSignal=function(){return null},n.cloneElement=function(t,e,o){if(t==null)throw Error("The argument must be a React element, but you passed "+t+".");var r=b({},t.props),u=t.key;if(e!=null)for(s in e.key!==void 0&&(u=""+e.key),e)!Y.call(e,s)||s==="key"||s==="__self"||s==="__source"||s==="ref"&&e.ref===void 0||(r[s]=e[s]);var s=arguments.length-2;if(s===1)r.children=o;else if(1<s){for(var a=Array(s),d=0;d<s;d++)a[d]=arguments[d+2];r.children=a}return j(t.type,u,r)},n.createContext=function(t){return t={$$typeof:g,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null},t.Provider=t,t.Consumer={$$typeof:h,_context:t},t},n.createElement=function(t,e,o){var r,u={},s=null;if(e!=null)for(r in e.key!==void 0&&(s=""+e.key),e)Y.call(e,r)&&r!=="key"&&r!=="__self"&&r!=="__source"&&(u[r]=e[r]);var a=arguments.length-2;if(a===1)u.children=o;else if(1<a){for(var d=Array(a),l=0;l<a;l++)d[l]=arguments[l+2];u.children=d}if(t&&t.defaultProps)for(r in a=t.defaultProps,a)u[r]===void 0&&(u[r]=a[r]);return j(t,s,u)},n.createRef=function(){return{current:null}},n.forwardRef=function(t){return{$$typeof:C,render:t}},n.isValidElement=S,n.lazy=function(t){return{$$typeof:R,_payload:{_status:-1,_result:t},_init:J}},n.memo=function(t,e){return{$$typeof:A,type:t,compare:e===void 0?null:e}},n.startTransition=function(t){var e=i.T,o={};i.T=o;try{var r=t(),u=i.S;u!==null&&u(o,r),typeof r=="object"&&r!==null&&typeof r.then=="function"&&r.then(N,z)}catch(s){z(s)}finally{e!==null&&o.types!==null&&(e.types=o.types),i.T=e}},n.unstable_useCacheRefresh=function(){return i.H.useCacheRefresh()},n.use=function(t){return i.H.use(t)},n.useActionState=function(t,e,o){return i.H.useActionState(t,e,o)},n.useCallback=function(t,e){return i.H.useCallback(t,e)},n.useContext=function(t){return i.H.useContext(t)},n.useDebugValue=function(){},n.useDeferredValue=function(t,e){return i.H.useDeferredValue(t,e)},n.useEffect=function(t,e){return i.H.useEffect(t,e)},n.useEffectEvent=function(t){return i.H.useEffectEvent(t)},n.useId=function(){return i.H.useId()},n.useImperativeHandle=function(t,e,o){return i.H.useImperativeHandle(t,e,o)},n.useInsertionEffect=function(t,e){return i.H.useInsertionEffect(t,e)},n.useLayoutEffect=function(t,e){return i.H.useLayoutEffect(t,e)},n.useMemo=function(t,e){return i.H.useMemo(t,e)},n.useOptimistic=function(t,e){return i.H.useOptimistic(t,e)},n.useReducer=function(t,e,o){return i.H.useReducer(t,e,o)},n.useRef=function(t){return i.H.useRef(t)},n.useState=function(t){return i.H.useState(t)},n.useSyncExternalStore=function(t,e,o){return i.H.useSyncExternalStore(t,e,o)},n.useTransition=function(){return i.H.useTransition()},n.version="19.2.7",n}var G;function rt(){return G||(G=1,P.exports=nt()),P.exports}var m=rt();const Mt=et(m);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ot=c=>c.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),ut=c=>c.replace(/^([A-Z])|[\s-_]+(\w)/g,(f,y,_)=>_?_.toUpperCase():y.toLowerCase()),B=c=>{const f=ut(c);return f.charAt(0).toUpperCase()+f.slice(1)},K=(...c)=>c.filter((f,y,_)=>!!f&&f.trim()!==""&&_.indexOf(f)===y).join(" ").trim(),st=c=>{for(const f in c)if(f.startsWith("aria-")||f==="role"||f==="title")return!0};/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var ct={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const it=m.forwardRef(({color:c="currentColor",size:f=24,strokeWidth:y=2,absoluteStrokeWidth:_,className:k="",children:h,iconNode:g,...C},T)=>m.createElement("svg",{ref:T,...ct,width:f,height:f,stroke:c,strokeWidth:_?Number(y)*24/Number(f):y,className:K("lucide",k),...!h&&!st(C)&&{"aria-hidden":"true"},...C},[...g.map(([A,R])=>m.createElement(A,R)),...Array.isArray(h)?h:[h]]));/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=(c,f)=>{const y=m.forwardRef(({className:_,...k},h)=>m.createElement(it,{ref:h,iconNode:f,className:K(`lucide-${ot(B(c))}`,`lucide-${c}`,_),...k}));return y.displayName=B(c),y};/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const at=[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]],$t=p("arrow-down",at);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ft=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]],Nt=p("arrow-right",ft);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pt=[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]],jt=p("arrow-up-right",pt);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lt=[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]],St=p("arrow-up",lt);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yt=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],xt=p("check",yt);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _t=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],Pt=p("circle-check",_t);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dt=[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]],Ot=p("copy",dt);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ht=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]],Ht=p("external-link",ht);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Et=[["path",{d:"M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",key:"tonef"}],["path",{d:"M9 18c-4.51 2-5-2-7-2",key:"9comsn"}]],bt=p("github",Et);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vt=[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]],Lt=p("graduation-cap",vt);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mt=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],It=p("info",mt);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kt=[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]],qt=p("mail",kt);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ct=[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]],Yt=p("menu",Ct);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rt=[["path",{d:"M12.586 12.586 19 19",key:"ea5xo7"}],["path",{d:"M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z",key:"277e5u"}]],Ut=p("mouse-pointer",Rt);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wt=[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",key:"10ikf1"}]],zt=p("play",wt);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gt=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]],Dt=p("rotate-ccw",gt);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tt=[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]],Gt=p("send",Tt);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const At=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],Bt=p("x",At);export{$t as A,Pt as C,Ht as E,bt as G,It as I,Yt as M,zt as P,Dt as R,Gt as S,Bt as X,rt as a,jt as b,St as c,Nt as d,Ut as e,Mt as f,et as g,Lt as h,qt as i,xt as j,Ot as k,m as r};
