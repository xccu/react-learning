from fastapi import APIRouter, Query, HTTPException
from typing import Optional
import time

from models import UserCreate, UserUpdate, UserResponse, UserLogin, UserListResponse, UserLoginResponse
from data_loader import load_users, save_users, load_roles

router = APIRouter(prefix="/api/users", tags=["User"])

_users: list[dict] = []


def _get_users():
    global _users
    if not _users:
        _users = load_users()
    return _users


@router.get("", response_model=list[UserListResponse])
def list_users(
    username: Optional[str] = Query(None),
    role: Optional[str] = Query(""),
):
    users = _get_users()
    result = users[:]
    if username:
        result = [u for u in result if username.lower() in u["username"].lower()]
    if role and role.strip():
        result = [u for u in result if role in u["roles"]]
    return result


@router.get("/{user_id}", response_model=UserListResponse)
def get_user(user_id: str):
    users = _get_users()
    user = next((u for u in users if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail={"message": "用户不存在"})
    return user


@router.post("", response_model=UserResponse, status_code=201)
def create_user(user: UserCreate):
    users = _get_users()
    new_user = {
        "id": str(int(time.time() * 1000)),
        "username": user.username,
        "password": user.password,
        "roles": user.roles,
        "createdAt": time.strftime("%Y-%m-%dT%H:%M:%S.000Z", time.gmtime()),
    }
    users.append(new_user)
    save_users(users)
    return new_user


@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: str, updates: UserUpdate):
    users = _get_users()
    user = next((u for u in users if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail={"message": "用户不存在"})
    update_data = updates.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        user[key] = value
    save_users(users)
    return user


@router.delete("/{user_id}")
def delete_user(user_id: str):
    users = _get_users()
    user_index = next((i for i, u in enumerate(users) if u["id"] == user_id), None)
    if user_index is None:
        raise HTTPException(status_code=404, detail={"message": "用户不存在"})
    users.pop(user_index)
    save_users(users)
    return {"success": True}


@router.post("/login", response_model=UserLoginResponse, status_code=200)
def login(user_login: UserLogin):
    users = _get_users()
    user = next((u for u in users if u["username"] == user_login.username and u["password"] == user_login.password), None)
    if not user:
        raise HTTPException(status_code=401, detail={"message": "用户名或密码错误"})
    roles = load_roles()
    permissions = []
    for role_name in user["roles"]:
        role = next((r for r in roles if r["name"] == role_name), None)
        if role:
            permissions.extend(role["permissions"])
    user_with_permissions = {**user, "permissions": permissions}
    return user_with_permissions