import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../api_services/users/UserAPIService";
import type { User } from "../../models/users/UserDto";

export default function UserDetails() {
  const [user, setUser] = useState<User | null>(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      userApi.getUserById(Number(userId)).then((data) => {
      setUser(data ?? null); 
    });
    }
  }, [userId]);

  if (!user) return <p>Učitavanje profila...</p>;

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", maxWidth: "400px" }}>
      <h2>Moj Profil</h2>
      <p><strong>Ime:</strong> {user.firstName}</p>
      <p><strong>Prezime:</strong> {user.lastName}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Država:</strong> {user.state || "Nije uneseno"}</p>
      
      <button onClick={() => navigate(`/edit-user/${user.id}`)} style={{ marginTop: "10px" }}>
        Izmeni podatke
      </button>
    </div>
  );
}