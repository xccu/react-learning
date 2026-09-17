import json
import shutil
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"
BACKUP_DIR = DATA_DIR / "backup"


def backup_data():
    """Backup current data files to data/backup/ directory."""
    BACKUP_DIR.mkdir(exist_ok=True)
    for filename in ["time_entries.json", "users.json", "roles.json"]:
        src = DATA_DIR / filename
        dst = BACKUP_DIR / filename
        if src.exists():
            shutil.copy2(src, dst)
            print(f"Backed up: {filename}")
    print("All data backed up successfully.")


if __name__ == "__main__":
    backup_data()