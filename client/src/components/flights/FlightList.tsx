import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { flightApi } from "../../api_services/flight/FlightApiService";
import { ticketsApi } from "../../api_services/ticket/TicketAPIService"; 
import type { Flight } from "../../models/flight/FlightDto";

export default function FlightList() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [purchasedFlightIds, setPurchasedFlightIds] = useState<number[]>([]); 
  const role = localStorage.getItem("userRole");
  const userId = Number(localStorage.getItem("userId"));
  const nav = useNavigate();

  const load = async () => {
    try {
      // Učitavanje letova
      if (role === "ADMINISTRATOR") {
        setFlights(await flightApi.getAllFlightsAdmin());
      } else if (role === "MANAGER") {
        setFlights(await flightApi.getMyFlightsManager());
      } else {
        setFlights(await flightApi.getAllFlights());
      }

      // Provera kupljenih karata za korisnika
      if (role === "USER" && userId) {
        const myTickets = await ticketsApi.getTicketsByUser(userId);
        const ids = myTickets.filter(t => !t.cancelled).map(t => t.flightId);
        setPurchasedFlightIds(ids);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load flights");
    }
  };

  useEffect(() => {
    load();
  }, [role]);

  // MOJA IZMENA: handleBuy umesto navigacije na drugu stranicu
  const handleBuy = async (f: Flight) => {
    if (!userId) {
      alert("Please log in to buy a ticket.");
      return;
    }

    const confirmBuy = window.confirm(`Buy ticket for ${f.departureAirport} → ${f.arrivalAirport}?`);
    if (!confirmBuy) return;

    try {
      await ticketsApi.createTicket({
        userId: userId,
        flightId: f.id,
        ticketDescription: `Ticket for ${f.departureAirport} → ${f.arrivalAirport}`,
        ticketPrice: f.ticketPrice,
      });
      alert("Ticket purchased successfully!");
      load(); 
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("Failed to buy ticket.");
    }
  };

  const statusColor = (status?: string) => {
    switch (status) {
      case "APPROVED": return "text-green-400";
      case "PENDING": return "text-yellow-400";
      case "REJECTED": return "text-red-400";
      case "CANCELLED": return "text-gray-400";
      default: return "text-white/60";
    }
  };

  const hasFlightStarted = (departureTime: string) => {
    return new Date(departureTime) <= new Date();
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black uppercase tracking-tight text-white">Flights</h2>
        {role === "MANAGER" && (
          <button
            onClick={() => nav("/create-flight")}
            className="rounded-xl bg-sky-500 px-6 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-sky-400 transition"
          >
            New Flight
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {flights.map(f => {
          const isAlreadyBought = purchasedFlightIds.includes(f.id);

          return (
            <div key={f.id} className="rounded-[2.5rem] bg-black/20 backdrop-blur-3xl border border-white/10 p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-black uppercase text-white">{f.name}</h3>
                  <div className="flex flex-col items-end gap-1">
                    {f.cancelled && (
                      <span className="text-xs font-black text-gray-400 text-[10px] uppercase">CANCELLED</span>
                    )}
                    {!f.cancelled && role !== "USER" && (
                      <span className={`text-xs font-black uppercase text-[10px] ${statusColor(f.approvalStatus)}`}>
                        {f.approvalStatus}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-white/70">
                  <div><b>From:</b> {f.departureAirport}</div>
                  <div><b>To:</b> {f.arrivalAirport}</div>
                  <div><b>Departure:</b> {new Date(f.departureTime).toLocaleString()}</div>
                  <div><b>Price:</b> €{f.ticketPrice}</div>
                </div>
              </div>

              <div className="mt-6">
                {/* MANAGER: Rejection reason */}
                {role === "MANAGER" && f.approvalStatus === "REJECTED" && f.rejectionReason && (
                  <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/20 px-4 py-3 text-sm text-red-200">
                    <b>Reason:</b> {f.rejectionReason}
                  </div>
                )}

                {/* ADMIN: Approve / Reject */}
                {role === "ADMINISTRATOR" && f.approvalStatus === "PENDING" && (
                  <div className="flex gap-2">
                    <button onClick={async () => { await flightApi.approveFlight(f.id); load(); }} className="flex-1 rounded-xl bg-green-500/20 text-green-400 py-2 text-xs font-black uppercase transition hover:bg-green-500/30">Approve</button>
                    <button onClick={async () => { const r = prompt("Reason?"); if(r) { await flightApi.rejectFlight(f.id, r); load(); } }} className="flex-1 rounded-xl bg-red-500/20 text-red-400 py-2 text-xs font-black uppercase transition hover:bg-red-500/30">Reject</button>
                  </div>
                )}

                {/* ADMIN: Cancel Flight */}
                {role === "ADMINISTRATOR" && f.approvalStatus === "APPROVED" && !hasFlightStarted(f.departureTime) && !f.cancelled && (
                  <button
                    onClick={async () => {
                      if (confirm("Cancel this flight?")) { await flightApi.cancelFlight(f.id); load(); }
                    }}
                    className="w-full rounded-xl bg-orange-500/20 text-orange-400 py-2 text-xs font-black uppercase hover:bg-orange-500/30 transition"
                  >
                    Cancel flight
                  </button>
                )}

                {/* MANAGER: Edit Rejected */}
                {role === "MANAGER" && f.approvalStatus === "REJECTED" && (
                  <button onClick={() => nav(`/edit-flight/${f.id}`)} className="w-full rounded-xl bg-yellow-500/20 text-yellow-400 py-2 text-xs font-black uppercase transition hover:bg-yellow-500/30">Edit & Resend</button>
                )}

                {/* USER: Buy / Already Purchased / Closed */}
                {role === "USER" && f.approvalStatus === "APPROVED" && !f.cancelled && (
                  hasFlightStarted(f.departureTime) ? (
                    <div className="w-full rounded-xl bg-gray-500/20 text-gray-400 py-2 text-xs font-black uppercase text-center cursor-not-allowed">Sales Closed</div>
                  ) : isAlreadyBought ? (
                    <button onClick={() => nav("/my-tickets")} className="w-full rounded-xl bg-emerald-500/20 border border-emerald-500/30 py-2 text-xs font-black uppercase text-emerald-400 transition hover:bg-emerald-500/30">✓ Already Purchased</button>
                  ) : (
                    <button onClick={() => handleBuy(f)} className="w-full rounded-xl bg-sky-500 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-sky-400 transition">Buy Ticket</button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}