import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { flightApi } from "../../api_services/flight/FlightApiService";
import type { Flight } from "../../models/flight/FlightDto";

export default function FlightList() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const role = localStorage.getItem("userRole");
  const nav = useNavigate();

  const load = async () => {
    if (role === "ADMINISTRATOR") {
      // admin vidi pending (approve/reject)
      const data = await flightApi.getAllFlightsAdmin();
      setFlights(data);
    } else {
      // user vidi samo approved
      const data = await flightApi.getAllFlights();
      setFlights(data);
    }
  };

  useEffect(() => {
    load();
  }, [role]);

  const statusColor = (status?: string) => {
    switch (status) {
      case "APPROVED": return "text-green-400";
      case "PENDING": return "text-yellow-400";
      case "REJECTED": return "text-red-400";
      default: return "text-white/60";
    }
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black uppercase tracking-tight text-white">
          Flights
        </h2>

        {role !== "USER" && (
          <button
            onClick={() => nav("/create-flight")}
            className="rounded-xl bg-sky-500 px-6 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-sky-400 transition"
          >
            New Flight
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {flights.map(f => (
          <div
            key={f.id}
            className="rounded-[2.5rem] bg-black/20 backdrop-blur-3xl border border-white/10 p-6 shadow-xl"
          >
             {role === "ADMINISTRATOR" ? (
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-black uppercase text-white">{f.name}</h3>
                <span className={`text-xs font-black ${statusColor(f.approvalStatus)}`}>
                  {f.approvalStatus}
                </span>
              </div>
            ) : (
              <h3 className="text-lg font-black uppercase text-white mb-4">{f.name}</h3>
            )}

            <div className="space-y-2 text-sm text-white/70">
              <div><b>From:</b> {f.departureAirport}</div>
              <div><b>To:</b> {f.arrivalAirport}</div>
              <div><b>Departure:</b> {new Date(f.departureTime).toLocaleString()}</div>
              <div><b>Price:</b> €{f.ticketPrice}</div>
            </div>

            {/* ADMIN ACTIONS */}
            {role === "ADMINISTRATOR" && f.approvalStatus === "PENDING" && (
              <div className="flex gap-2 mt-6">
                <button
                  onClick={async () => {
                    await flightApi.approveFlight(f.id);
                    load();
                  }}
                  className="flex-1 rounded-xl bg-green-500/20 text-green-400 py-2 text-xs font-black uppercase"
                >
                  Approve
                </button>

                <button
                  onClick={async () => {
                    const reason = prompt("Reason for rejection:");
                    if (!reason) return;
                    await flightApi.rejectFlight(f.id, reason);
                    load();
                  }}
                  className="flex-1 rounded-xl bg-red-500/20 text-red-400 py-2 text-xs font-black uppercase"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
