import TicketTypeRequest from "./TicketTypeRequest.js";
import InvalidPurchaseException from "./InvalidPurchaseException.js";
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";

export default class TicketService {
  // Ticket prices in pounds
  #TICKET_PRICES = {
    ADULT: 25, // Adults pay £25
    CHILD: 15, // Children pay £15
    INFANT: 0, // Infants are free
  };

  // Business rule: Maximum 25 tickets allowed per purchase
  #MAX_TICKETS = 25;

  // Private services for payment and seat booking
  #paymentService;
  #seatReservationService;

  constructor() {
    // Set up external services when creating ticket service
    this.#paymentService = new TicketPaymentService();
    this.#seatReservationService = new SeatReservationService();
  }

  /**
   * Main method to buy tickets
   * Takes account ID and list of ticket requests
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {
    // Check account ID is valid
    this.#validateAccountId(accountId);

    // requests are properly formatted
    this.#validateTicketRequests(ticketTypeRequests);

    // Count how many of each ticket type
    const ticketCounts = this.#calculateTicketCounts(ticketTypeRequests);

    // Calculate total cost
    const totalAmount = this.#calculateTotalAmount(ticketCounts);

    // Calculate seats needed (infants don't get seats)
    const totalSeats = this.#calculateTotalSeats(ticketCounts);

    // to follow business rules
    this.#validateBusinessRules(ticketCounts);
    this.#processPayment(accountId, totalAmount);
    this.#reserveSeats(accountId, totalSeats);
  }

  // All Account ID Must be a positive number
  #validateAccountId(accountId) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException(
        "Account ID must be a positive integer"
      );
    }
  }

  // This code block checks for the validity of a ticket
  #validateTicketRequests(ticketTypeRequests) {
    // Must have at least one ticket request
    if (!ticketTypeRequests || ticketTypeRequests.length === 0) {
      throw new InvalidPurchaseException(
        "At least one ticket type request is required"
      );
    }

    // Each request must be a proper TicketTypeRequest object
    for (const request of ticketTypeRequests) {
      if (!(request instanceof TicketTypeRequest)) {
        throw new InvalidPurchaseException(
          "All ticket requests must be TicketTypeRequest instances"
        );
      }
    }
  }

  /**
   * Count how many tickets of each type (Adult, Child, Infant)
   */
  #calculateTicketCounts(ticketTypeRequests) {
    // Start with zero of each type
    const counts = { ADULT: 0, CHILD: 0, INFANT: 0 };

    // Add up all the ticket requests
    for (const request of ticketTypeRequests) {
      const type = request.getTicketType(); // e.g., 'ADULT'
      const quantity = request.getNoOfTickets(); // e.g., 2
      counts[type] += quantity; // Add to total
    }

    return counts;
  }

  /**
   * Calculate total cost based on ticket prices
   */
  #calculateTotalAmount(ticketCounts) {
    let total = 0;

    // For each ticket type, multiply count by price
    for (const [type, count] of Object.entries(ticketCounts)) {
      total += count * this.#TICKET_PRICES[type];
    }
    // Example: 2 adults + 1 child = (2 × £25) + (1 × £15) = £65

    return total;
  }

  /**
   * Calculate seats needed (infants sit on adult laps, so no seat)
   */
  #calculateTotalSeats(ticketCounts) {
    // Only adults and children get seats
    return ticketCounts.ADULT + ticketCounts.CHILD;
  }

  /**
   * Check all the cinema's business rules
   */
  #validateBusinessRules(ticketCounts) {
    const totalTickets =
      ticketCounts.ADULT + ticketCounts.CHILD + ticketCounts.INFANT;

    // Rule 1: Cannot buy more than 25 tickets at once
    if (totalTickets > this.#MAX_TICKETS) {
      throw new InvalidPurchaseException(
        `Cannot purchase more than ${this.#MAX_TICKETS} tickets at once`
      );
    }

    // Rule 2: Children and infants must be accompanied by adults
    if (
      (ticketCounts.CHILD > 0 || ticketCounts.INFANT > 0) &&
      ticketCounts.ADULT === 0
    ) {
      throw new InvalidPurchaseException(
        "Child and Infant tickets cannot be purchased without Adult tickets"
      );
    }

    // Rule 3: Must buy at least one ticket
    if (totalTickets === 0) {
      throw new InvalidPurchaseException("Must purchase at least one ticket");
    }
  }

  /**
   * Send payment to external payment service
   */
  #processPayment(accountId, totalAmount) {
    this.#paymentService.makePayment(accountId, totalAmount);
  }

  /**
   * Book seats through external seat service
   */
  #reserveSeats(accountId, totalSeats) {
    // Only reserve seats if we actually need some
    if (totalSeats > 0) {
      this.#seatReservationService.reserveSeat(accountId, totalSeats);
    }
  }
}
