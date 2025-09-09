import { describe, test, expect } from "@jest/globals";
import TicketTypeRequest from "../pairtest/lib/TicketTypeRequest.js";

describe("TicketTypeRequest", () => {
  describe("Valid Requests", () => {
    test("should create ADULT ticket request", () => {
      const request = new TicketTypeRequest("ADULT", 2);
      expect(request.getTicketType()).toBe("ADULT");
      expect(request.getNoOfTickets()).toBe(2);
    });

    test("should create CHILD ticket request", () => {
      const request = new TicketTypeRequest("CHILD", 1);
      expect(request.getTicketType()).toBe("CHILD");
      expect(request.getNoOfTickets()).toBe(1);
    });

    test("should create INFANT ticket request", () => {
      const request = new TicketTypeRequest("INFANT", 3);
      expect(request.getTicketType()).toBe("INFANT");
      expect(request.getNoOfTickets()).toBe(3);
    });

    test("should create request with zero tickets", () => {
      const request = new TicketTypeRequest("ADULT", 0);
      expect(request.getNoOfTickets()).toBe(0);
    });
  });

  describe("Invalid Requests", () => {
    test("should reject invalid ticket type", () => {
      expect(() => {
        new TicketTypeRequest("INVALID", 1);
      }).toThrow(TypeError);
    });

    test("should reject non-integer ticket count", () => {
      expect(() => {
        new TicketTypeRequest("ADULT", 1.5);
      }).toThrow(TypeError);
    });

    test("should reject negative ticket count", () => {
      expect(() => {
        new TicketTypeRequest("ADULT", -1);
      }).toThrow(TypeError);
    });

    test("should reject string ticket count", () => {
      expect(() => {
        new TicketTypeRequest("ADULT", "2");
      }).toThrow(TypeError);
    });
  });
});
