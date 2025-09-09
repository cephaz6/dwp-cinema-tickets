/**
 * Custom exception for invalid ticket purchase requests
 */
export default class InvalidPurchaseException extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidPurchaseException";
  }
}
