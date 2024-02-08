"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _pdfkit = _interopRequireDefault(require("pdfkit"));
var _getStream = _interopRequireDefault(require("get-stream"));
var _fs = _interopRequireDefault(require("fs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && _instanceof(outerFn.prototype, Generator) ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var isoAlpha2Countries = {
  AF: "Afghanistan",
  AX: "Aland Islands",
  AL: "Albania",
  DZ: "Algeria",
  AS: "American Samoa",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antarctica",
  AG: "Antigua And Barbuda",
  AR: "Argentina",
  AM: "Armenia",
  AW: "Aruba",
  AU: "Australia",
  AT: "Austria",
  AZ: "Azerbaijan",
  BS: "Bahamas",
  BH: "Bahrain",
  BD: "Bangladesh",
  BB: "Barbados",
  BY: "Belarus",
  BE: "Belgium",
  BZ: "Belize",
  BJ: "Benin",
  BM: "Bermuda",
  BT: "Bhutan",
  BO: "Bolivia",
  BA: "Bosnia And Herzegovina",
  BW: "Botswana",
  BV: "Bouvet Island",
  BR: "Brazil",
  IO: "British Indian Ocean Territory",
  BN: "Brunei Darussalam",
  BG: "Bulgaria",
  BF: "Burkina Faso",
  BI: "Burundi",
  KH: "Cambodia",
  CM: "Cameroon",
  CA: "Canada",
  CV: "Cape Verde",
  KY: "Cayman Islands",
  CF: "Central African Republic",
  TD: "Chad",
  CL: "Chile",
  CN: "China",
  CX: "Christmas Island",
  CC: "Cocos (Keeling) Islands",
  CO: "Colombia",
  KM: "Comoros",
  CG: "Congo",
  CD: "Congo, Democratic Republic",
  CK: "Cook Islands",
  CR: "Costa Rica",
  CI: "Cote D'Ivoire",
  HR: "Croatia",
  CU: "Cuba",
  CY: "Cyprus",
  CZ: "Czech Republic",
  DK: "Denmark",
  DJ: "Djibouti",
  DM: "Dominica",
  DO: "Dominican Republic",
  EC: "Ecuador",
  EG: "Egypt",
  SV: "El Salvador",
  GQ: "Equatorial Guinea",
  ER: "Eritrea",
  EE: "Estonia",
  ET: "Ethiopia",
  FK: "Falkland Islands (Malvinas)",
  FO: "Faroe Islands",
  FJ: "Fiji",
  FI: "Finland",
  FR: "France",
  GF: "French Guiana",
  PF: "French Polynesia",
  TF: "French Southern Territories",
  GA: "Gabon",
  GM: "Gambia",
  GE: "Georgia",
  DE: "Germany",
  GH: "Ghana",
  GI: "Gibraltar",
  GR: "Greece",
  GL: "Greenland",
  GD: "Grenada",
  GP: "Guadeloupe",
  GU: "Guam",
  GT: "Guatemala",
  GG: "Guernsey",
  GN: "Guinea",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HT: "Haiti",
  HM: "Heard Island & Mcdonald Islands",
  VA: "Holy See (Vatican City State)",
  HN: "Honduras",
  HK: "Hong Kong",
  HU: "Hungary",
  IS: "Iceland",
  IN: "India",
  ID: "Indonesia",
  IR: "Iran, Islamic Republic Of",
  IQ: "Iraq",
  IE: "Ireland",
  IM: "Isle Of Man",
  IL: "Israel",
  IT: "Italy",
  JM: "Jamaica",
  JP: "Japan",
  JE: "Jersey",
  JO: "Jordan",
  KZ: "Kazakhstan",
  KE: "Kenya",
  KI: "Kiribati",
  KR: "South Korea",
  KW: "Kuwait",
  KG: "Kyrgyzstan",
  LA: "Lao People's Democratic Republic",
  LV: "Latvia",
  LB: "Lebanon",
  LS: "Lesotho",
  LR: "Liberia",
  LY: "Libyan Arab Jamahiriya",
  LI: "Liechtenstein",
  LT: "Lithuania",
  LU: "Luxembourg",
  MO: "Macao",
  MK: "Macedonia",
  MG: "Madagascar",
  MW: "Malawi",
  MY: "Malaysia",
  MV: "Maldives",
  ML: "Mali",
  MT: "Malta",
  MH: "Marshall Islands",
  MQ: "Martinique",
  MR: "Mauritania",
  MU: "Mauritius",
  YT: "Mayotte",
  MX: "Mexico",
  FM: "Micronesia, Federated States Of",
  MD: "Moldova",
  MC: "Monaco",
  MN: "Mongolia",
  ME: "Montenegro",
  MS: "Montserrat",
  MA: "Morocco",
  MZ: "Mozambique",
  MM: "Myanmar",
  NA: "Namibia",
  NR: "Nauru",
  NP: "Nepal",
  NL: "Netherlands",
  AN: "Netherlands Antilles",
  NC: "New Caledonia",
  NZ: "New Zealand",
  NI: "Nicaragua",
  NE: "Niger",
  NG: "Nigeria",
  NU: "Niue",
  NF: "Norfolk Island",
  MP: "Northern Mariana Islands",
  NO: "Norway",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palau",
  PS: "Palestinian Territory, Occupied",
  PA: "Panama",
  PG: "Papua New Guinea",
  PY: "Paraguay",
  PE: "Peru",
  PH: "Philippines",
  PN: "Pitcairn",
  PL: "Poland",
  PT: "Portugal",
  PR: "Puerto Rico",
  QA: "Qatar",
  RE: "Reunion",
  RO: "Romania",
  RU: "Russian Federation",
  RW: "Rwanda",
  BL: "Saint Barthelemy",
  SH: "Saint Helena",
  KN: "Saint Kitts And Nevis",
  LC: "Saint Lucia",
  MF: "Saint Martin",
  PM: "Saint Pierre And Miquelon",
  VC: "Saint Vincent And Grenadines",
  WS: "Samoa",
  SM: "San Marino",
  ST: "Sao Tome And Principe",
  SA: "Saudi Arabia",
  SN: "Senegal",
  RS: "Serbia",
  SC: "Seychelles",
  SL: "Sierra Leone",
  SG: "Singapore",
  SK: "Slovakia",
  SI: "Slovenia",
  SB: "Solomon Islands",
  SO: "Somalia",
  ZA: "South Africa",
  GS: "South Georgia And Sandwich Isl.",
  ES: "Spain",
  LK: "Sri Lanka",
  SD: "Sudan",
  SR: "Suriname",
  SJ: "Svalbard And Jan Mayen",
  SZ: "Swaziland",
  SE: "Sweden",
  CH: "Switzerland",
  SY: "Syrian Arab Republic",
  TW: "Taiwan",
  TJ: "Tajikistan",
  TZ: "Tanzania",
  TH: "Thailand",
  TL: "Timor-Leste",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad And Tobago",
  TN: "Tunisia",
  TR: "Turkey",
  TM: "Turkmenistan",
  TC: "Turks And Caicos Islands",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Ukraine",
  AE: "United Arab Emirates",
  GB: "United Kingdom",
  US: "United States",
  UM: "United States Outlying Islands",
  UY: "Uruguay",
  UZ: "Uzbekistan",
  VU: "Vanuatu",
  VE: "Venezuela",
  VN: "Viet Nam",
  VG: "Virgin Islands, British",
  VI: "Virgin Islands, U.S.",
  WF: "Wallis And Futuna",
  EH: "Western Sahara",
  YE: "Yemen",
  ZM: "Zambia",
  ZW: "Zimbabwe"
};
var PdfGenerator = /*#__PURE__*/function () {
  function PdfGenerator() {
    _classCallCheck(this, PdfGenerator);
    this.PDFDocument = _pdfkit["default"];
    this.getStream = _getStream["default"];
    this.top = 0;
    this.item = 0;
    this.lastHeight = 0;
    this.margin = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    };
    this.empty = '__UNDEFINED__';
  }
  _createClass(PdfGenerator, [{
    key: "startPdf",
    value: function () {
      var _startPdf = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(options) {
        var _options$pdf$settings, _options$pdf, _options$pdf$settings2, _options$pdf$settings3, _options$pdf2, _options$pdf2$setting, _options$pdf$settings4, _options$pdf3, _options$pdf3$setting, _options$pdf$settings5, _options$pdf4, _options$pdf4$setting, _this$margin$top, _options$pdf5, _options$pdf5$setting, _options$pdf6, _options$pdf6$setting;
        var doc, _options$pdf7, _options$pdf7$setting, _options$pdf7$setting2, _options$pdf8, _options$pdf8$setting, _options$pdf8$setting2, fontBuffer;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              doc = new this.PDFDocument({
                size: (_options$pdf$settings = options === null || options === void 0 ? void 0 : (_options$pdf = options.pdf) === null || _options$pdf === void 0 ? void 0 : (_options$pdf$settings2 = _options$pdf.settings) === null || _options$pdf$settings2 === void 0 ? void 0 : _options$pdf$settings2.format) !== null && _options$pdf$settings !== void 0 ? _options$pdf$settings : 'A4',
                margin: (_options$pdf$settings3 = options === null || options === void 0 ? void 0 : (_options$pdf2 = options.pdf) === null || _options$pdf2 === void 0 ? void 0 : (_options$pdf2$setting = _options$pdf2.settings) === null || _options$pdf2$setting === void 0 ? void 0 : _options$pdf2$setting.margin) !== null && _options$pdf$settings3 !== void 0 ? _options$pdf$settings3 : this.margin
              });
              this.margin = (_options$pdf$settings4 = options === null || options === void 0 ? void 0 : (_options$pdf3 = options.pdf) === null || _options$pdf3 === void 0 ? void 0 : (_options$pdf3$setting = _options$pdf3.settings) === null || _options$pdf3$setting === void 0 ? void 0 : _options$pdf3$setting.margin) !== null && _options$pdf$settings4 !== void 0 ? _options$pdf$settings4 : this.margin;
              this.empty = (_options$pdf$settings5 = options === null || options === void 0 ? void 0 : (_options$pdf4 = options.pdf) === null || _options$pdf4 === void 0 ? void 0 : (_options$pdf4$setting = _options$pdf4.settings) === null || _options$pdf4$setting === void 0 ? void 0 : _options$pdf4$setting.empty) !== null && _options$pdf$settings5 !== void 0 ? _options$pdf$settings5 : this.empty;
              this.top = (_this$margin$top = this.margin.top) !== null && _this$margin$top !== void 0 ? _this$margin$top : 0;
              if (options !== null && options !== void 0 && (_options$pdf5 = options.pdf) !== null && _options$pdf5 !== void 0 && (_options$pdf5$setting = _options$pdf5.settings) !== null && _options$pdf5$setting !== void 0 && _options$pdf5$setting.font && typeof (options === null || options === void 0 ? void 0 : (_options$pdf6 = options.pdf) === null || _options$pdf6 === void 0 ? void 0 : (_options$pdf6$setting = _options$pdf6.settings) === null || _options$pdf6$setting === void 0 ? void 0 : _options$pdf6$setting.font) !== 'string') {
                try {
                  fontBuffer = _fs["default"].readFileSync("".concat(process.cwd(), "/src/fonts/").concat(options === null || options === void 0 ? void 0 : (_options$pdf7 = options.pdf) === null || _options$pdf7 === void 0 ? void 0 : (_options$pdf7$setting = _options$pdf7.settings) === null || _options$pdf7$setting === void 0 ? void 0 : (_options$pdf7$setting2 = _options$pdf7$setting.font) === null || _options$pdf7$setting2 === void 0 ? void 0 : _options$pdf7$setting2.file));
                  doc.registerFont(options === null || options === void 0 ? void 0 : (_options$pdf8 = options.pdf) === null || _options$pdf8 === void 0 ? void 0 : (_options$pdf8$setting = _options$pdf8.settings) === null || _options$pdf8$setting === void 0 ? void 0 : (_options$pdf8$setting2 = _options$pdf8$setting.font) === null || _options$pdf8$setting2 === void 0 ? void 0 : _options$pdf8$setting2.name, fontBuffer);
                } catch (e) {
                  console.log("Font error: ", e);
                }
              }
              return _context.abrupt("return", doc);
            case 6:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function startPdf(_x) {
        return _startPdf.apply(this, arguments);
      }
      return startPdf;
    }()
  }, {
    key: "generateHeader",
    value: function () {
      var _generateHeader = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(doc, options) {
        var _options$pdf9,
          _this = this;
        var header, _header$height, layout, layoutJSON;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              header = options === null || options === void 0 ? void 0 : (_options$pdf9 = options.pdf) === null || _options$pdf9 === void 0 ? void 0 : _options$pdf9.header;
              if (!(header && header !== null && header !== void 0 && header.enabled)) {
                _context2.next = 13;
                break;
              }
              _context2.prev = 2;
              layout = [];
              if (header !== null && header !== void 0 && header.content) {
                layoutJSON = _fs["default"].readFileSync("".concat(process.cwd(), "/src/layouts/").concat(header.content));
                layout = JSON.parse(layoutJSON);
              }
              layout.forEach(function (layoutItem) {
                return _this.generateElement(doc, layoutItem);
              });
              this.top += (_header$height = header === null || header === void 0 ? void 0 : header.height) !== null && _header$height !== void 0 ? _header$height : 50;
              _context2.next = 13;
              break;
            case 9:
              _context2.prev = 9;
              _context2.t0 = _context2["catch"](2);
              console.log("Header error: ", _context2.t0);
              return _context2.abrupt("return");
            case 13:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[2, 9]]);
      }));
      function generateHeader(_x2, _x3) {
        return _generateHeader.apply(this, arguments);
      }
      return generateHeader;
    }()
  }, {
    key: "generateFooter",
    value: function () {
      var _generateFooter = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(doc, options) {
        var _options$pdf10,
          _this2 = this;
        var footer, _footer$height, layout, layoutJSON;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              footer = options === null || options === void 0 ? void 0 : (_options$pdf10 = options.pdf) === null || _options$pdf10 === void 0 ? void 0 : _options$pdf10.footer;
              if (!(footer && footer !== null && footer !== void 0 && footer.enabled)) {
                _context3.next = 13;
                break;
              }
              _context3.prev = 2;
              layout = [];
              if (footer !== null && footer !== void 0 && footer.content) {
                layoutJSON = _fs["default"].readFileSync("".concat(process.cwd(), "/src/layouts/").concat(footer.content));
                layout = JSON.parse(layoutJSON);
              }
              layout.forEach(function (layoutItem) {
                return _this2.generateElement(doc, layoutItem);
              });
              this.top += (_footer$height = footer === null || footer === void 0 ? void 0 : footer.height) !== null && _footer$height !== void 0 ? _footer$height : 50;
              _context3.next = 13;
              break;
            case 9:
              _context3.prev = 9;
              _context3.t0 = _context3["catch"](2);
              console.log("Footer error: ", _context3.t0);
              return _context3.abrupt("return");
            case 13:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this, [[2, 9]]);
      }));
      function generateFooter(_x4, _x5) {
        return _generateFooter.apply(this, arguments);
      }
      return generateFooter;
    }()
  }, {
    key: "getVariable",
    value: function getVariable(keys, data) {
      var _this3 = this;
      var value = keys[0] === 'item' ? data === null || data === void 0 ? void 0 : data.items[this.item] : data;
      keys.shift();
      keys.forEach(function (k) {
        var _value$k;
        return value = (_value$k = value[k]) !== null && _value$k !== void 0 ? _value$k : _this3.empty;
      });
      return value;
    }
  }, {
    key: "parseVariables",
    value: function parseVariables(text, data) {
      var _this4 = this;
      var ifRegex = /\{\{\s*if\s+([\w\s\.]+)\s*\}\}([\s\S]*?)\{\{\s*endif\s*\}\}/gi;
      text = text.replace(ifRegex, function (match, statement, content) {
        var keys = statement.startsWith('not ') ? statement.split('not ')[1].split('.') : statement.split('.');
        var value = _this4.getVariable(keys, data);
        if (value === _this4.empty || value === false || value === "") return statement.startsWith('not ') ? content : '';
        return statement.startsWith('not ') ? '' : content;
      });
      var regex = /{{\s(.*?)(?=\s}})\s}}/ig;
      return text.replace(regex, function (match, key) {
        var _value;
        var _key$split = key.split(' | '),
          _key$split2 = _slicedToArray(_key$split, 2),
          keys = _key$split2[0],
          filter = _key$split2[1];
        keys = keys.split('.');
        var value = _this4.getVariable(keys, data);
        if (filter) {
          if (filter.startsWith('date')) {
            var _JSON$parse;
            var dateRegex = /date\(['"]([^'"]+)['"][\,\s]{0,2}([^))]*)\)/i;
            var _dateRegex$exec = dateRegex.exec(filter),
              _dateRegex$exec2 = _slicedToArray(_dateRegex$exec, 3),
              _ = _dateRegex$exec2[0],
              locale = _dateRegex$exec2[1],
              format = _dateRegex$exec2[2];
            value = new Date(value).toLocaleDateString(locale, (_JSON$parse = JSON.parse(format.replaceAll("'", '"'))) !== null && _JSON$parse !== void 0 ? _JSON$parse : {});
          } else if (filter.startsWith('currency')) {
            var numberRegex = /currency\(['"]([^'"]+)['"]\)/i;
            var _numberRegex$exec = numberRegex.exec(filter),
              _numberRegex$exec2 = _slicedToArray(_numberRegex$exec, 2),
              _2 = _numberRegex$exec2[0],
              _locale = _numberRegex$exec2[1];
            if (typeof value === 'string') value = parseFloat(value.replace(data === null || data === void 0 ? void 0 : data.currency_code.toUpperCase(), ''));
            value = new Intl.NumberFormat(_locale, {
              style: 'currency',
              currency: data === null || data === void 0 ? void 0 : data.currency_code.toUpperCase()
            }).format(value / 100);
          } else if (filter.startsWith('country')) {
            var _isoAlpha2Countries$v;
            if (typeof value === 'string') value = (_isoAlpha2Countries$v = isoAlpha2Countries[value.toUpperCase()]) !== null && _isoAlpha2Countries$v !== void 0 ? _isoAlpha2Countries$v : "";
          }
        }
        return (_value = value) !== null && _value !== void 0 ? _value : _this4.empty;
      });
    }
  }, {
    key: "generateElement",
    value: function generateElement(doc, layoutItem, data) {
      var _layoutItem$y,
        _layoutItem$x,
        _layoutItem$y2,
        _layoutItem$lines,
        _layoutItem$color,
        _layoutItem$width,
        _layoutItem$x2,
        _layoutItem$y3,
        _layoutItem$width2,
        _layoutItem$y4,
        _layoutItem$height,
        _layoutItem$x3,
        _layoutItem$columns,
        _this5 = this;
      switch (layoutItem.type) {
        case 'image':
          var imageOptions = {
            "fit": layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.fit
          };
          if (layoutItem !== null && layoutItem !== void 0 && layoutItem.align) imageOptions.align = layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.align;
          if (layoutItem !== null && layoutItem !== void 0 && layoutItem.valign) imageOptions.valign = layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.valign;
          doc.image("".concat(process.cwd(), "/src/images/").concat(layoutItem.image), layoutItem.x, this.margin.left + ((_layoutItem$y = layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.y) !== null && _layoutItem$y !== void 0 ? _layoutItem$y : 0), imageOptions);
          break;
        case 'text':
          if (layoutItem !== null && layoutItem !== void 0 && layoutItem.color) doc.fillColor(layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.color);
          if (layoutItem !== null && layoutItem !== void 0 && layoutItem.font) doc.font(layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.font);
          if (layoutItem !== null && layoutItem !== void 0 && layoutItem.size) doc.fontSize(layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.size);
          if (layoutItem !== null && layoutItem !== void 0 && layoutItem.width && typeof (layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.width) === 'string') layoutItem.width = parseInt(doc.page.width - this.margin.left - this.margin.right);else if (layoutItem !== null && layoutItem !== void 0 && layoutItem.width && typeof (layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.width) === 'number') layoutItem.width = parseInt(layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.width);
          var parsedText = this.parseVariables(layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.text, data);
          var textOptions = Object.fromEntries(Object.entries(layoutItem).filter(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 1),
              key = _ref2[0];
            return !['type', 'color', 'font', 'size', 'text', 'x', 'y'].includes(key);
          }));
          this.lastHeight = doc.heightOfString(parsedText, textOptions);
          if (layoutItem !== null && layoutItem !== void 0 && layoutItem.x || layoutItem !== null && layoutItem !== void 0 && layoutItem.y) doc.text(this.parseVariables(layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.text, data), this.margin.left + ((_layoutItem$x = layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.x) !== null && _layoutItem$x !== void 0 ? _layoutItem$x : 0), (_layoutItem$y2 = layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.y) !== null && _layoutItem$y2 !== void 0 ? _layoutItem$y2 : this.top, textOptions);else doc.text(this.parseVariables(layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.text, data), this.margin.left, this.top, textOptions);
          //this.top += textHeight
          break;
        case 'moveDown':
          //doc.moveDown(layoutItem?.lines??1)
          // fake movedown by altering this.top + last fontsize * 1.5 or use measured height
          if (layoutItem !== null && layoutItem !== void 0 && layoutItem.useMeasure) this.top += parseInt(this.lastHeight);else this.top += parseInt(doc._fontSize) * 1.5 * ((_layoutItem$lines = layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.lines) !== null && _layoutItem$lines !== void 0 ? _layoutItem$lines : 1);
          break;
        case 'hr':
          doc.strokeColor((_layoutItem$color = layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.color) !== null && _layoutItem$color !== void 0 ? _layoutItem$color : '#aaaaaa').lineWidth((_layoutItem$width = layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.width) !== null && _layoutItem$width !== void 0 ? _layoutItem$width : 1).moveTo((_layoutItem$x2 = layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.x) !== null && _layoutItem$x2 !== void 0 ? _layoutItem$x2 : this.margin.left, (_layoutItem$y3 = layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.y) !== null && _layoutItem$y3 !== void 0 ? _layoutItem$y3 : this.top).lineTo((_layoutItem$width2 = layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.width) !== null && _layoutItem$width2 !== void 0 ? _layoutItem$width2 : doc.page.width - this.margin.right, (_layoutItem$y4 = layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.y) !== null && _layoutItem$y4 !== void 0 ? _layoutItem$y4 : this.top).stroke();
          this.top += (_layoutItem$height = layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.height) !== null && _layoutItem$height !== void 0 ? _layoutItem$height : 10;
          break;
        case 'tableRow':
          if (layoutItem !== null && layoutItem !== void 0 && layoutItem.color) doc.fillColor(layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.color);
          if (layoutItem !== null && layoutItem !== void 0 && layoutItem.font) doc.font(layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.font);
          if (layoutItem !== null && layoutItem !== void 0 && layoutItem.size) doc.fontSize(layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.size);
          var xPos = this.margin.left + ((_layoutItem$x3 = layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.x) !== null && _layoutItem$x3 !== void 0 ? _layoutItem$x3 : 0);
          layoutItem === null || layoutItem === void 0 ? void 0 : (_layoutItem$columns = layoutItem.columns) === null || _layoutItem$columns === void 0 ? void 0 : _layoutItem$columns.forEach(function (column) {
            var _column$y;
            if (column !== null && column !== void 0 && column.color) doc.fillColor(column === null || column === void 0 ? void 0 : column.color);
            if (column !== null && column !== void 0 && column.font) doc.font(column === null || column === void 0 ? void 0 : column.font);
            if (column !== null && column !== void 0 && column.size) doc.fontSize(column === null || column === void 0 ? void 0 : column.size);
            if (column !== null && column !== void 0 && column.width && typeof (column === null || column === void 0 ? void 0 : column.width) === 'string') column.width = parseInt(doc.page.width - _this5.margin.left - _this5.margin.right);else if (column !== null && column !== void 0 && column.width && typeof (column === null || column === void 0 ? void 0 : column.width) === 'number') column.width = parseInt(column === null || column === void 0 ? void 0 : column.width);
            var parsedText = _this5.parseVariables(column === null || column === void 0 ? void 0 : column.text, data);
            var columnOptions = Object.fromEntries(Object.entries(column).filter(function (_ref3) {
              var _ref4 = _slicedToArray(_ref3, 1),
                key = _ref4[0];
              return !['type', 'color', 'font', 'size', 'text', 'x', 'y'].includes(key);
            }));
            doc.text(parsedText, xPos, (_column$y = column === null || column === void 0 ? void 0 : column.y) !== null && _column$y !== void 0 ? _column$y : _this5.top, columnOptions);
            if (column !== null && column !== void 0 && column.width) xPos += column === null || column === void 0 ? void 0 : column.width;else xPos += doc.widthOfString(parsedText, columnOptions);
          });
          this.top += doc._fontSize * 1.5;
          break;
        default:
          break;
      }
    }
  }, {
    key: "createInvoice",
    value: function () {
      var _createInvoice = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(options, order) {
        var _this6 = this;
        var doc, _options$pdf11, _options$pdf11$templa, layoutJSON, layout, itemLayout, itemLayoutRunning, docBuffer;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return this.startPdf(options);
            case 2:
              doc = _context4.sent;
              _context4.next = 5;
              return this.generateHeader(doc, options);
            case 5:
              try {
                layoutJSON = _fs["default"].readFileSync("".concat(process.cwd(), "/src/layouts/").concat(options === null || options === void 0 ? void 0 : (_options$pdf11 = options.pdf) === null || _options$pdf11 === void 0 ? void 0 : (_options$pdf11$templa = _options$pdf11.templates) === null || _options$pdf11$templa === void 0 ? void 0 : _options$pdf11$templa.invoice));
                layout = JSON.parse(layoutJSON);
                itemLayout = [];
                itemLayoutRunning = false;
                Object.values(layout).forEach(function (layoutItem) {
                  if ((layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.type) === 'itemLoop' || itemLayoutRunning === true && (layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.type) !== 'itemLoopEnd') {
                    itemLayoutRunning = true;
                    itemLayout.push(layoutItem);
                  } else if ((layoutItem === null || layoutItem === void 0 ? void 0 : layoutItem.type) === 'itemLoopEnd') {
                    itemLayoutRunning = false;
                    order.items.forEach(function (item, index) {
                      _this6.item = index;
                      itemLayout.forEach(function (layoutItem) {
                        return _this6.generateElement(doc, layoutItem, order);
                      });
                    });
                  } else _this6.generateElement(doc, layoutItem, order);
                });
              } catch (e) {
                console.log("Invoice error: ", e);
              }
              _context4.next = 8;
              return this.generateFooter(doc, options);
            case 8:
              _context4.prev = 8;
              doc.end();
              _context4.next = 12;
              return this.getStream.buffer(doc);
            case 12:
              docBuffer = _context4.sent;
              return _context4.abrupt("return", docBuffer.toString('base64'));
            case 16:
              _context4.prev = 16;
              _context4.t0 = _context4["catch"](8);
              console.log("Invoice error: ", _context4.t0);
              return _context4.abrupt("return", null);
            case 20:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this, [[8, 16]]);
      }));
      function createInvoice(_x6, _x7) {
        return _createInvoice.apply(this, arguments);
      }
      return createInvoice;
    }()
  }, {
    key: "createReturnInvoice",
    value: function () {
      var _createReturnInvoice = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(order, returnItems) {
        var doc, shipping_address, billing_address, y, _iterator, _step, item, docBuffer;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              doc = new this.PDFDocument({
                size: 'A4',
                margin: 50
              });
              shipping_address = order.shipping_address, billing_address = order.billing_address;
              doc.font('Helvetica-Bold').fontSize(25).text('Return Invoice', 50, 50);
              doc.font('Helvetica').fontSize(12).text("Return ID: ".concat(order.id), 50, 80);
              doc.font('Helvetica').fontSize(12).text("Order ID: ".concat(order.id), 50, 100);
              doc.font('Helvetica').fontSize(12).text("Return Date: ".concat(new Date().toISOString()), 50, 120);
              doc.font('Helvetica').fontSize(12).text("Billing Address: ".concat(billing_address.first_name, " ").concat(billing_address.last_name), 50, 140);
              doc.font('Helvetica').fontSize(12).text("Shipping Address: ".concat(shipping_address.first_name, " ").concat(shipping_address.last_name), 50, 160);
              doc.font('Helvetica').fontSize(12).text("Email: ".concat(order.email), 50, 180);
              doc.font('Helvetica').fontSize(12).text("Phone: ".concat(order.phone), 50, 200);
              doc.font('Helvetica').fontSize(12).text("Items:", 50, 220);
              y = 240;
              _iterator = _createForOfIteratorHelper(returnItems);
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  item = _step.value;
                  doc.font('Helvetica').fontSize(12).text("".concat(item.quantity, " x ").concat(item.title), 50, y);
                  y += 20;
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
              doc.end();
              _context5.next = 17;
              return this.getStream.buffer(doc);
            case 17:
              docBuffer = _context5.sent;
              return _context5.abrupt("return", docBuffer.toString('base64'));
            case 19:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this);
      }));
      function createReturnInvoice(_x8, _x9) {
        return _createReturnInvoice.apply(this, arguments);
      }
      return createReturnInvoice;
    }()
  }]);
  return PdfGenerator;
}();
var _default = PdfGenerator;
exports["default"] = _default;