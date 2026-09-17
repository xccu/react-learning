from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ============ TimeEntry Models ============

class TimeEntryCreate(BaseModel):
    projectName: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    hours: float = Field(..., gt=0)
    approvalStatus: str = Field(..., pattern=r"^(待审批|已通过|已驳回)$")


class TimeEntryUpdate(BaseModel):
    projectName: Optional[str] = None
    description: Optional[str] = None
    hours: Optional[float] = Field(default=None, gt=0)
    approvalStatus: Optional[str] = Field(default=None, pattern=r"^(待审批|已通过|已驳回)$")


class TimeEntryResponse(BaseModel):
    id: str
    projectName: str
    description: str
    hours: float
    approvalStatus: str
    rejectReason: Optional[str] = None
    createdAt: str


class TimeEntryReject(BaseModel):
    reason: str = Field(..., min_length=1)


# ============ User Models ============

class UserCreate(BaseModel):
    username: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)
    roles: list[str] = Field(..., min_length=1)


class UserUpdate(BaseModel):
    username: Optional[str] = None
    roles: Optional[list[str]] = None


class UserResponse(BaseModel):
    id: str
    username: str
    password: str
    roles: list[str]
    createdAt: str


class UserListResponse(BaseModel):
    id: str
    username: str
    password: str
    createdAt: str


class UserLoginResponse(BaseModel):
    id: str
    username: str
    password: str
    roles: list[str]
    permissions: list[str]
    createdAt: str


class UserLogin(BaseModel):
    username: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)


# ============ Role Models ============

class RoleCreate(BaseModel):
    name: str = Field(..., min_length=1)
    permissions: list[str] = Field(..., min_length=1)


class RoleUpdate(BaseModel):
    name: Optional[str] = None
    permissions: Optional[list[str]] = None


class RoleResponse(BaseModel):
    id: str
    name: str
    permissions: list[str]