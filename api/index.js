"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _routes = _interopRequireDefault(require("./routes"));
var _medusaCoreUtils = require("medusa-core-utils");
var _pdfGenerator = _interopRequireDefault(require("../generators/pdfGenerator"));
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && _instanceof(outerFn.prototype, Generator) ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var _default = function _default(container) {
  var app = (0, _express.Router)();
  app.get("/hello", function (req, res) {
    res.json({
      message: "Welcome to My Store!"
    });
  });
  app.get("/export", /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
      var pdfGen, orderService, orderIds, totalsService, options, _i, _orderIds, orderId, data, _options$pdf$enabled, _options$pdf, base64, dir, filename;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            pdfGen = new _pdfGenerator["default"]();
            orderService = req.scope.resolve("orderService");
            orderIds = ['order_01HBBZVQP85VNG96J683B5K88C', 'order_01HBEJGAG2MG3F86ZEG4VFJXN7', 'order_01HD0W7BAK9H2KG1NE4MWF2WE9', 'order_01HBGKGB53GT92913E81QDVQS5', 'order_01HBP8DT5R6RK3VBFGK710EQ0V', 'order_01HBP99PP63CHJN9P2KH5GZSAP', 'order_01HBTP2GJVBAJ9CXGEEKMZW3VA', 'order_01HBVH1WYSG9T7R7ZA99TZVE6Y', 'order_01HCAZ40NNT6R66R9RC64PKEFC', 'order_01HCH78FBCQG9GYQWXJBPVMX3J', 'order_01HD6WCPQ18BDWAF7XEV0XWR8E', 'order_01HCMV7YE2V6SZQ9J7VAA8PV85', 'order_01HDC11S8MPPK8BJ238TN8WFT9', 'order_01HDPACBK1Y89Q0ZY6XSEQAXHW', 'order_01HDV1S5SDNY31THZGNDTVHCAY', 'order_01HE0X59MMQQDTBAP1TFVW0Q03', 'order_01HE30PAP9DEHPA2GWK8E5QZGD', 'order_01HE8PNWNXMKMD1XP6AYNEPZXT', 'order_01HED71202RGBC7TBFD8Z22M16', 'order_01HEDX6F46C0FGXCBWGSAYGGWF', 'order_01HF9QWVSS478R9QX6S4B5CP44', 'order_01HEE6Z79AXNMZ0J6XFQS5Y3FE', 'order_01HFCABG830N64JDFK279QJF1G', 'order_01HFEVJTX34PZ331D97DP31RVH', 'order_01HFQA4KCCW4GD8V1KSHHMC3JP', 'order_01HG5N3320NA7CZZ6QWBG2QWGZ', 'order_01HGB4YGH07TGXQP9K3Y01CBEY', 'order_01HGBABS2BT6NVVJBDT06E3NKE', 'order_01HGGNV3X9CXH7957AZAXSBQJX', 'order_01HHD97J3JZBD007SM9ZD0Y7JM', 'order_01HGJMMW3P5RT4EAR92NP4DP5V', 'order_01HGWHMG7F512Z5ATJT26J316B', 'order_01HH0J0V82A2TD0MB507KQ5XXJ', 'order_01HHD36KQ6P4XWXK0H6TYZXRR1', 'order_01HHHGSDCB7RDH2T4N7G4GMYE0', 'order_01HHWPKFTV2ZA2MEWGS60GFZ6Y', 'order_01HJK113GHJ4XM0VXQ1JG32SZ9', 'order_01HK34278GAD734XC01KV6497Q', 'order_01HJQTP3GMW8T65EKM3ZH2MJJ3', 'order_01HKJ1CGVJH6729N6YFQY9QH8T', 'order_01HKHZBNNFRDQ5R39SHCYT1RAD', 'order_01HMKFED9TCHBK7KP6C3NVZ8GD', 'order_01HMNDFB41876NP25ZF4G62FSM']; //req.params.id;
            totalsService = req.scope.resolve("totalsService");
            options = {
              pdf: {
                enabled: true,
                settings: {
                  font: process.env.POSTMARK_PDF_FONT || 'Helvetica',
                  format: process.env.POSTMARK_PDF_FORMAT || 'A4',
                  margin: {
                    top: process.env.POSTMARK_PDF_MARGIN_TOP || 50,
                    right: process.env.POSTMARK_PDF_MARGIN_RIGHT || 50,
                    bottom: process.env.POSTMARK_PDF_MARGIN_BOTTOM || 50,
                    left: process.env.POSTMARK_PDF_MARGIN_LEFT || 50
                  }
                },
                header: {
                  enabled: true,
                  content: 'header.json',
                  height: process.env.POSTMARK_PDF_HEADER_HEIGHT || 50
                },
                footer: {
                  enabled: true,
                  content: 'footer.json'
                },
                templates: {
                  invoice: 'createInvoice.json',
                  credit_note: process.env.POSTMARK_PDF_CREDIT_NOTE_TEMPLATE || null,
                  return_invoice: process.env.POSTMARK_PDF_RETURN_INVOICE_TEMPLATE || null
                }
              }
            };
            _i = 0, _orderIds = orderIds;
          case 6:
            if (!(_i < _orderIds.length)) {
              _context.next = 30;
              break;
            }
            orderId = _orderIds[_i];
            _context.next = 10;
            return getOrderData(orderService, totalsService, orderId);
          case 10:
            data = _context.sent;
            _context.prev = 11;
            if (!(((_options$pdf$enabled = options === null || options === void 0 ? void 0 : (_options$pdf = options.pdf) === null || _options$pdf === void 0 ? void 0 : _options$pdf.enabled) !== null && _options$pdf$enabled !== void 0 ? _options$pdf$enabled : false) && pdfGen && pdfGen.createInvoice)) {
              _context.next = 21;
              break;
            }
            _context.next = 15;
            return pdfGen.createInvoice(options, data);
          case 15:
            base64 = _context.sent;
            // attachments.push({
            //     name: "invoice.pdf",
            //     base64,
            //     type: "application/pdf",
            // })
            // res.type('application/pdf');
            // res.header('Content-Disposition', `attachment; filename="${orderId}.pdf"`);
            // res.send(Buffer.from(base64, 'base64'));
            // write tot file as real pdf, not base64
            dir = _path["default"].join(__dirname, '..', '..', 'pdf');
            if (!_fs["default"].existsSync(dir)) {
              _fs["default"].mkdirSync(dir);
            }
            console.log(dir);
            filename = _path["default"].join(dir, orderId + '.pdf');
            _fs["default"].writeFile(filename, Buffer.from(base64, 'base64'), function (err) {
              if (err) throw err;
              console.log('The file has been saved!');
            });
          case 21:
            _context.next = 27;
            break;
          case 23:
            _context.prev = 23;
            _context.t0 = _context["catch"](11);
            console.log('error ?', _context.t0);
            console.error(_context.t0);
          case 27:
            _i++;
            _context.next = 6;
            break;
          case 30:
            res.json({
              message: "Welcome to My Store!"
            });
          case 31:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[11, 23]]);
    }));
    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
  var getOrderData = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(orderService, totalsService, orderId) {
      var _order$shipping_metho;
      var order, tax_total, shipping_total, gift_card_total, total, currencyCode, items, discounts, giftCards, locale, discountTotal, discounted_subtotal, subtotal, subtotal_ex_tax;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return orderService.retrieve(orderId, {
              select: ["shipping_total", "discount_total", "tax_total", "refunded_total", "gift_card_total", "subtotal", "total"],
              relations: ["customer", "billing_address", "shipping_address", "discounts", "discounts.rule", "shipping_methods", "shipping_methods.shipping_option", "payments", "fulfillments", "returns", "gift_cards", "gift_card_transactions"]
            });
          case 2:
            order = _context3.sent;
            tax_total = order.tax_total, shipping_total = order.shipping_total, gift_card_total = order.gift_card_total, total = order.total;
            currencyCode = order.currency_code.toUpperCase();
            _context3.next = 7;
            return Promise.all(order.items.map( /*#__PURE__*/function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(i) {
                return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                  while (1) switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.next = 2;
                      return totalsService.getLineItemTotals(i, order, {
                        include_tax: true,
                        use_tax_lines: true
                      });
                    case 2:
                      i.totals = _context2.sent;
                      i.thumbnail = normalizeThumbUrl_(i.thumbnail);
                      i.discounted_price = "".concat(humanPrice_(i.totals.total / i.quantity, currencyCode), " ").concat(currencyCode);
                      i.price = "".concat(humanPrice_(i.totals.original_total / i.quantity, currencyCode), " ").concat(currencyCode);
                      return _context2.abrupt("return", i);
                    case 7:
                    case "end":
                      return _context2.stop();
                  }
                }, _callee2);
              }));
              return function (_x6) {
                return _ref3.apply(this, arguments);
              };
            }()));
          case 7:
            items = _context3.sent;
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
            locale = 'nl'; // Includes taxes in discount amount
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
            return _context3.abrupt("return", _objectSpread(_objectSpread({}, order), {}, {
              locale: locale,
              has_discounts: order.discounts.length,
              has_gift_cards: order.gift_cards.length,
              date: order.created_at.toDateString(),
              items: items,
              discounts: discounts,
              subtotal_ex_tax: "".concat(humanPrice_(subtotal_ex_tax, currencyCode), " ").concat(currencyCode),
              subtotal: "".concat(humanPrice_(subtotal, currencyCode), " ").concat(currencyCode),
              gift_card_total: "".concat(humanPrice_(gift_card_total, currencyCode), " ").concat(currencyCode),
              tax_total: "".concat(humanPrice_(tax_total, currencyCode), " ").concat(currencyCode),
              discount_total: "".concat(humanPrice_(discountTotal, currencyCode), " ").concat(currencyCode),
              shipping_total: "".concat(humanPrice_(shipping_total, currencyCode), " ").concat(currencyCode),
              shipping_total_inc: "".concat(humanPrice_((order === null || order === void 0 ? void 0 : (_order$shipping_metho = order.shipping_methods[0]) === null || _order$shipping_metho === void 0 ? void 0 : _order$shipping_metho.price) || shipping_total, currencyCode), " ").concat(currencyCode),
              total: "".concat(humanPrice_(total, currencyCode), " ").concat(currencyCode)
            }));
          case 18:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function getOrderData(_x3, _x4, _x5) {
      return _ref2.apply(this, arguments);
    };
  }();
  var humanPrice_ = function humanPrice_(amount, currency) {
    if (!amount) return "0.00";
    var normalized = (0, _medusaCoreUtils.humanizeAmount)(amount, currency);
    return normalized.toFixed(_medusaCoreUtils.zeroDecimalCurrencies.includes(currency.toLowerCase()) ? 0 : 2);
  };
  var normalizeThumbUrl_ = function normalizeThumbUrl_(url) {
    if (!url) return null;else if (url.startsWith("http")) return url;else if (url.startsWith("//")) return "https:".concat(url);
    return url;
  };
  (0, _routes["default"])(app);
  return app;
};
exports["default"] = _default;