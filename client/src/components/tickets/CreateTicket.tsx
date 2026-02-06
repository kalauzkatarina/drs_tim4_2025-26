import { useNavigate } from "react-router-dom";
import type { TicketCreateDto } from "../../models/ticket/TicketCreateDto";
import React, { useState } from "react";
import { ticketsApi } from "../../api_services/ticket/TicketAPIService";

const empty: TicketCreateDto = {
    userId: Number(localStorage.getItem("userId")),
    flightId: 0,
    ticketDescription: "",
    ticketPrice: 0,
    ticketDate: new Date().toISOString().slice(0, 16)
};

export default function CreateTicket() {
    const nav = useNavigate();
    const [dto, setDto] = useState<TicketCreateDto>(empty);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDto({ ...dto, [name]: name === "flightId" || name === "ticketPrice" ? Number(value) : value});
    };

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        ticketsApi.createTicket(dto).then(() => nav("/my-tickets"));
    };

    return (
        <div>
            <h2>Buy Ticket</h2>
            <form onSubmit={save}>
                <label>Flight ID</label>
                <input name="flightId" type="number" value={dto.flightId} onChange={handleChange} required/>
                <label>Description</label>
                <input name="ticketDescription" value={dto.ticketDescription} onChange={handleChange}/>
                <label>Price</label>
                <input name="ticketPrice" value={dto.ticketPrice} onChange={handleChange}/>
                <label>Travel date</label>
                <input name="ticketDate" type="datetime-local" value={dto.ticketDate} onChange={handleChange}/>
                <button type="submit">Save</button>
                <button type="button" onClick={() => nav(-1)}>Cancel</button>
            </form>
        </div>
    );
}