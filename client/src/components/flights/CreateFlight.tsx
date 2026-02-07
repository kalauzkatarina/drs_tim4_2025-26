import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { flightApi } from "../../api_services/flight/FlightApiService";
import type { FlightCreateDto } from "../../models/flight/FlightCreateDto";
import FlightForm from "./FlightForm";

const empty: FlightCreateDto = {
  name: "",
  airCompanyId: 0,
  flightDuration: 0,
  currentFlightDuration: 0,
  departureTime: "",
  departureAirport: "",
  arrivalAirport: "",
  ticketPrice: 0,
  createdBy: Number(localStorage.getItem("userId"))
};

export default function CreateFlight() {
  const [dto, setDto] = useState<FlightCreateDto>(empty);
  const nav = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDto({ ...dto, [name]: isNaN(Number(value)) ? value : Number(value) });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await flightApi.createFlight(dto);
    nav("/flights");
  };

  return (
    <FlightForm
      title="Create Flight"
      dto={dto}
      onChange={handleChange}
      onSubmit={save}
    />
  );
}
