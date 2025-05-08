from pydantic import BaseModel, Field
from typing import Optional
from datetime import time

class SignupRequest(BaseModel):
    name: str
    age: int
    pregnancies: int
    tt_vaccination: str
    gestational_age: float
    gestational_age_units: str = Field(default="week")
    weight: float
    weight_unit: str = Field(default="kg")
    height: float
    height_unit: str = Field(default="cm")
    blood_pressure: str
    anemia: str
    jaundice: str
    fetal_position: str
    fetal_movement: str
    fetal_heartbeat: str
    urine_test_albumin: str
    urine_test_sugar: str
    vdrl: str
    hrsag: str
    high_risk_pregnancy: str
    password: str
    confirm_password: str

    class Config:
         from_attributes = True

class MedicineRequestSchema(BaseModel):
    patient_id: int
    medicine_name: str
    dosage: str
    frequency: str
    reminder_time: time  

    class Config:
        from_attributes = True 
# class MedicineRequest(BaseModel):
#     patient_id: int
#     medicine_name: str
#     dosage: str
#     frequency: str
#     reminder_time: str

# class FeedbackRequest(BaseModel):
#     user_id: int
#     feedback_text: str


