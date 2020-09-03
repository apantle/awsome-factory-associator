# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),

## [2.2.1] - 2020-09-03

### Removed

- dependency on sails and hooks to run its tests
- section about feature not implemented

### Changed

- all connection parameters are loaded via env vars (or `.env` file)
- enforcing linter and fixing typos
- allowing to keep models after test to allow review of results
- refactor `assoc*` methods using common code

## [2.1.1] - 2020-09-02

### Added

- fixed a typo in retry creation
- added debug package for optional logs

## [2.1.0] - 2020-08-31

### Added

- retry model creation is added and README is updated with instructions

## [Unreleased]
