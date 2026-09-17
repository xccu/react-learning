from fastapi import APIRouter, HTTPException
from typing import Optional
import time

from models import RoleCreate, RoleUpdate, RoleResponse
from data_loader import load_roles, save_roles

router = APIRouter(prefix="/api/roles", tags=["Role"])

_roles: list[dict] = []


def _get_roles():
    global _roles
    if not _roles:
        _roles = load_roles()
    return _roles


@router.get("", response_model=list[RoleResponse])
def list_roles():
    return _get_roles()


@router.get("/{role_id}", response_model=RoleResponse)
def get_role(role_id: str):
    roles = _get_roles()
    role = next((r for r in roles if r["id"] == role_id), None)
    if not role:
        raise HTTPException(status_code=404, detail={"message": "角色不存在"})
    return role


@router.post("", response_model=RoleResponse, status_code=201)
def create_role(role: RoleCreate):
    roles = _get_roles()
    new_role = {
        "id": str(int(time.time() * 1000)),
        "name": role.name,
        "permissions": role.permissions,
    }
    roles.append(new_role)
    save_roles(roles)
    return new_role


@router.put("/{role_id}", response_model=RoleResponse)
def update_role(role_id: str, updates: RoleUpdate):
    roles = _get_roles()
    role = next((r for r in roles if r["id"] == role_id), None)
    if not role:
        raise HTTPException(status_code=404, detail={"message": "角色不存在"})
    update_data = updates.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        role[key] = value
    save_roles(roles)
    return role


@router.delete("/{role_id}")
def delete_role(role_id: str):
    roles = _get_roles()
    role = next((r for r in roles if r["id"] == role_id), None)
    if not role:
        raise HTTPException(status_code=404, detail={"message": "角色不存在"})
    if role["name"] == "Administrator":
        raise HTTPException(status_code=403, detail={"message": "不能删除 Administrator 角色"})
    roles.remove(role)
    save_roles(roles)
    return {"success": True}