import { useEffect, useState } from "react";
import type { Ticket } from "../../models/ticket/TicketDto";
import { ticketsApi } from "../../api_services/ticket/TicketAPIService";
import { useNavigate } from "react-router-dom";

export default function TicketList() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const nav = useNavigate();
    const userId = Number(localStorage.getItem("userId"));

    const load = () => {
        if (!userId) return;
        ticketsApi.getTicketsByUser(userId).then(setTickets).catch(console.error);
    };

    useEffect(() => {
        load();
    }, [userId]);

    const remove = (id: number) => {
        if (!confirm("Cancel ticket?")) return;
        ticketsApi.cancelTicket(id).then(load);
    };

    return (
        <div>
            <h2>My Tickets</h2>
            <button onClick={() => nav("/create-ticket")}>Buy new ticket</button>
            <table cellPadding={6} border={1}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Flight</th>
                        <th>Price</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map(t => (
                        <tr key={t.id}>
                            <td>{t.id}</td>
                            <td>{t.flightId}</td>
                            <td>{t.ticketPrice}</td>
                            <td>{new Date(t.ticketDate).toLocaleString()}</td>
                            <td>{t.cancelled ? "Cancelled" : "Valid"}</td>
                            <td>
                                <button onClick={() => nav(`/edit-ticket/${t.id}`)}>Edit</button>
                                {!t.cancelled && <button onClick={() => remove(t.id)}>Cancel</button>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}