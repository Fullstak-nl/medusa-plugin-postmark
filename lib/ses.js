"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _clientSes = require("@aws-sdk/client-ses");
var _default = new _clientSes.SESClient();
exports["default"] = _default;