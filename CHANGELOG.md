# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.1.0] - 2023-06-16

- Bugfix: Added a check if the cart has been converted to an order. No need to send abandoned cart mails if the cart has been converted to an order.

## [4.0.2] - 2023-06-09

- Bugfix: Extra check on created at since typeorm lessthen didn't filter correctly somehow

## [4.0.1] - 2023-06-09

- Bugfix: First mail could be send multiple times in some occasions
- Bugfix: Small piece of testcode was left in the codebase

## [4.0.0] - 2023-06-09

- Feature: added automated abandoned cart mail options

## [3.1.1] - 2023-06-04

- Fix: added `shipping_total_inc` to `order` object in `order.placed` event since MedusaJS can return shippign excl. tax instead of inc tax.

## [3.1.0] - 2023-06-03

- First use of this changelog. Previous changes are not documented.
