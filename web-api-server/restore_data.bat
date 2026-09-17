@echo off
copy /Y data\initial\time_entries.json data\time_entries.json
copy /Y data\initial\users.json data\users.json
copy /Y data\initial\roles.json data\roles.json
echo Data restored successfully!
pause