"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _medusaCoreUtils = require("medusa-core-utils");
var _luxon = require("luxon");
var _medusaInterfaces = require("medusa-interfaces");
var _typeorm = require("typeorm");
var postmark = _interopRequireWildcard(require("postmark"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && _instanceof(outerFn.prototype, Generator) ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var PostmarkService = /*#__PURE__*/function (_NotificationService) {
  _inherits(PostmarkService, _NotificationService);
  var _super = _createSuper(PostmarkService);
  /**
   * @param {Object} options - options defined in `medusa-config.js`
   */
  function PostmarkService(_ref, options) {
    var _this;
    var manager = _ref.manager,
      orderRepository = _ref.orderRepository,
      cartRepository = _ref.cartRepository,
      lineItemRepository = _ref.lineItemRepository,
      orderService = _ref.orderService,
      cartService = _ref.cartService,
      fulfillmentService = _ref.fulfillmentService,
      totalsService = _ref.totalsService,
      giftCardService = _ref.giftCardService;
    _classCallCheck(this, PostmarkService);
    _this = _super.call(this, {
      manager: manager,
      orderRepository: orderRepository,
      cartRepository: cartRepository,
      lineItemRepository: lineItemRepository
    });
    _defineProperty(_assertThisInitialized(_this), "manager_", null);
    _defineProperty(_assertThisInitialized(_this), "orderRepository_", null);
    _defineProperty(_assertThisInitialized(_this), "cartRepository_", null);
    _defineProperty(_assertThisInitialized(_this), "lineItemRepository_", null);
    _this.options_ = options;
    _this.manager_ = manager;
    _this.orderRepository_ = orderRepository;
    _this.cartRepository_ = cartRepository;
    _this.lineItemRepository_ = lineItemRepository;
    _this.orderService_ = orderService;
    _this.cartService_ = cartService;
    _this.fulfillmentService_ = fulfillmentService;
    _this.totalsService_ = totalsService;
    _this.giftCardService_ = giftCardService;
    _this.client_ = new postmark.ServerClient(options.server_api);
    return _this;
  }
  _createClass(PostmarkService, [{
    key: "getAbandonedCarts",
    value: function () {
      var _getAbandonedCarts = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
        var _this$options_,
          _this$options_2,
          _this$options_2$aband,
          _this$options_3,
          _this$options_3$aband,
          _this$options_4,
          _options$first,
          _options$second,
          _options$third,
          _this2 = this;
        var options, now, firstCheck, secondCheck, thirdCheck, cartRepository, lineItemRepository, carts, abandonedCarts, _iterator, _step, _cart$metadata4, cart, orderCheck, cartData, _loop, _i, _abandonedCarts;
        return _regeneratorRuntime().wrap(function _callee4$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              if (!(!((_this$options_ = this.options_) !== null && _this$options_ !== void 0 && _this$options_.abandoned_cart) || !((_this$options_2 = this.options_) !== null && _this$options_2 !== void 0 && (_this$options_2$aband = _this$options_2.abandoned_cart) !== null && _this$options_2$aband !== void 0 && _this$options_2$aband.enabled) || !((_this$options_3 = this.options_) !== null && _this$options_3 !== void 0 && (_this$options_3$aband = _this$options_3.abandoned_cart) !== null && _this$options_3$aband !== void 0 && _this$options_3$aband.first))) {
                _context5.next = 2;
                break;
              }
              return _context5.abrupt("return");
            case 2:
              console.log("Getting abandoned carts");
              options = (_this$options_4 = this.options_) === null || _this$options_4 === void 0 ? void 0 : _this$options_4.abandoned_cart;
              now = new Date();
              firstCheck = new Date(now.getTime() - parseInt(options === null || options === void 0 ? void 0 : (_options$first = options.first) === null || _options$first === void 0 ? void 0 : _options$first.delay) * 60 * 60 * 1000);
              secondCheck = new Date(now.getTime() - parseInt(options === null || options === void 0 ? void 0 : (_options$second = options.second) === null || _options$second === void 0 ? void 0 : _options$second.delay) * 60 * 60 * 1000);
              thirdCheck = new Date(now.getTime() - parseInt(options === null || options === void 0 ? void 0 : (_options$third = options.third) === null || _options$third === void 0 ? void 0 : _options$third.delay) * 60 * 60 * 1000);
              cartRepository = this.manager_.withRepository(this.cartRepository_);
              lineItemRepository = this.manager_.withRepository(this.lineItemRepository_);
              _context5.next = 12;
              return cartRepository.findBy({
                email: (0, _typeorm.Not)((0, _typeorm.IsNull)())
              });
            case 12:
              carts = _context5.sent;
              console.log("Checking carts");
              abandonedCarts = [];
              _iterator = _createForOfIteratorHelper(carts);
              _context5.prev = 16;
              _iterator.s();
            case 18:
              if ((_step = _iterator.n()).done) {
                _context5.next = 38;
                break;
              }
              cart = _step.value;
              orderCheck = false;
              _context5.prev = 21;
              _context5.next = 24;
              return this.orderService_.retrieveByCartId(cart.id);
            case 24:
              orderCheck = _context5.sent;
              _context5.next = 30;
              break;
            case 27:
              _context5.prev = 27;
              _context5.t0 = _context5["catch"](21);
              orderCheck = false;
            case 30:
              _context5.next = 32;
              return this.cartService_.retrieve(cart.id, {
                relations: ["items", "shipping_address", "region"]
              });
            case 32:
              cartData = _context5.sent;
              if (!orderCheck) {
                _context5.next = 35;
                break;
              }
              return _context5.abrupt("continue", 36);
            case 35:
              if (cartData.items.find(function (li) {
                return (li === null || li === void 0 ? void 0 : li.updated_at) <= firstCheck;
              }) !== undefined && (cart === null || cart === void 0 ? void 0 : (_cart$metadata4 = cart.metadata) === null || _cart$metadata4 === void 0 ? void 0 : _cart$metadata4.third_abandonedcart_mail) !== true) abandonedCarts.push(cartData);
            case 36:
              _context5.next = 18;
              break;
            case 38:
              _context5.next = 43;
              break;
            case 40:
              _context5.prev = 40;
              _context5.t1 = _context5["catch"](16);
              _iterator.e(_context5.t1);
            case 43:
              _context5.prev = 43;
              _iterator.f();
              return _context5.finish(43);
            case 46:
              if (!(abandonedCarts.length === 0)) {
                _context5.next = 48;
                break;
              }
              return _context5.abrupt("return");
            case 48:
              _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
                var _cart$region, _cart$region2, _cart$region3;
                var cart, check, items, sendOptions, _options$third2, _cart$metadata, _options$third3, _options$second2, _cart$metadata2, _options$second3, _options$first2, _cart$metadata3, _options$first3;
                return _regeneratorRuntime().wrap(function _loop$(_context4) {
                  while (1) switch (_context4.prev = _context4.next) {
                    case 0:
                      cart = _abandonedCarts[_i];
                      check = cart.items.sort(function (a, b) {
                        return b.updated_at.getTime() - a.updated_at.getTime();
                      })[0].updated_at;
                      items = _this2.processItems_(cart.items, cart !== null && cart !== void 0 && (_cart$region = cart.region) !== null && _cart$region !== void 0 && _cart$region.includes_tax ? 0 : (cart === null || cart === void 0 ? void 0 : (_cart$region2 = cart.region) === null || _cart$region2 === void 0 ? void 0 : _cart$region2.tax_rate) / 100, cart === null || cart === void 0 ? void 0 : (_cart$region3 = cart.region) === null || _cart$region3 === void 0 ? void 0 : _cart$region3.currency_code.toUpperCase());
                      sendOptions = {
                        From: _this2.options_.from,
                        to: cart.email,
                        TemplateId: 0,
                        TemplateModel: _objectSpread(_objectSpread({}, cart), {}, {
                          items: items
                        }, _this2.options_.default_data)
                      };
                      if (!(check < secondCheck)) {
                        _context4.next = 18;
                        break;
                      }
                      if (!(check < thirdCheck)) {
                        _context4.next = 12;
                        break;
                      }
                      if (!(options !== null && options !== void 0 && (_options$third2 = options.third) !== null && _options$third2 !== void 0 && _options$third2.template && (cart === null || cart === void 0 ? void 0 : (_cart$metadata = cart.metadata) === null || _cart$metadata === void 0 ? void 0 : _cart$metadata.third_abandonedcart_mail) !== true)) {
                        _context4.next = 10;
                        break;
                      }
                      sendOptions.TemplateId = options === null || options === void 0 ? void 0 : (_options$third3 = options.third) === null || _options$third3 === void 0 ? void 0 : _options$third3.template;
                      _context4.next = 10;
                      return _this2.client_.sendEmailWithTemplate(sendOptions).then( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
                        return _regeneratorRuntime().wrap(function _callee$(_context) {
                          while (1) switch (_context.prev = _context.next) {
                            case 0:
                              _context.next = 2;
                              return cartRepository.update(cart.id, {
                                metadata: _objectSpread(_objectSpread({}, cart.metadata || {}), {}, {
                                  third_abandonedcart_mail: true
                                })
                              });
                            case 2:
                            case "end":
                              return _context.stop();
                          }
                        }, _callee);
                      })))["catch"](function (error) {
                        console.error(error);
                        return {
                          to: sendOptions.to,
                          status: 'failed',
                          data: sendOptions
                        };
                      });
                    case 10:
                      _context4.next = 16;
                      break;
                    case 12:
                      if (!(options !== null && options !== void 0 && (_options$second2 = options.second) !== null && _options$second2 !== void 0 && _options$second2.template && (cart === null || cart === void 0 ? void 0 : (_cart$metadata2 = cart.metadata) === null || _cart$metadata2 === void 0 ? void 0 : _cart$metadata2.second_abandonedcart_mail) !== true)) {
                        _context4.next = 16;
                        break;
                      }
                      sendOptions.TemplateId = options === null || options === void 0 ? void 0 : (_options$second3 = options.second) === null || _options$second3 === void 0 ? void 0 : _options$second3.template;
                      _context4.next = 16;
                      return _this2.client_.sendEmailWithTemplate(sendOptions).then( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
                        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                          while (1) switch (_context2.prev = _context2.next) {
                            case 0:
                              _context2.next = 2;
                              return cartRepository.update(cart.id, {
                                metadata: _objectSpread(_objectSpread({}, cart.metadata || {}), {}, {
                                  second_abandonedcart_mail: true
                                })
                              });
                            case 2:
                            case "end":
                              return _context2.stop();
                          }
                        }, _callee2);
                      })))["catch"](function (error) {
                        console.error(error);
                        return {
                          to: sendOptions.to,
                          status: 'failed',
                          data: sendOptions
                        };
                      });
                    case 16:
                      _context4.next = 22;
                      break;
                    case 18:
                      if (!(options !== null && options !== void 0 && (_options$first2 = options.first) !== null && _options$first2 !== void 0 && _options$first2.template && (cart === null || cart === void 0 ? void 0 : (_cart$metadata3 = cart.metadata) === null || _cart$metadata3 === void 0 ? void 0 : _cart$metadata3.first_abandonedcart_mail) !== true)) {
                        _context4.next = 22;
                        break;
                      }
                      sendOptions.TemplateId = options === null || options === void 0 ? void 0 : (_options$first3 = options.first) === null || _options$first3 === void 0 ? void 0 : _options$first3.template;
                      _context4.next = 22;
                      return _this2.client_.sendEmailWithTemplate(sendOptions).then( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
                        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                          while (1) switch (_context3.prev = _context3.next) {
                            case 0:
                              _context3.next = 2;
                              return cartRepository.update(cart.id, {
                                metadata: _objectSpread(_objectSpread({}, cart.metadata || {}), {}, {
                                  first_abandonedcart_mail: true
                                })
                              });
                            case 2:
                            case "end":
                              return _context3.stop();
                          }
                        }, _callee3);
                      })))["catch"](function (error) {
                        console.error(error);
                        return {
                          to: sendOptions.to,
                          status: 'failed',
                          data: sendOptions
                        };
                      });
                    case 22:
                    case "end":
                      return _context4.stop();
                  }
                }, _loop);
              });
              _i = 0, _abandonedCarts = abandonedCarts;
            case 50:
              if (!(_i < _abandonedCarts.length)) {
                _context5.next = 55;
                break;
              }
              return _context5.delegateYield(_loop(), "t2", 52);
            case 52:
              _i++;
              _context5.next = 50;
              break;
            case 55:
            case "end":
              return _context5.stop();
          }
        }, _callee4, this, [[16, 40, 43, 46], [21, 27]]);
      }));
      function getAbandonedCarts() {
        return _getAbandonedCarts.apply(this, arguments);
      }
      return getAbandonedCarts;
    }()
  }, {
    key: "remindUpsellOrders",
    value: function () {
      var _remindUpsellOrders = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
        var _this$options_5,
          _this$options_6,
          _this$options_6$upsel,
          _this$options_7,
          _this$options_7$upsel,
          _this$options_8,
          _this$options_8$upsel,
          _this$options_9,
          _this$options_9$upsel,
          _this3 = this;
        var orderRepo, options, validThrough, orders, _iterator2, _step2, _loop2, _ret;
        return _regeneratorRuntime().wrap(function _callee6$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              if (!(!((_this$options_5 = this.options_) !== null && _this$options_5 !== void 0 && _this$options_5.upsell) || !((_this$options_6 = this.options_) !== null && _this$options_6 !== void 0 && (_this$options_6$upsel = _this$options_6.upsell) !== null && _this$options_6$upsel !== void 0 && _this$options_6$upsel.enabled) || !((_this$options_7 = this.options_) !== null && _this$options_7 !== void 0 && (_this$options_7$upsel = _this$options_7.upsell) !== null && _this$options_7$upsel !== void 0 && _this$options_7$upsel.collection) || !((_this$options_8 = this.options_) !== null && _this$options_8 !== void 0 && (_this$options_8$upsel = _this$options_8.upsell) !== null && _this$options_8$upsel !== void 0 && _this$options_8$upsel.delay) || !((_this$options_9 = this.options_) !== null && _this$options_9 !== void 0 && (_this$options_9$upsel = _this$options_9.upsell) !== null && _this$options_9$upsel !== void 0 && _this$options_9$upsel.template))) {
                _context8.next = 2;
                break;
              }
              return _context8.abrupt("return", []);
            case 2:
              orderRepo = this.manager_.withRepository(this.orderRepository_);
              options = this.options_.upsell;
              validThrough = _luxon.DateTime.now().minus({
                days: options.valid
              }).toLocaleString(_luxon.DateTime.DATE_FULL);
              _context8.next = 7;
              return orderRepo.findBy({
                created_at: (0, _typeorm.LessThan)(new Date(new Date().getTime() - parseInt(options.delay) * 60 * 60 * 24 * 1000))
              });
            case 7:
              orders = _context8.sent;
              _iterator2 = _createForOfIteratorHelper(orders);
              _context8.prev = 9;
              _loop2 = /*#__PURE__*/_regeneratorRuntime().mark(function _loop2() {
                var _order$metadata;
                var order, orderData, upsell, _iterator3, _step3, _item$variant, _item$variant$product, item, sendOptions;
                return _regeneratorRuntime().wrap(function _loop2$(_context7) {
                  while (1) switch (_context7.prev = _context7.next) {
                    case 0:
                      order = _step2.value;
                      if (!((_order$metadata = order.metadata) !== null && _order$metadata !== void 0 && _order$metadata.upsell_sent || order.created_at < new Date(new Date().getTime() - parseInt(options.delay) * 60 * 60 * 24 * 1000))) {
                        _context7.next = 3;
                        break;
                      }
                      return _context7.abrupt("return", "continue");
                    case 3:
                      _context7.next = 5;
                      return _this3.orderService_.retrieve(order.id, {
                        select: ["id"],
                        relations: ["customer", "items", "items.variant", "items.variant.product"]
                      });
                    case 5:
                      orderData = _context7.sent;
                      upsell = true;
                      _iterator3 = _createForOfIteratorHelper(orderData.items);
                      try {
                        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                          item = _step3.value;
                          if ((item === null || item === void 0 ? void 0 : (_item$variant = item.variant) === null || _item$variant === void 0 ? void 0 : (_item$variant$product = _item$variant.product) === null || _item$variant$product === void 0 ? void 0 : _item$variant$product.collection_id) !== options.collection) upsell = false;
                        }
                      } catch (err) {
                        _iterator3.e(err);
                      } finally {
                        _iterator3.f();
                      }
                      if (!upsell) {
                        _context7.next = 15;
                        break;
                      }
                      if (options.template.includes(",")) {
                        // VERY simple setup for A/B testing
                        options.template = options.template.split(",");
                        options.template = options.template[Math.floor(Math.random() * options.template.length)];
                      }
                      sendOptions = {
                        From: _this3.options_.from,
                        to: orderData.customer.email,
                        TemplateId: options.template,
                        TemplateModel: _objectSpread(_objectSpread(_objectSpread({}, orderData), _this3.options_.default_data), {}, {
                          valid_through: validThrough
                        })
                      }; //update order metadata
                      order.metadata = _objectSpread(_objectSpread({}, order.metadata), {}, {
                        upsell_sent: true
                      });
                      //console.log("Sending upsell email to " + orderData.customer.email + " for order " + orderData.id)
                      _context7.next = 15;
                      return _this3.client_.sendEmailWithTemplate(sendOptions).then( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
                        return _regeneratorRuntime().wrap(function _callee5$(_context6) {
                          while (1) switch (_context6.prev = _context6.next) {
                            case 0:
                              _context6.next = 2;
                              return _this3.orderService_.update(order.id, {
                                metadata: order.metadata
                              });
                            case 2:
                            case "end":
                              return _context6.stop();
                          }
                        }, _callee5);
                      })))["catch"](function (error) {
                        console.error(error);
                        return {
                          to: sendOptions.to,
                          status: 'failed',
                          data: sendOptions
                        };
                      });
                    case 15:
                    case "end":
                      return _context7.stop();
                  }
                }, _loop2);
              });
              _iterator2.s();
            case 12:
              if ((_step2 = _iterator2.n()).done) {
                _context8.next = 19;
                break;
              }
              return _context8.delegateYield(_loop2(), "t0", 14);
            case 14:
              _ret = _context8.t0;
              if (!(_ret === "continue")) {
                _context8.next = 17;
                break;
              }
              return _context8.abrupt("continue", 17);
            case 17:
              _context8.next = 12;
              break;
            case 19:
              _context8.next = 24;
              break;
            case 21:
              _context8.prev = 21;
              _context8.t1 = _context8["catch"](9);
              _iterator2.e(_context8.t1);
            case 24:
              _context8.prev = 24;
              _iterator2.f();
              return _context8.finish(24);
            case 27:
            case "end":
              return _context8.stop();
          }
        }, _callee6, this, [[9, 21, 24, 27]]);
      }));
      function remindUpsellOrders() {
        return _remindUpsellOrders.apply(this, arguments);
      }
      return remindUpsellOrders;
    }()
  }, {
    key: "fetchAttachments",
    value: function () {
      var _fetchAttachments = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(event, data, attachmentGenerator) {
        var attachments, base64, _data$return_request, shipping_method, shipping_data, provider, lbl, _base, _this$options_$pdf$en, _this$options_10, _this$options_10$pdf, _base2;
        return _regeneratorRuntime().wrap(function _callee7$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              attachments = [];
              _context9.t0 = event;
              _context9.next = _context9.t0 === "user.password_reset" ? 4 : _context9.t0 === "swap.created" ? 16 : _context9.t0 === "order.return_requested" ? 16 : _context9.t0 === "order.placed" ? 41 : 54;
              break;
            case 4:
              _context9.prev = 4;
              if (!(attachmentGenerator && attachmentGenerator.createPasswordReset)) {
                _context9.next = 10;
                break;
              }
              _context9.next = 8;
              return attachmentGenerator.createPasswordReset();
            case 8:
              base64 = _context9.sent;
              attachments.push({
                name: "password-reset.pdf",
                base64: base64,
                type: "application/pdf"
              });
            case 10:
              _context9.next = 15;
              break;
            case 12:
              _context9.prev = 12;
              _context9.t1 = _context9["catch"](4);
              console.error(_context9.t1);
            case 15:
              return _context9.abrupt("return", attachments);
            case 16:
              _context9.prev = 16;
              _data$return_request = data.return_request, shipping_method = _data$return_request.shipping_method, shipping_data = _data$return_request.shipping_data;
              if (!shipping_method) {
                _context9.next = 24;
                break;
              }
              provider = shipping_method.shipping_option.provider_id;
              _context9.next = 22;
              return this.fulfillmentProviderService_.retrieveDocuments(provider, shipping_data, "label");
            case 22:
              lbl = _context9.sent;
              attachments = attachments.concat(lbl.map(function (d) {
                return {
                  name: "return-label.pdf",
                  base64: d.base_64,
                  type: d.type
                };
              }));
            case 24:
              _context9.next = 29;
              break;
            case 26:
              _context9.prev = 26;
              _context9.t2 = _context9["catch"](16);
              console.error(_context9.t2);
            case 29:
              _context9.prev = 29;
              if (!(attachmentGenerator && attachmentGenerator.createReturnInvoice)) {
                _context9.next = 35;
                break;
              }
              _context9.next = 33;
              return attachmentGenerator.createReturnInvoice(data.order, data.return_request.items);
            case 33:
              _base = _context9.sent;
              attachments.push({
                name: "invoice.pdf",
                base64: _base,
                type: "application/pdf"
              });
            case 35:
              _context9.next = 40;
              break;
            case 37:
              _context9.prev = 37;
              _context9.t3 = _context9["catch"](29);
              console.error(_context9.t3);
            case 40:
              return _context9.abrupt("return", attachments);
            case 41:
              _context9.prev = 41;
              if (!(((_this$options_$pdf$en = (_this$options_10 = this.options_) === null || _this$options_10 === void 0 ? void 0 : (_this$options_10$pdf = _this$options_10.pdf) === null || _this$options_10$pdf === void 0 ? void 0 : _this$options_10$pdf.enabled) !== null && _this$options_$pdf$en !== void 0 ? _this$options_$pdf$en : false) && attachmentGenerator && attachmentGenerator.createInvoice)) {
                _context9.next = 47;
                break;
              }
              _context9.next = 45;
              return attachmentGenerator.createInvoice(this.options_, data);
            case 45:
              _base2 = _context9.sent;
              attachments.push({
                name: "invoice.pdf",
                base64: _base2,
                type: "application/pdf"
              });
            case 47:
              _context9.next = 53;
              break;
            case 49:
              _context9.prev = 49;
              _context9.t4 = _context9["catch"](41);
              console.log('error ?', _context9.t4);
              console.error(_context9.t4);
            case 53:
              return _context9.abrupt("return", attachments);
            case 54:
              return _context9.abrupt("return", []);
            case 55:
            case "end":
              return _context9.stop();
          }
        }, _callee7, this, [[4, 12], [16, 26], [29, 37], [41, 49]]);
      }));
      function fetchAttachments(_x, _x2, _x3) {
        return _fetchAttachments.apply(this, arguments);
      }
      return fetchAttachments;
    }()
  }, {
    key: "fetchData",
    value: function () {
      var _fetchData = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(event, eventData, attachmentGenerator) {
        return _regeneratorRuntime().wrap(function _callee8$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              _context10.t0 = event;
              _context10.next = _context10.t0 === "order.placed" ? 3 : _context10.t0 === "order.shipment_created" ? 4 : _context10.t0 === "order.canceled" ? 5 : _context10.t0 === "user.password_reset" ? 6 : _context10.t0 === "customer.password_reset" ? 7 : _context10.t0 === "gift_card.created" ? 8 : 9;
              break;
            case 3:
              return _context10.abrupt("return", this.orderPlacedData(eventData, attachmentGenerator));
            case 4:
              return _context10.abrupt("return", this.orderShipmentCreatedData(eventData, attachmentGenerator));
            case 5:
              return _context10.abrupt("return", this.orderCanceledData(eventData, attachmentGenerator));
            case 6:
              return _context10.abrupt("return", this.userPasswordResetData(eventData, attachmentGenerator));
            case 7:
              return _context10.abrupt("return", this.customerPasswordResetData(eventData, attachmentGenerator));
            case 8:
              return _context10.abrupt("return", this.giftCardData(eventData, attachmentGenerator));
            case 9:
              return _context10.abrupt("return", eventData);
            case 10:
            case "end":
              return _context10.stop();
          }
        }, _callee8, this);
      }));
      function fetchData(_x4, _x5, _x6) {
        return _fetchData.apply(this, arguments);
      }
      return fetchData;
    }()
  }, {
    key: "sendNotification",
    value: function () {
      var _sendNotification = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(event, eventData, attachmentGenerator) {
        var _data$email, _data$customer, _this$options_11;
        var group, action, event_, templateId, data, attachments, sendOptions;
        return _regeneratorRuntime().wrap(function _callee9$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              group = undefined;
              action = undefined;
              _context11.prev = 2;
              event_ = event.split(".", 2);
              group = event_[0];
              action = event_[1];
              if (!(typeof group === "undefined" || typeof action === "undefined" || this.options_.events[group] === undefined || this.options_.events[group][action] === undefined)) {
                _context11.next = 8;
                break;
              }
              return _context11.abrupt("return", false);
            case 8:
              _context11.next = 14;
              break;
            case 10:
              _context11.prev = 10;
              _context11.t0 = _context11["catch"](2);
              console.error(_context11.t0);
              return _context11.abrupt("return", false);
            case 14:
              templateId = this.options_.events[group][action];
              _context11.next = 17;
              return this.fetchData(event, eventData, attachmentGenerator);
            case 17:
              data = _context11.sent;
              _context11.next = 20;
              return this.fetchAttachments(event, data, attachmentGenerator);
            case 20:
              attachments = _context11.sent;
              if (data.locale && _typeof(templateId) === "object") templateId = templateId[data.locale] || Object.values(templateId)[0]; // Fallback to first template if locale is not found
              if (!(templateId === null)) {
                _context11.next = 24;
                break;
              }
              return _context11.abrupt("return", false);
            case 24:
              sendOptions = {
                From: this.options_.from,
                to: (_data$email = data.email) !== null && _data$email !== void 0 ? _data$email : data === null || data === void 0 ? void 0 : (_data$customer = data.customer) === null || _data$customer === void 0 ? void 0 : _data$customer.email,
                TemplateId: templateId,
                TemplateModel: _objectSpread(_objectSpread({}, data), this.options_.default_data)
              };
              if ((_this$options_11 = this.options_) !== null && _this$options_11 !== void 0 && _this$options_11.bcc) sendOptions.Bcc = this.options_.bcc;
              if (attachments !== null && attachments !== void 0 && attachments.length) {
                sendOptions.Attachments = attachments.map(function (a) {
                  return {
                    content: a.base64,
                    Name: a.name,
                    ContentType: a.type,
                    ContentID: "cid:".concat(a.name)
                  };
                });
              }
              _context11.next = 29;
              return this.client_.sendEmailWithTemplate(sendOptions).then(function () {
                return {
                  to: sendOptions.to,
                  status: 'sent',
                  data: sendOptions
                };
              })["catch"](function (error) {
                console.error(error);
                return {
                  to: sendOptions.to,
                  status: 'failed',
                  data: sendOptions
                };
              });
            case 29:
              return _context11.abrupt("return", _context11.sent);
            case 30:
            case "end":
              return _context11.stop();
          }
        }, _callee9, this, [[2, 10]]);
      }));
      function sendNotification(_x7, _x8, _x9) {
        return _sendNotification.apply(this, arguments);
      }
      return sendNotification;
    }()
  }, {
    key: "resendNotification",
    value: function () {
      var _resendNotification = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(notification, config, attachmentGenerator) {
        var sendOptions, attachs;
        return _regeneratorRuntime().wrap(function _callee10$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              sendOptions = _objectSpread(_objectSpread({}, notification.data), {}, {
                To: config.to || notification.to
              });
              _context12.next = 3;
              return this.fetchAttachments(notification.event_name, notification.data.dynamic_template_data, attachmentGenerator);
            case 3:
              attachs = _context12.sent;
              sendOptions.attachments = attachs.map(function (a) {
                return {
                  content: a.base64,
                  filename: a.name,
                  type: a.type,
                  disposition: "attachment",
                  contentId: a.name
                };
              });
              _context12.next = 7;
              return this.client_.sendEmailWithTemplate(sendOptions).then(function () {
                return {
                  to: sendOptions.To,
                  status: 'sent',
                  data: sendOptions
                };
              })["catch"](function (error) {
                console.error(error);
                return {
                  to: sendOptions.To,
                  status: 'failed',
                  data: sendOptions
                };
              });
            case 7:
              return _context12.abrupt("return", _context12.sent);
            case 8:
            case "end":
              return _context12.stop();
          }
        }, _callee10, this);
      }));
      function resendNotification(_x10, _x11, _x12) {
        return _resendNotification.apply(this, arguments);
      }
      return resendNotification;
    }()
  }, {
    key: "sendMail",
    value: function () {
      var _sendMail = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(options) {
        return _regeneratorRuntime().wrap(function _callee11$(_context13) {
          while (1) switch (_context13.prev = _context13.next) {
            case 0:
              _context13.prev = 0;
              this.client_.sendEmailWithTemplate(_objectSpread(_objectSpread({}, options), {}, {
                TemplateModel: _objectSpread(_objectSpread({}, options.TemplateModel), this.options_.default_data)
              }));
              _context13.next = 8;
              break;
            case 4:
              _context13.prev = 4;
              _context13.t0 = _context13["catch"](0);
              console.log(_context13.t0);
              throw _context13.t0;
            case 8:
            case "end":
              return _context13.stop();
          }
        }, _callee11, this, [[0, 4]]);
      }));
      function sendMail(_x13) {
        return _sendMail.apply(this, arguments);
      }
      return sendMail;
    }()
  }, {
    key: "orderShipmentCreatedData",
    value: function () {
      var _orderShipmentCreatedData = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(_ref6, attachmentGenerator) {
        var id, fulfillment_id, order, shipment, locale;
        return _regeneratorRuntime().wrap(function _callee12$(_context14) {
          while (1) switch (_context14.prev = _context14.next) {
            case 0:
              id = _ref6.id, fulfillment_id = _ref6.fulfillment_id;
              _context14.next = 3;
              return this.orderService_.retrieve(id, {
                select: ["shipping_total", "discount_total", "tax_total", "refunded_total", "gift_card_total", "subtotal", "total", "refundable_amount"],
                relations: ["customer", "billing_address", "shipping_address", "discounts", "discounts.rule", "shipping_methods", "shipping_methods.shipping_option", "payments", "fulfillments", "returns", "gift_cards", "gift_card_transactions"]
              });
            case 3:
              order = _context14.sent;
              _context14.next = 6;
              return this.fulfillmentService_.retrieve(fulfillment_id, {
                relations: ["items", "tracking_links"]
              });
            case 6:
              shipment = _context14.sent;
              _context14.next = 9;
              return this.extractLocale(order);
            case 9:
              locale = _context14.sent;
              return _context14.abrupt("return", {
                locale: locale,
                order: order,
                date: shipment.shipped_at.toDateString(),
                email: order.email,
                fulfillment: shipment,
                tracking_links: shipment.tracking_links,
                tracking_number: shipment.tracking_numbers.join(", ")
              });
            case 11:
            case "end":
              return _context14.stop();
          }
        }, _callee12, this);
      }));
      function orderShipmentCreatedData(_x14, _x15) {
        return _orderShipmentCreatedData.apply(this, arguments);
      }
      return orderShipmentCreatedData;
    }()
  }, {
    key: "orderCanceledData",
    value: function () {
      var _orderCanceledData = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(_ref7) {
        var id, order, subtotal, tax_total, discount_total, shipping_total, gift_card_total, total, taxRate, currencyCode, items, discounts, giftCards, locale;
        return _regeneratorRuntime().wrap(function _callee13$(_context15) {
          while (1) switch (_context15.prev = _context15.next) {
            case 0:
              id = _ref7.id;
              _context15.next = 3;
              return this.orderService_.retrieve(id, {
                select: ["shipping_total", "discount_total", "tax_total", "refunded_total", "gift_card_total", "subtotal", "total"],
                relations: ["customer", "billing_address", "shipping_address", "discounts", "discounts.rule", "shipping_methods", "shipping_methods.shipping_option", "payments", "fulfillments", "returns", "gift_cards", "gift_card_transactions"]
              });
            case 3:
              order = _context15.sent;
              subtotal = order.subtotal, tax_total = order.tax_total, discount_total = order.discount_total, shipping_total = order.shipping_total, gift_card_total = order.gift_card_total, total = order.total;
              taxRate = order.tax_rate / 100;
              currencyCode = order.currency_code.toUpperCase();
              items = this.processItems_(order.items, taxRate, currencyCode);
              discounts = [];
              if (order.discounts) {
                discounts = order.discounts.map(function (discount) {
                  return {
                    is_giftcard: false,
                    code: discount.code,
                    descriptor: "".concat(discount.rule.value).concat(discount.rule.type === "percentage" ? "%" : " ".concat(currencyCode))
                  };
                });
              }
              giftCards = [];
              if (order.gift_cards) {
                giftCards = order.gift_cards.map(function (gc) {
                  return {
                    is_giftcard: true,
                    code: gc.code,
                    descriptor: "".concat(gc.value, " ").concat(currencyCode)
                  };
                });
                discounts.concat(giftCards);
              }
              _context15.next = 14;
              return this.extractLocale(order);
            case 14:
              locale = _context15.sent;
              return _context15.abrupt("return", _objectSpread(_objectSpread({}, order), {}, {
                locale: locale,
                has_discounts: order.discounts.length,
                has_gift_cards: order.gift_cards.length,
                date: order.created_at.toDateString(),
                items: items,
                discounts: discounts,
                subtotal: "".concat(this.humanPrice_(subtotal * (1 + taxRate), currencyCode), " ").concat(currencyCode),
                gift_card_total: "".concat(this.humanPrice_(gift_card_total * (1 + taxRate), currencyCode), " ").concat(currencyCode),
                tax_total: "".concat(this.humanPrice_(tax_total, currencyCode), " ").concat(currencyCode),
                discount_total: "".concat(this.humanPrice_(discount_total * (1 + taxRate), currencyCode), " ").concat(currencyCode),
                shipping_total: "".concat(this.humanPrice_(shipping_total * (1 + taxRate), currencyCode), " ").concat(currencyCode),
                total: "".concat(this.humanPrice_(total, currencyCode), " ").concat(currencyCode)
              }));
            case 16:
            case "end":
              return _context15.stop();
          }
        }, _callee13, this);
      }));
      function orderCanceledData(_x16) {
        return _orderCanceledData.apply(this, arguments);
      }
      return orderCanceledData;
    }()
  }, {
    key: "giftCardData",
    value: function () {
      var _giftCardData = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14(_ref8) {
        var _data$order$email;
        var id, data;
        return _regeneratorRuntime().wrap(function _callee14$(_context16) {
          while (1) switch (_context16.prev = _context16.next) {
            case 0:
              id = _ref8.id;
              _context16.next = 3;
              return this.giftCardService.retrieve(id, {
                relations: ["order"]
              });
            case 3:
              data = _context16.sent;
              return _context16.abrupt("return", _objectSpread(_objectSpread({}, data), {}, {
                email: (_data$order$email = data.order.email) !== null && _data$order$email !== void 0 ? _data$order$email : ''
              }));
            case 5:
            case "end":
              return _context16.stop();
          }
        }, _callee14, this);
      }));
      function giftCardData(_x17) {
        return _giftCardData.apply(this, arguments);
      }
      return giftCardData;
    }()
  }, {
    key: "orderPlacedData",
    value: function () {
      var _orderPlacedData = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee16(_ref9) {
        var _this4 = this,
          _order$shipping_metho;
        var id, order, tax_total, shipping_total, gift_card_total, total, currencyCode, items, discounts, giftCards, locale, discountTotal, discounted_subtotal, subtotal, subtotal_ex_tax;
        return _regeneratorRuntime().wrap(function _callee16$(_context18) {
          while (1) switch (_context18.prev = _context18.next) {
            case 0:
              id = _ref9.id;
              _context18.next = 3;
              return this.orderService_.retrieve(id, {
                select: ["shipping_total", "discount_total", "tax_total", "refunded_total", "gift_card_total", "subtotal", "total"],
                relations: ["customer", "billing_address", "shipping_address", "discounts", "discounts.rule", "shipping_methods", "shipping_methods.shipping_option", "payments", "fulfillments", "returns", "gift_cards", "gift_card_transactions"]
              });
            case 3:
              order = _context18.sent;
              tax_total = order.tax_total, shipping_total = order.shipping_total, gift_card_total = order.gift_card_total, total = order.total;
              currencyCode = order.currency_code.toUpperCase();
              _context18.next = 8;
              return Promise.all(order.items.map( /*#__PURE__*/function () {
                var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee15(i) {
                  return _regeneratorRuntime().wrap(function _callee15$(_context17) {
                    while (1) switch (_context17.prev = _context17.next) {
                      case 0:
                        _context17.next = 2;
                        return _this4.totalsService_.getLineItemTotals(i, order, {
                          include_tax: true,
                          use_tax_lines: true
                        });
                      case 2:
                        i.totals = _context17.sent;
                        i.thumbnail = _this4.normalizeThumbUrl_(i.thumbnail);
                        i.discounted_price = "".concat(_this4.humanPrice_(i.totals.total / i.quantity, currencyCode), " ").concat(currencyCode);
                        i.price = "".concat(_this4.humanPrice_(i.totals.original_total / i.quantity, currencyCode), " ").concat(currencyCode);
                        return _context17.abrupt("return", i);
                      case 7:
                      case "end":
                        return _context17.stop();
                    }
                  }, _callee15);
                }));
                return function (_x19) {
                  return _ref10.apply(this, arguments);
                };
              }()));
            case 8:
              items = _context18.sent;
              discounts = [];
              if (order.discounts) {
                discounts = order.discounts.map(function (discount) {
                  return {
                    is_giftcard: false,
                    code: discount.code,
                    descriptor: "".concat(discount.rule.value).concat(discount.rule.type === "percentage" ? "%" : " ".concat(currencyCode))
                  };
                });
              }
              giftCards = [];
              if (order.gift_cards) {
                giftCards = order.gift_cards.map(function (gc) {
                  return {
                    is_giftcard: true,
                    code: gc.code,
                    descriptor: "".concat(gc.value, " ").concat(currencyCode)
                  };
                });
                discounts.concat(giftCards);
              }
              _context18.next = 15;
              return this.extractLocale(order);
            case 15:
              locale = _context18.sent;
              // Includes taxes in discount amount
              discountTotal = items.reduce(function (acc, i) {
                return acc + i.totals.original_total - i.totals.total;
              }, 0);
              discounted_subtotal = items.reduce(function (acc, i) {
                return acc + i.totals.total;
              }, 0);
              subtotal = items.reduce(function (acc, i) {
                return acc + i.totals.original_total;
              }, 0);
              subtotal_ex_tax = items.reduce(function (total, i) {
                return total + i.totals.subtotal;
              }, 0);
              return _context18.abrupt("return", _objectSpread(_objectSpread({}, order), {}, {
                locale: locale,
                has_discounts: order.discounts.length,
                has_gift_cards: order.gift_cards.length,
                date: order.created_at.toDateString(),
                items: items,
                discounts: discounts,
                subtotal_ex_tax: "".concat(this.humanPrice_(subtotal_ex_tax, currencyCode), " ").concat(currencyCode),
                subtotal: "".concat(this.humanPrice_(subtotal, currencyCode), " ").concat(currencyCode),
                gift_card_total: "".concat(this.humanPrice_(gift_card_total, currencyCode), " ").concat(currencyCode),
                tax_total: "".concat(this.humanPrice_(tax_total, currencyCode), " ").concat(currencyCode),
                discount_total: "".concat(this.humanPrice_(discountTotal, currencyCode), " ").concat(currencyCode),
                shipping_total: "".concat(this.humanPrice_(shipping_total, currencyCode), " ").concat(currencyCode),
                shipping_total_inc: "".concat(this.humanPrice_((order === null || order === void 0 ? void 0 : (_order$shipping_metho = order.shipping_methods[0]) === null || _order$shipping_metho === void 0 ? void 0 : _order$shipping_metho.price) || shipping_total, currencyCode), " ").concat(currencyCode),
                total: "".concat(this.humanPrice_(total, currencyCode), " ").concat(currencyCode)
              }));
            case 21:
            case "end":
              return _context18.stop();
          }
        }, _callee16, this);
      }));
      function orderPlacedData(_x18) {
        return _orderPlacedData.apply(this, arguments);
      }
      return orderPlacedData;
    }()
  }, {
    key: "userPasswordResetData",
    value: function userPasswordResetData(data) {
      return data;
    }
  }, {
    key: "customerPasswordResetData",
    value: function customerPasswordResetData(data) {
      return data;
    }
  }, {
    key: "processItems_",
    value: function processItems_(items, taxRate, currencyCode) {
      var _this5 = this;
      return items.map(function (i) {
        return _objectSpread(_objectSpread({}, i), {}, {
          thumbnail: _this5.normalizeThumbUrl_(i.thumbnail),
          price: "".concat(currencyCode, " ").concat(_this5.humanPrice_(i.unit_price * (1 + taxRate), currencyCode))
        });
      });
    }
  }, {
    key: "humanPrice_",
    value: function humanPrice_(amount, currency) {
      if (!amount) return "0.00";
      var normalized = (0, _medusaCoreUtils.humanizeAmount)(amount, currency);
      return normalized.toFixed(_medusaCoreUtils.zeroDecimalCurrencies.includes(currency.toLowerCase()) ? 0 : 2);
    }
  }, {
    key: "normalizeThumbUrl_",
    value: function normalizeThumbUrl_(url) {
      if (!url) return null;else if (url.startsWith("http")) return url;else if (url.startsWith("//")) return "https:".concat(url);
      return url;
    }
  }, {
    key: "extractLocale",
    value: function () {
      var _extractLocale = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee17(fromOrder) {
        var cart;
        return _regeneratorRuntime().wrap(function _callee17$(_context19) {
          while (1) switch (_context19.prev = _context19.next) {
            case 0:
              if (!fromOrder.cart_id) {
                _context19.next = 14;
                break;
              }
              _context19.prev = 1;
              _context19.next = 4;
              return this.cartService_.retrieve(fromOrder.cart_id, {
                select: ["id", "context"]
              });
            case 4:
              cart = _context19.sent;
              if (!(cart.context && cart.context.locale)) {
                _context19.next = 7;
                break;
              }
              return _context19.abrupt("return", cart.context.locale);
            case 7:
              _context19.next = 14;
              break;
            case 9:
              _context19.prev = 9;
              _context19.t0 = _context19["catch"](1);
              console.log(_context19.t0);
              console.warn("Failed to gather context for order");
              return _context19.abrupt("return", null);
            case 14:
              return _context19.abrupt("return", null);
            case 15:
            case "end":
              return _context19.stop();
          }
        }, _callee17, this, [[1, 9]]);
      }));
      function extractLocale(_x20) {
        return _extractLocale.apply(this, arguments);
      }
      return extractLocale;
    }()
  }]);
  return PostmarkService;
}(_medusaInterfaces.NotificationService);
_defineProperty(PostmarkService, "identifier", "postmark");
var _default = PostmarkService;
exports["default"] = _default;