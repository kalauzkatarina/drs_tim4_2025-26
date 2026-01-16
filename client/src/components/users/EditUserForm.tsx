import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userApi } from "../../api_services/users/UserAPIService";
import type { User } from "../../models/users/UserDto";
import { UserRole } from "../../enums/UserRoles"; 
import type { UserRoleType } from "../../enums/UserRoles";

export default function EditUserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  const myRole = Number(localStorage.getItem("userRole")); 

  useEffect(() => {
    if (id) {
      userApi.getUserById(Number(id)).then((data) => {
      setUser(data ?? null); 
    });
    }
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  if (user && id) {
    try {
      await userApi.updateUser(Number(id), user);
      navigate(-1);
      window.location.href = document.referrer; 

    } catch (error) {
      console.error("Greška:", error);
      alert("Greška pri čuvanju");
    }
  }

  };

  if (!user) return <p>Učitavanje...</p>;

  return (
    <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "20px" }}>
      <h3>Profil: {user.email}</h3>
      
      <label>Ime:</label>
      <input value={user.firstName} onChange={e => setUser({...user, firstName: e.target.value})} placeholder="Ime" />
      
      <label>Prezime:</label>
      <input value={user.lastName} onChange={e => setUser({...user, lastName: e.target.value})} placeholder="Prezime" />
      
      <label>Država:</label>
      <input value={user.state || ""} onChange={e => setUser({...user, state: e.target.value})} placeholder="Država" />

      {myRole === UserRole.ADMINISTRATOR && (
        <>
          <label>Uloga korisnika:</label>
          <select 
            value={user.userRole} 
            onChange={e => setUser({...user, userRole: Number(e.target.value) as UserRoleType})}
          >
             <option value={UserRole.ADMINISTRATOR}>Administrator</option>
             <option value={UserRole.MANAGER}>Menadžer</option>
             <option value={UserRole.USER}>Korisnik</option>
          </select>
        </>
      )}

      <div style={{ marginTop: "20px" }}>
        <button type="submit" style={{ backgroundColor: "blue", color: "white", padding: "10px 20px" }}>Sačuvaj</button>
        <button type="button" onClick={() => navigate(-1)} style={{ marginLeft: "10px" }}>Nazad</button>
      </div>
    </form>
  );
}