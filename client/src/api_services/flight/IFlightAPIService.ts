import type { FlightCreateDto } from "../../models/flight/FlightCreateDto";
import type { Flight } from "../../models/flight/FlightDto";

export interface IFlightAPIService {
    getAllFlights(): Promise<Flight[]>;
    getFlightById(id: number): Promise<Flight>;
    getFlightsByAirCompany(airCompanyId: number): Promise<Flight[]>;
    getFlightsByStatus(status: string): Promise<Flight[]>;
    createFlight(data: FlightCreateDto): Promise<Flight>;
    updateFlight(id: number, data: Partial<Flight>): Promise<Flight>;
    deleteFlight(id: number): Promise<void>;
}