import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Ticket } from "../../models/ticket/TicketDto";
import { ticketsApi } from "../../api_services/ticket/TicketAPIService";

export default function EditTicket() {
    const { id } = useParams();
    const nav = useNavigate();
    const [t, setT] = useState<Ticket | null>(null);
    
    useEffect(() => {
        if (!id) return;
        ticketsApi.getTicketByID(Number(id)).then(setT).catch(console.error);
    }, [id]);

    const cancel = () => {
        if (!t || t.cancelled) return;
        ticketsApi.cancelTicket(t.id).then(() => nav("/my-tickets")); 
    };

    if (!t) return <div>Loading...</div>

    return (
        <div>
            <h2>Ticket #{t.id}</h2>
            <p>Flight: {t.flightId}</p>
            <p>Price: {t.ticketPrice}</p>
            <p>Date: {new Date(t.ticketDate).toLocaleString()}</p>
            <p>Status: {t.cancelled ? "Cancelled" : "Valid"}</p>
            {!t.cancelled && <button onClick={cancel}>Cancel ticket</button>}
            <button onClick={() => nav(-1)}>Back</button>
        </div>
    );
}