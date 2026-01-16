import { useState } from "react";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";
import { userApi } from "../../api_services/users/UserAPIService";
import { useNavigate } from "react-router-dom";
import type { User } from "../../models/users/UserDto";
import { UserRole } from "../../enums/UserRoles";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";

export default function AutentifikacionaForma({
  authApi,
  onLoginSuccess,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [greska, setGreska] = useState("");
  const [jeRegistracija, setJeRegistracija] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("MALE");
  const [state, setState] = useState("");
  const [streetName, setStreetName] = useState("");
  const [streetNumber, setStreetNumber] = useState("");

  const navigate = useNavigate();

  const podnesiFormu = async (e: React.FormEvent) => {
    e.preventDefault();

    setGreska("");

    if (jeRegistracija) {

      const registerPodaci = { email, lozinka, firstName, lastName, dateOfBirth, gender, state, streetName, streetNumber };

      try {

        const odgovor = await authApi.register(registerPodaci.email, registerPodaci.lozinka, registerPodaci.firstName, registerPodaci.lastName, registerPodaci.dateOfBirth, registerPodaci.gender, registerPodaci.state, registerPodaci.streetName, registerPodaci.streetNumber);

        if (odgovor.accessToken) {
          localStorage.setItem("token", odgovor.accessToken);

          const sviKorisnici = await userApi.getAllUsers();
          const ja = sviKorisnici.find((u: User) => u.email === registerPodaci.email);

          if (ja && ja.id) {
            const uloga = (ja as any).role || (ja as any).userRole;
            console.log("Moja uloga sa servera je:", uloga);

            localStorage.setItem("userRole", uloga);
            localStorage.setItem("userId", ja.id.toString());

            onLoginSuccess();

            navigate("/profile");
          }
        }
      } catch (error) {
        console.error("Greška pri registraciji:", error);
        setGreska("Pogrešan email ili lozinka");
      }

    } else {

      try {
        const odgovor = await authApi.login(email, lozinka);

        if (odgovor.accessToken) {
          localStorage.setItem("token", odgovor.accessToken);

          const sviKorisnici = await userApi.getAllUsers();
          const ja = sviKorisnici.find((u: User) => u.email === email);

          if (ja && ja.id) {
            const uloga = (ja as any).role || (ja as any).userRole;

            localStorage.setItem("userRole", uloga);
            localStorage.setItem("userId", ja.id.toString());

            onLoginSuccess();

            if (uloga === UserRole.ADMINISTRATOR) {
              navigate("/users/getAll");
            } else {
              navigate("/profile");
            }
          }
        }
      } catch {
        setGreska("Invalid email or password");
      }
    };
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4 py-12">
      <div className="w-full max-w-md bg-gray-700 rounded-xl shadow-lg p-6">
        <h2 className="text-center text-2xl font-bold text-white mb-6">
          {jeRegistracija ? "Create your account" : "Sign in"}
        </h2>

        <form onSubmit={podnesiFormu} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-100 mb-1">Email address</label>
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full rounded-md bg-gray-800 px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-100 mb-1">Password</label>
            <input
              type="password"
              value={lozinka}
              placeholder="Password"
              onChange={(e) => setLozinka(e.target.value)}
              required
              className="block w-full rounded-md bg-gray-800 px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {jeRegistracija && (
            <>
              <div className="flex gap-3">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-100 mb-1">First name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    required
                    className="block w-full rounded-md bg-gray-800 px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-100 mb-1">Last name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    required
                    className="block w-full rounded-md bg-gray-800 px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100 mb-1">Date of birth</label>
                <Flatpickr
                  value={dateOfBirth}
                  onChange={(dates: Date[]) => {
                    if (dates.length > 0) setDateOfBirth(dates[0].toISOString().split("T")[0]);
                  }}
                  options={{
                    dateFormat: "Y-m-d",
                    altInput: true,
                    altFormat: "F j, Y",
                    allowInput: true,
                    maxDate: "today",
                    minDate: "1900-01-01",
                    monthSelectorType: "dropdown",
                    // @ts-ignore
                    yearSelectorType: "dropdown",
                  }}
                  className="block w-full rounded-md bg-gray-800 px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Select date"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="block w-full rounded-md bg-gray-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100 mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  required
                  className="block w-full rounded-md bg-gray-800 px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-3">
                <div className="w-2/3">
                  <label className="block text-sm font-medium text-gray-100 mb-1">Street</label>
                  <input
                    type="text"
                    value={streetName}
                    onChange={(e) => setStreetName(e.target.value)}
                    placeholder="Street"
                    required
                    className="block w-full rounded-md bg-gray-800 px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-100 mb-1">Number</label>
                  <input
                    type="text"
                    value={streetNumber}
                    onChange={(e) => setStreetNumber(e.target.value)}
                    placeholder="Number"
                    required
                    className="block w-full rounded-md bg-gray-800 px-3 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </>
          )}

          {greska && <p className="text-center text-sm text-red-400">{greska}</p>}

          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            {jeRegistracija ? "Register" : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-300">
          {jeRegistracija ? "Already have an account?" : "Not a member?"}{" "}
          <button
            onClick={() => setJeRegistracija(!jeRegistracija)}
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            {jeRegistracija ? "Sign in" : "Create an account"}
          </button>
        </p>
      </div>
    </div>

  );
}
