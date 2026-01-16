import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../api_services/users/UserAPIService";
import type { User } from "../../models/users/UserDto";
import type { UserRoleType } from "../../enums/UserRoles";
import { UserRole } from "../../enums/UserRoles";

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      const data = await userApi.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Greška pri učitavanju:", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: number, newRoleValue: number) => {
    try {

    const roleToUpdate = newRoleValue as UserRoleType;

    await userApi.updateUser(userId, { userRole: roleToUpdate });
    
    alert("Uloga uspešno promenjena");
    loadUsers(); 
  } catch (error) {
    alert("Greška pri promeni uloge na serveru");
  }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Lista korisnika (Admin panel)</h2>
      <table border={1} style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#eee" }}>
            <th>Ime i prezime</th>
            <th>Email</th>
            <th>Uloga</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.firstName} {u.lastName}</td>
              <td>{u.email}</td>
              <td>
                <select 
                  value={u.userRole} 
                  onChange={(e) => handleRoleChange(u.id, Number(e.target.value))}
                >
                  <option value={UserRole.ADMINISTRATOR}>Administrator</option>
                  <option value={UserRole.MANAGER}>Menadžer</option>
                  <option value={UserRole.USER}>Korisnik</option>
                </select>
              </td>
              <td>
                <button onClick={() => navigate(`/edit-user/${u.id}`)}>Izmeni</button>
                <button 
                  onClick={() => u.id && userApi.deleteUser(u.id).then(loadUsers)} 
                  style={{ color: 'red', marginLeft: '10px' }}
                >
                  Obriši
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}