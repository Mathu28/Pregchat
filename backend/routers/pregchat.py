import os
from fastapi import APIRouter, Form, Depends, HTTPException, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy.orm import Session
from database import get_db
from models import Patient, User, MedicineRequest
import google.generativeai as genai
from dotenv import load_dotenv
import bcrypt
from schema import SignupRequest,MedicineRequestSchema
from typing import List
import re
import json
from service.chatbot_service import generate_chat_response
from service.redis_manager import RedisSessionManager
# Load environment variables
load_dotenv()

router = APIRouter()
templates = Jinja2Templates(directory="templates")

# Gemini AI Config
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
generation_config = {
    "temperature": 0.4,
    "top_p": 0.8,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash-exp",
    generation_config=generation_config,
    system_instruction=(
        "You are a professional medical assistant specializing in prenatal care.Shorter informative message"
    ),
)

# ==================== SIGNUP POST ENDPOINT ====================
@router.post("/signup", response_class=HTMLResponse)
def signup(
    request: Request,
    sign_requ: SignupRequest,  # Accept the Pydantic model
    db: Session = Depends(get_db)
):
    # Check if passwords match
    if sign_requ.password != sign_requ.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # Convert string inputs to booleans properly
    def str_to_bool(val: str) -> bool:
        return str(val).strip().lower() in ['true', '1', 'yes']

    high_risk_pregnancy_bool = str_to_bool(sign_requ.high_risk_pregnancy)
    urine_test_sugar_bool = str_to_bool(sign_requ.urine_test_sugar)

    # Auto-generate ID starting from 101
    last_patient = db.query(Patient).order_by(Patient.id.desc()).first()
    new_id = last_patient.id + 1 if last_patient else 101

    # Insert into Patient table
    patient = Patient(
        id=new_id,
        name=sign_requ.name,
        age=sign_requ.age,
        pregnancies=sign_requ.pregnancies,
        tt_vaccination=sign_requ.tt_vaccination,
        gestational_age=sign_requ.gestational_age,
        gestational_age_units=sign_requ.gestational_age_units or "week",
        weight=sign_requ.weight,
        weight_unit=sign_requ.weight_unit or "kg",
        height=sign_requ.height,
        height_unit=sign_requ.height_unit or "cm",
        blood_pressure=sign_requ.blood_pressure,
        anemia=sign_requ.anemia,
        jaundice=sign_requ.jaundice,
        fetal_position=sign_requ.fetal_position,
        fetal_movement=sign_requ.fetal_movement,
        fetal_heartbeat=sign_requ.fetal_heartbeat,
        urine_test_albumin=sign_requ.urine_test_albumin,
        urine_test_sugar=urine_test_sugar_bool,
        vdrl=sign_requ.vdrl,
        hrsag=sign_requ.hrsag,
        high_risk_pregnancy=high_risk_pregnancy_bool,
        password=sign_requ.password  # plaintext storage (recommend encrypting if used in auth)
    )
    db.add(patient)

    # Insert into User table with hashed password
    hashed_password = bcrypt.hashpw(sign_requ.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    user = User(id=new_id, username=sign_requ.name, password=hashed_password)
    db.add(user)

    db.commit()

    return JSONResponse({"message": f"Your Patient ID is {new_id}. Please use it to log in."})

# ==================== LOGIN ====================
@router.post("/login", response_class=HTMLResponse)
def login(
    user_id: int = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid user ID or password")

    return JSONResponse({"user_name": user.username, "user_id": user.id})

# ==================== CHAT ====================

@router.post("/chat")
def chat(
    user_id: int = Form(...),
    message: str = Form(...),
    db: Session = Depends(get_db)
):
    response = generate_chat_response(user_id=user_id, message=message, db=db, model=model)

    return response

@router.get("/medical_data/{user_id}")
def get_medical_data(user_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == user_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="User not found")
    return patient

@router.put("/medical_data/{user_id}")
def update_medical_data(user_id: int, updated_data: dict, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == user_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="User not found")

    for key, value in updated_data.items():
        if hasattr(patient, key):
            setattr(patient, key, value)
    db.commit()
    return {"message": "Medical data updated successfully"}
# ==================== RESOURCES ====================
@router.get("/resources")
def get_resources():
    # Predefined links
    resources = [
        {"type": "article", "title": "Medline Plus - Pregnancy", "link": "https://magazine.medlineplus.gov/topic/pregnancy"},
        {"type": "article", "title": "Cleveland Clinic - Pregnancy", "link": "https://my.clevelandclinic.org/health/articles/pregnancy"},
        {"type": "article", "title": "Kids Health - Pregnancy", "link": "https://kidshealth.org/en/parents/preg-health.html"},
        {"type": "article", "title": "BMC Pregnancy - Article", "link": "https://bmcpregnancychildbirth.biomedcentral.com/articles/10.1186/s12884-021-04213-6"},
        {"type": "article", "title": "Fetal Development - Cleveland Clinic", "link": "https://my.clevelandclinic.org/health/articles/7247-fetal-development-stages-of-growth"},
        {"type": "article", "title": "Wiley Online Library", "link": "https://onlinelibrary.wiley.com/journal/7097"},
        {"type": "video", "title": "Pregnancy Video - YouTube", "link": "https://www.youtube.com/watch?v=KNEGPOum4pU"},
        {"type": "video", "title": "Pregnancy Video - YouTube", "link": "https://www.youtube.com/watch?v=s-Xpa5UZAZs"},
        {"type": "video", "title": "Pregnancy Video - YouTube", "link": "https://www.youtube.com/watch?v=_dVuHFdUN0c"}
    ]

    return {"resources": resources}

# ==================== MEDICINE REMINDERS ====================

@router.get("/medicines/{user_id}")
def get_medicines(user_id: int, db: Session = Depends(get_db)):
    medicines = db.query(MedicineRequest).filter(MedicineRequest.patient_id == user_id).all()

    if not medicines:
        raise HTTPException(status_code=404, detail="No medicines found")

    return medicines

# Add a new medicine
@router.post("/medicines")
def add_medicine(med: MedicineRequestSchema, db: Session = Depends(get_db)):
    try:
        medicine = MedicineRequest(
            patient_id=med.patient_id,
            medicine_name=med.medicine_name,
            dosage=med.dosage,
            frequency=med.frequency,
            reminder_time=med.reminder_time
        )
        db.add(medicine)
        db.commit()
        return {"message": "Medicine added successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


@router.delete("/medicines/{medicine_id}")
def delete_medicine(medicine_id: int, db: Session = Depends(get_db)):
    medicine = db.query(MedicineRequest).filter(MedicineRequest.id == medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    
    db.delete(medicine)
    db.commit()
    return {"message": "Medicine deleted successfully"}

@router.post("/talk-to-baby")
def talk_to_baby(
    user_id: int = Form(...),
    message: str = Form(...),
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(Patient.id == user_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="User not found")

    # --- Step 1: Detect Mood from Mother's Message ---
    mood_prompt = (
        f"Analyze the mood of the following message from a pregnant mother and return only one word (e.g., happy, sad, anxious, calm, excited, tired, loved):\n\n"
        f"Message: {message}"
    )

    try:
        mood_response = model.generate_content(mood_prompt)
        detected_mood = "Calm"
        if mood_response and mood_response.candidates:
            detected_mood_raw = mood_response.candidates[0].content.parts[0].text.strip()
            # Sanitize/Normalize mood output
            detected_mood = detected_mood_raw.split()[0].capitalize()
    except Exception as e:
        detected_mood = "Calm"  # fallback on error

    # --- Step 2: Generate Baby's Response ---
    baby_prompt = (
        f"Imagine you are an unborn baby in the womb of your mother. Respond sweetly, lovingly, and emotionally to what she says.\n\n"
        f"Patient Info:\n"
        f"Name: {patient.name}\nGestational Age: {patient.gestational_age} {patient.gestational_age_units}\n\n"
        f"Mother's Message: {message}\n\n"
        f"Respond like a baby who loves their mom and is excited to meet her."
    )

    try:
        response = model.generate_content(baby_prompt)
        if response and response.candidates:
            baby_reply = response.candidates[0].content.parts[0].text.strip()
            return {
                "baby_response": baby_reply,
                "detected_mood": detected_mood,
                "username": patient.name
            }
        else:
            return {
                "baby_response": "I'm here with you, Mommy. I can't wait to meet you!",
                "detected_mood": detected_mood,
                "username": patient.name
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating baby response: {str(e)}")
from fastapi.responses import JSONResponse

@router.get("/partner-tips/{user_id}")
def partner_tips(user_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == user_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="User not found")
    
    prompt = (
        f"Suggest emotional, physical, and practical support ideas for the partner of a pregnant woman named {patient.name}, "
        f"who is {patient.gestational_age} {patient.gestational_age_units} pregnant."
    )

    try:
        response = model.generate_content(prompt)
        if response and response.candidates:
            return {"partner_suggestions": response.candidates[0].content.parts[0].text.strip()}
        else:
            return {"partner_suggestions": "Just be kind, helpful, and emotionally present."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.get("/trimester-checklist/{user_id}")
def trimester_checklist(user_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == user_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="User not found")

    gestational_age = int(patient.gestational_age)
    trimester = (
        "First Trimester" if gestational_age <= 12 else
        "Second Trimester" if gestational_age <= 28 else
        "Third Trimester"
    )

    prompt = (
        f"Give a simple checklist for {trimester} pregnancy. Include doctor visits, symptoms to track, nutrition, and self-care tips."
    )

    try:
        response = model.generate_content(prompt)
        if response and response.candidates:
            return {"trimester": trimester, "checklist": response.candidates[0].content.parts[0].text.strip()}
        else:
            return {"trimester": trimester, "checklist": "Follow regular checkups and a healthy routine."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/emergency-labor-checklist")
async def get_labor_checklist():
    """
    Returns a list of essential items to carry to the hospital during labor.
    """
    checklist_items = [
        {"item": "Identification and Insurance Information"},
        {"item": "Birth Plan (if you have one)"},
        {"item": "Comfortable Clothes for Labor (e.g., loose gown)"},
        {"item": "Socks (labor ward can be cold)"},
        {"item": "Slippers or Comfortable Shoes"},
        {"item": "Lip Balm (for dry lips during labor)"},
        {"item": "Hair Ties or Clips"},
        {"item": "Snacks and Drinks for Labor (as allowed by your doctor)"},
        {"item": "Phone and Charger"},
        {"item": "Camera or Video Recorder (if desired)"},
        {"item": "Toiletries (toothbrush, toothpaste, face wash, etc.)"},
        {"item": "Change of Clothes for After Birth"},
        {"item": "Nursing Bra (if planning to breastfeed)"},
        {"item": "Nursing Pads"},
        {"item": "Comfortable Underwear (consider disposable ones)"},
        {"item": "Going-home Outfit for Baby"},
        {"item": "Car Seat (installed in your vehicle)"},
        {"item": "Baby Blanket"},
    ]
    return checklist_items
@router.get("/sessions/{user_id}")
def get_user_sessions(user_id: int, db: Session = Depends(get_db)):
    """
    Retrieve all session metadata (session_id, title, timestamp) for a given user_id from Redis.
    """
    redis_manager = RedisSessionManager()
    
   
    sessions = redis_manager.get_sessions_sorted_by_timestamp(str(user_id))
       
    return {"sessions": sessions}

@router.get("/session/{session_key}")
def get_session_details(session_key: str, db: Session = Depends(get_db)):
    """
    Retrieve the full details of a specific session using the session_key.
    """
    redis_manager = RedisSessionManager()
    
    try:
        # Get session data from Redis using the session_key
        session_data = redis_manager.r.get(session_key)
        if not session_data:
            raise HTTPException(status_code=404, detail="Session not found.")
        
        session_data = json.loads(session_data)

        title = session_data.get("title", "Untitled Session")
        username = session_data.get("username", "Unknown")
        question = session_data.get("question", "No question recorded")
        answer = session_data.get("response", "No response")
        timestamp = session_data.get("creation_timestamp")

        # Return the full session details
        return {
            "session_key": session_key,
            "title": title,
            "username": username,
            "question": question,
            "answer": answer,
            "timestamp": timestamp
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching session details: {str(e)}")

