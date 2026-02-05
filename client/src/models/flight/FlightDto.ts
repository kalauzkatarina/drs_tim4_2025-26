export interface Flight {
    id: number;
    name: string;
    airCompanyId: number;
    flightDuration: number;
    currentFlightDuration: number;
    departureTime: string;
    departureAirport: string;
    arrivalAirport: string;
    ticketPrice: number;
    createdBy: number;
    cancelled?: boolean;
    approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
    rejectionReason?: string | null; 
    status?: string;
}