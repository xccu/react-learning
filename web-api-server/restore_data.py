import shutil
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"
INITIAL_DIR = DATA_DIR / "initial"


def restore_data():
    """Restore data files from data/initial/ directory."""
    if not INITIAL_DIR.exists():
        print("Error: data/initial/ directory not found!")
        return False
    restored = False
    for filename in ["time_entries.json", "users.json", "roles.json"]:
        src = INITIAL_DIR / filename
        dst = DATA_DIR / filename
        if src.exists():
            shutil.copy2(src, dst)
            print(f"Restored: {filename}")
            restored = True
    if restored:
        print("Data restored successfully.")
    else:
        print("No files to restore.")
    return restored


if __name__ == "__main__":
    restore_data()