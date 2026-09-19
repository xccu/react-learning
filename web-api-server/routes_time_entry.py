from fastapi import APIRouter, Query, HTTPException
from typing import Optional
import time

from models import TimeEntryCreate, TimeEntryUpdate, TimeEntryResponse, TimeEntryReject
from data_loader import load_time_entries, save_time_entries

router = APIRouter(prefix="/api/time-entries", tags=["TimeEntry"])


@router.get("", response_model=list[TimeEntryResponse])
def list_time_entries(
    projectName: Optional[str] = Query(None),
    description: Optional[str] = Query(None),
    approvalStatus: Optional[str] = Query(""),
):
    entries = load_time_entries()
    result = entries[:]
    if projectName:
        result = [e for e in result if projectName.lower() in e["projectName"].lower()]
    if description:
        result = [e for e in result if description.lower() in e["description"].lower()]
    if approvalStatus and approvalStatus.strip():
        result = [e for e in result if e["approvalStatus"] == approvalStatus]
    return result


@router.get("/{entry_id}", response_model=TimeEntryResponse)
def get_time_entry(entry_id: str):
    entries = load_time_entries()
    entry = next((e for e in entries if e["id"] == entry_id), None)
    if not entry:
        raise HTTPException(status_code=404, detail={"message": "记录不存在"})
    return entry


@router.post("", response_model=TimeEntryResponse, status_code=201)
def create_time_entry(entry: TimeEntryCreate):
    entries = load_time_entries()
    new_entry = {
        "id": str(int(time.time() * 1000)),
        "projectName": entry.projectName,
        "description": entry.description,
        "hours": entry.hours,
        "approvalStatus": entry.approvalStatus,
        "createdAt": time.strftime("%Y-%m-%dT%H:%M:%S.000Z", time.gmtime()),
    }
    entries.append(new_entry)
    save_time_entries(entries)
    return new_entry


@router.post("/batch", response_model=list[TimeEntryResponse], status_code=201)
def batch_create_time_entries(entries: list[TimeEntryCreate]):
    result = []
    for entry in entries:
        new_entry = {
            "id": str(int(time.time() * 1000)),
            "projectName": entry.projectName,
            "description": entry.description,
            "hours": entry.hours,
            "approvalStatus": entry.approvalStatus,
            "createdAt": time.strftime("%Y-%m-%dT%H:%M:%S.000Z", time.gmtime()),
        }
        loaded_entries = load_time_entries()
        loaded_entries.append(new_entry)
        save_time_entries(loaded_entries)
        result.append(new_entry)
    return result


@router.put("/{entry_id}", response_model=TimeEntryResponse)
def update_time_entry(entry_id: str, updates: TimeEntryUpdate):
    entries = load_time_entries()
    entry = next((e for e in entries if e["id"] == entry_id), None)
    if not entry:
        raise HTTPException(status_code=404, detail={"message": "记录不存在"})
    update_data = updates.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        entry[key] = value
    save_time_entries(entries)
    return entry


@router.delete("/{entry_id}")
def delete_time_entry(entry_id: str):
    entries = load_time_entries()
    entry_index = next((i for i, e in enumerate(entries) if e["id"] == entry_id), None)
    if entry_index is None:
        raise HTTPException(status_code=404, detail={"message": "记录不存在"})
    entries.pop(entry_index)
    save_time_entries(entries)
    return {"success": True}


@router.put("/{entry_id}/submit", response_model=TimeEntryResponse)
def submit_time_entry(entry_id: str):
    entries = load_time_entries()
    entry = next((e for e in entries if e["id"] == entry_id), None)
    if not entry:
        raise HTTPException(status_code=404, detail={"message": "记录不存在"})
    entry["approvalStatus"] = "待审批"
    entry.pop("rejectReason", None)
    save_time_entries(entries)
    return entry


@router.put("/{entry_id}/approve", response_model=TimeEntryResponse)
def approve_time_entry(entry_id: str):
    entries = load_time_entries()
    entry = next((e for e in entries if e["id"] == entry_id), None)
    if not entry:
        raise HTTPException(status_code=404, detail={"message": "记录不存在"})
    entry["approvalStatus"] = "已通过"
    entry.pop("rejectReason", None)
    save_time_entries(entries)
    return entry


@router.put("/{entry_id}/reject", response_model=TimeEntryResponse)
def reject_time_entry(entry_id: str, reject: TimeEntryReject):
    entries = load_time_entries()
    entry = next((e for e in entries if e["id"] == entry_id), None)
    if not entry:
        raise HTTPException(status_code=404, detail={"message": "记录不存在"})
    entry["approvalStatus"] = "已驳回"
    entry["rejectReason"] = reject.reason
    save_time_entries(entries)
    return entry