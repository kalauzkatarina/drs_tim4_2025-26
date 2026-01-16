import { useNavigate } from "react-router-dom";
import { UserRole } from "../enums/UserRoles";

export default function Navbar() {
  const navigate = useNavigate();
  const uloga = Number(localStorage.getItem("userRole"));
  const userId = localStorage.getItem("userId");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    
    window.location.href = "/"; 
  };

  return (
    <nav style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      padding: "10px 20px", 
      background: "#333", 
      color: "white",
      marginBottom: "20px" 
    }}>
      <div>
        <span style={{ marginRight: "20px", fontWeight: "bold" }}>Moja Aplikacija</span>
        {uloga === UserRole.ADMINISTRATOR ? (
          <button onClick={() => navigate("/users")}>Lista korisnika</button>
        ) : (
          <button onClick={() => navigate(`/edit-user/${userId}`)}>Moj Profil</button>
        )}
      </div>

      <button 
        onClick={handleLogout} 
        style={{ backgroundColor: "#ff4d4d", color: "white", border: "none", padding: "5px 15px", cursor: "pointer" }}
      >
        Odjavi se (Logout)
      </button>
    </nav>
  );
}