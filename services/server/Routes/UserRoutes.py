from flask import Blueprint, request, jsonify
from Services.UserService import UserService
from DTO.UserDTO import UserCreateDTO, UserResponseDTO

user_bp = Blueprint("users", __name__, url_prefix="/api/users")

@user_bp.route("/register", methods=["POST"])
def register_user():
    try:
        print("kaca")
        dto = UserCreateDTO(request.json)

        if not dto.is_valid():
            return jsonify({"error": "Invalid data"}), 400
        
        user = UserService.create_user(dto.__dict__)
        return jsonify(UserResponseDTO(user).to_dict()), 201
    
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    
    # try:
    #     data=request.json
    #     user = UserService.create_user(data)

    #     return jsonify({
    #         "id": user.id,
    #         "email": user.email,
    #         "firstName": user.firstName,
    #         "lastName": user.lastName
    #     }), 201
    
    # except ValueError as e:
    #     return jsonify({"error": str(e)}), 400

    
    
@user_bp.route("/getAll", methods=["GET"])
def get_users():
    users = UserService.get_all_users()
    return jsonify([
        {
            "id": u.id,
            "email": u.email,
            "firstName": u.firstName,
            "lastName": u.lastName,
            "role": u.userRole.name
        } for u in users
    ])