exports.id=0,exports.modules={14:function(e,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.getBasicState=u,n.getMD5State=function(e){return 0},n.addStates=function e(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];if(!n||!n.length||!n[0])return;return n[0].map(function(r,t){var u=r.name,c=n.map(function(e){return e[t].score}).reduce(function(e,n){return e+n},0),o=function(e,n){if(0===n)return 0;var r=e.reduce(function(e,n){var r=n.pregnancy,t=n.score;return e+r*parseFloat(t)},0);return parseFloat((r/n).toPrecision(12))}(n.map(function(e){return e[t]}),c),a=e(n.map(function(e){return e[t].children})),i={name:u,pregnancy:o,score:c};return a&&(i.children=a),i})};var t;(t=r(15))&&t.__esModule;function u(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:[]).map(function(e){return{name:e.name,pregnancy:e.pregnancy,score:e.score,children:u(e.children)}})}}};