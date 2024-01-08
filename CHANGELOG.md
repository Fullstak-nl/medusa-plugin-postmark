# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.5.1] - 2024-01-08

- General: sigh... didn't add build files to the last release

## [4.5.0] - 2024-01-08

- Bugfix: GiftcardService had a typo that caused an error upon startup

## [4.4.0] - 2023-11-12

- Feature: Added giftcard service to the mailer

## [4.3.0] - 2023-07-14

- Feature: Added country filter to convert ISO country code to country name

## [4.2.2] - 2023-07-14

- Bugfix: Fix that nested variables didn't work in the if statement

## [4.2.1] - 2023-07-03

- Bugfix: Renamed the attachments since IOS didn't recognize it as a pdf in some cases

## [4.2.0] - 2023-07-03

- Feature: Added if statements to the pdf generator
- Feature: Added config option to alter what to show when a variable can't be found or is invalid

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
