from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey,Time
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Patient(Base):
    __tablename__ = "patient_data"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    pregnancies = Column(Integer)
    tt_vaccination = Column(String)
    gestational_age = Column(Float)
    gestational_age_units = Column(String)  
    weight = Column(Float)
    weight_unit = Column(String)
    height = Column(Float)
    height_unit = Column(String)  
    blood_pressure = Column(String)
    anemia = Column(String)  
    jaundice = Column(String) 
    fetal_position = Column(String)  
    fetal_movement = Column(String) 
    fetal_heartbeat = Column(Integer) 
    urine_test_albumin = Column(String) 
    urine_test_sugar = Column(Boolean)  
    vdrl = Column(String)  
    hrsag = Column(String)
    high_risk_pregnancy = Column(Boolean)
    password = Column(String, nullable=False)
    medicines = relationship("MedicineRequest", back_populates="patient", cascade="all, delete", passive_deletes=True)



class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    message = Column(String, nullable=False)
    status = Column(String, default="pending")  



class MedicineRequest(Base):
    __tablename__ = "medicine_requests"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patient_data.id", ondelete="CASCADE"), nullable=False)
    medicine_name = Column(String, nullable=False)
    dosage = Column(String, nullable=False)
    frequency = Column(String, nullable=False)
    reminder_time = Column(Time, nullable=False)

    patient = relationship("Patient", back_populates="medicines")

