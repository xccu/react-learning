from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routes_time_entry import router as time_entry_router
from routes_user import router as user_router
from routes_role import router as role_router

app = FastAPI(
    title="工时填报 API",
    description="React 工时填报应用的后端 API 服务",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def custom_exception_handler(request: Request, exc: Exception):
    if hasattr(exc, "detail"):
        return JSONResponse(status_code=exc.status_code or 500, content={"message": str(exc.detail)})
    return JSONResponse(status_code=500, content={"message": str(exc)})


# Register routers
app.include_router(time_entry_router)
app.include_router(user_router)
app.include_router(role_router)


@app.get("/")
def root():
    return {"message": "工时填报 API 服务运行中"}