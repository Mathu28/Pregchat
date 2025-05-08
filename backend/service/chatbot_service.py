import json
from models import Patient
from sqlalchemy.orm import Session
from fastapi import HTTPException
from service.redis_manager import RedisSessionManager  # Import your session manager class
import uuid  # To generate a unique ID for the session

def generate_chat_response(user_id: int, message: str, db: Session, model):
    # Fetch the patient data from the database
    patient = db.query(Patient).filter(Patient.id == user_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate the prompt with patient data
    prompt = (
        f"Patient Data:\n"
        f"Name: {patient.name}\nAge: {patient.age}\nPregnancies: {patient.pregnancies}\n"
        f"TT Vaccination: {patient.tt_vaccination}\nGestational Age: {patient.gestational_age} {patient.gestational_age_units}\n"
        f"Weight: {patient.weight} {patient.weight_unit}\nHeight: {patient.height} {patient.height_unit}\n"
        f"Blood Pressure: {patient.blood_pressure}\nAnemia: {patient.anemia}\nJaundice: {patient.jaundice}\n"
        f"Fetal Position: {patient.fetal_position}\nFetal Movement: {patient.fetal_movement}\nFetal Heartbeat: {patient.fetal_heartbeat}\n"
        f"Urine Test Albumin: {patient.urine_test_albumin}\nUrine Test Sugar: {patient.urine_test_sugar}\n"
        f"VDRL: {patient.vdrl}\nHRsAG: {patient.hrsag}\nHigh-Risk Pregnancy: {patient.high_risk_pregnancy}\n\n"
        f"Question: {message}"
    )
    print(prompt)

    # Generate a response using the model
    response = model.generate_content(prompt)
    reply = response.candidates[0].content.parts[0].text if response and response.candidates else "I'm unable to generate a response at the moment."

    # Store the chat history in Redis
    chat_key = f"pregchat:chat:{user_id}"
    redis_client = RedisSessionManager()  # Instantiate RedisSessionManager directly
    redis_client.rpush(chat_key, json.dumps({"question": message, "response": reply}))

    # Create a unique session ID for the user
    unique_id = str(uuid.uuid4())
    print(f"Unique session ID: {unique_id}")

    # Prepare the session data
    session_data = {
        "response": reply,
        "username": patient.name,
        "question": message  # Ensure the question is also stored in the session
    }

    # Create a permanent session for the user
    session_manager = RedisSessionManager()

    # Create the permanent session
    session_manager.create_permanent_session(str(user_id), session_data, unique_id)

    # Retrieve the most recent session for the user using timestamp sorting
    recent_session = session_manager.get_sessions_sorted_by_timestamp(str(user_id))

    return {
        "response": reply,
        "username": patient.name,
        "session_data": recent_session  # Add recent session data to the response
    }
