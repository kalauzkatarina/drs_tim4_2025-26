import { useState } from "react";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";
import { userApi } from "../../api_services/users/UserAPIService";
import { useNavigate } from "react-router-dom";
import type { User } from "../../models/users/UserDto";
import { UserRole } from "../../enums/UserRoles";

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

    if(jeRegistracija){

        const registerPodaci = {email,lozinka,firstName,lastName,dateOfBirth,gender,state,streetName,streetNumber};

        try {

            const odgovor = await authApi.registracija(registerPodaci.email, registerPodaci.lozinka, registerPodaci.firstName, registerPodaci.lastName, registerPodaci.dateOfBirth, registerPodaci.gender, registerPodaci.state, registerPodaci.streetName, registerPodaci.streetNumber);

            if (odgovor.accessToken) {
                localStorage.setItem("token", odgovor.accessToken);

                const sviKorisnici = await userApi.getAllUsers();
                const ja = sviKorisnici.find((u: User) => u.email === loginPodaci.email);

                if (ja && ja.id) {
                    const uloga = (ja as any).role || (ja as any).userRole;
                    console.log("Moja uloga sa servera je:", uloga);

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
        }catch (error) {
        console.error("Greška pri registraciji:", error);
        setGreska("Pogrešan email ili lozinka");
    }

    }else{
            const loginPodaci = { email, lozinka };

    try {
        const odgovor = await authApi.prijava(loginPodaci.email, loginPodaci.lozinka);

        if (odgovor.accessToken) {
            localStorage.setItem("token", odgovor.accessToken);

            const sviKorisnici = await userApi.getAllUsers();
            const ja = sviKorisnici.find((u: User) => u.email === loginPodaci.email);

            if (ja && ja.id) {
                const uloga = (ja as any).role || (ja as any).userRole;
                console.log("Moja uloga sa servera je:", uloga);

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
    } catch (error) {
        console.error("Greška pri prijavi:", error);
        setGreska("Pogrešan email ili lozinka");
    }
    }

};

  return (
    <div className="form-container">
      <h1>{jeRegistracija ? "Регистрација" : "Пријава"}</h1>
      <form onSubmit={podnesiFormu}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={lozinka} onChange={(e) => setLozinka(e.target.value)} placeholder="Лозинка" required />

        {jeRegistracija && (
          <>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Име" required />
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Презиме" required />
            <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="MALE">Мушки</option>
              <option value="FEMALE">Женски</option>
              <option value="OTHER">Остало</option>
            </select>
            <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="Држава" required />
            <input type="text" value={streetName} onChange={(e) => setStreetName(e.target.value)} placeholder="Улица" required />
            <input type="text" value={streetNumber} onChange={(e) => setStreetNumber(e.target.value)} placeholder="Број" required />
          </>
        )}

        {greska && <p style={{ color: "red" }}>{greska}</p>}
        <button type="submit">{jeRegistracija ? "Региструј се" : "Пријави се"}</button>
      </form>

      <button onClick={() => setJeRegistracija(!jeRegistracija)}>
        {jeRegistracija ? "Имате налог? Пријавите се" : "Немате налог? Региструјте се"}
      </button>
    </div>
  );
}