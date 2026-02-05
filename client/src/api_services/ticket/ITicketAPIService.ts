import type { Ticket } from "../../models/ticket/TicketDto";

export interface ITicketAPIService {
    createTicket(data: Ticket): Promise<Ticket>;
    getTicketByID(id: number): Promise<Ticket>;
    getTicketsByUser(userId: number): Promise<Ticket[]>;
    getTicketsByFlight(flightId: number): Promise<Ticket[]>;
    cancelTicket(ticketId: number): Promise<void>;
}