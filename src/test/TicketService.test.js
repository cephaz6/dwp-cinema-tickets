import { describe, test, expect, beforeEach } from "@jest/globals";
import TicketService from "../pairtest/lib/TicketService.js";
import TicketTypeRequest from "../pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../pairtest/lib/InvalidPurchaseException.js";

describe("TicketService", () => {
  let ticketService;

  beforeEach(() => {
    ticketService = new TicketService();
  });

  describe("Valid Purchases", () => {
    test("should purchase adult tickets successfully", () => {
      const adultRequest = new TicketTypeRequest("ADULT", 2);
      expect(() => {
        ticketService.purchaseTickets(1, adultRequest);
      }).not.toThrow();
    });

    test("should purchase mixed tickets with adults", () => {
      const adultRequest = new TicketTypeRequest("ADULT", 2);
      const childRequest = new TicketTypeRequest("CHILD", 1);
      const infantRequest = new TicketTypeRequest("INFANT", 1);

      expect(() => {
        ticketService.purchaseTickets(
          1,
          adultRequest,
          childRequest,
          infantRequest
        );
      }).not.toThrow();
    });

    test("should handle maximum 25 tickets", () => {
      const adultRequest = new TicketTypeRequest("ADULT", 25);
      expect(() => {
        ticketService.purchaseTickets(1, adultRequest);
      }).not.toThrow();
    });

    test("should allow multiple ticket requests of same type", () => {
      const adultRequest1 = new TicketTypeRequest("ADULT", 2);
      const adultRequest2 = new TicketTypeRequest("ADULT", 3);
      expect(() => {
        ticketService.purchaseTickets(1, adultRequest1, adultRequest2);
      }).not.toThrow();
    });
  });

  describe("Invalid Purchases - Account Validation", () => {
    test("should reject zero account ID", () => {
      const adultRequest = new TicketTypeRequest("ADULT", 1);
      expect(() => {
        ticketService.purchaseTickets(0, adultRequest);
      }).toThrow(InvalidPurchaseException);
    });

    test("should reject negative account ID", () => {
      const adultRequest = new TicketTypeRequest("ADULT", 1);
      expect(() => {
        ticketService.purchaseTickets(-1, adultRequest);
      }).toThrow(InvalidPurchaseException);
    });

    test("should reject non-integer account ID", () => {
      const adultRequest = new TicketTypeRequest("ADULT", 1);
      expect(() => {
        ticketService.purchaseTickets(1.5, adultRequest);
      }).toThrow(InvalidPurchaseException);
    });
  });

  describe("Invalid Purchases - Business Rules", () => {
    test("should reject child tickets without adult", () => {
      const childRequest = new TicketTypeRequest("CHILD", 1);
      expect(() => {
        ticketService.purchaseTickets(1, childRequest);
      }).toThrow(InvalidPurchaseException);
    });

    test("should reject infant tickets without adult", () => {
      const infantRequest = new TicketTypeRequest("INFANT", 1);
      expect(() => {
        ticketService.purchaseTickets(1, infantRequest);
      }).toThrow(InvalidPurchaseException);
    });

    test("should reject more than 25 tickets", () => {
      const adultRequest = new TicketTypeRequest("ADULT", 26);
      expect(() => {
        ticketService.purchaseTickets(1, adultRequest);
      }).toThrow(InvalidPurchaseException);
    });

    test("should reject empty ticket requests", () => {
      expect(() => {
        ticketService.purchaseTickets(1);
      }).toThrow(InvalidPurchaseException);
    });

    test("should reject mixed tickets exceeding 25 total", () => {
      const adultRequest = new TicketTypeRequest("ADULT", 20);
      const childRequest = new TicketTypeRequest("CHILD", 6);
      expect(() => {
        ticketService.purchaseTickets(1, adultRequest, childRequest);
      }).toThrow(InvalidPurchaseException);
    });
  });
});
