import json
import os
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

DATA_DIR = Path(__file__).parent / "data"


def load_json(filename: str) -> list[dict]:
    filepath = DATA_DIR / filename
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(filename: str, data: list[dict]) -> None:
    """Save data to JSON file with error handling."""
    try:
        filepath = DATA_DIR / filename
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        logger.error(f"Failed to save {filename}: {e}")
        raise


def load_time_entries() -> list[dict]:
    return load_json("time_entries.json")


def save_time_entries(data: list[dict]) -> None:
    save_json("time_entries.json", data)


def load_users() -> list[dict]:
    return load_json("users.json")


def save_users(data: list[dict]) -> None:
    save_json("users.json", data)


def load_roles() -> list[dict]:
    return load_json("roles.json")


def save_roles(data: list[dict]) -> None:
    save_json("roles.json", data)