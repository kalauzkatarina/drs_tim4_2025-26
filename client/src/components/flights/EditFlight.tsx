import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { flightApi } from "../../api_services/flight/FlightApiService";
import type { FlightCreateDto } from "../../models/flight/FlightCreateDto";
import FlightForm from "./FlightForm";

export default function EditFlight() {
  const { id } = useParams();
  const nav = useNavigate();
  const [dto, setDto] = useState<FlightCreateDto | null>(null);

  useEffect(() => {
    if (!id) return;
    flightApi.getFlightById(Number(id)).then(setDto);
  }, [id]);

  if (!dto) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDto({ ...dto, [name]: isNaN(Number(value)) ? value : Number(value) });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await flightApi.updateFlight(Number(id), dto);
    nav("/flights");
  };

  return (
    <FlightForm
      title={`Edit Flight #${id}`}
      dto={dto}
      onChange={handleChange}
      onSubmit={save}
    />
  );
}
