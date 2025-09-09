# Cinema Tickets Booking System

A Node.js implementation of a cinema ticket booking system for DWP coding exercise.

## Overview

This system handles cinema ticket purchases with the following features:
- Support for 3 ticket types: Adult (£25), Child (£15), Infant (£0)
- Business rule validation
- Payment processing integration
- Seat reservation integration
- Comprehensive error handling

## Business Rules

- **Ticket Types & Prices:**
  - Adult: £25 (gets seat)
  - Child: £15 (gets seat)
  - Infant: £0 (no seat - sits on adult's lap)

- **Purchase Constraints:**
  - Maximum 25 tickets per purchase
  - Child and Infant tickets require at least one Adult ticket
  - Valid account ID required (positive integer)

## Installation & Setup

```bash
# Clone/download the project
git clone "https://github.com/cephaz6/dwp-cinema-tickets"

# Install dependencies
npm install

# Run tests
npm test
