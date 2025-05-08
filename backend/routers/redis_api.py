from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from service.redis_manager import RedisSessionManager
from schema import SessionData ,RenameSession
app = FastAPI()
session_manager = RedisSessionManager()



@app.post("/create-session")
def create_session(payload: SessionData):
    return session_manager.create_session(payload.session_id, payload.data)

@app.get("/get-session/{session_id}")
def get_session(session_id: str):
    data = session_manager.get_session(session_id)
    if data is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return data

@app.get("/display-sessions")
def display_sessions():
    return session_manager.display_all_sessions()

@app.delete("/delete-session/{session_id}")
def delete_session(session_id: str):
    return session_manager.delete_session(session_id)

@app.put("/rename-session")
def rename_session(payload: RenameSession):
    return session_manager.edit_session_name(payload.old_session_id, payload.new_session_id)
