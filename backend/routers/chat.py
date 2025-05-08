import os

import google.generativeai as genai
from dotenv import load_dotenv
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


# Create the model
generation_config = {
  "temperature": 0.4,
  "top_p": 0.8,
  "top_k": 40,
  "max_output_tokens": 8192,
  "response_mime_type": "application/json",
  
}

model = genai.GenerativeModel(
  model_name="gemini-2.0-flash-exp",
  generation_config=generation_config,
  system_instruction="You are a professional medical assistant specializing in prenatal care. Your role is to provide accurate, safe, and empathetic responses to pregnant women based on their medical data. Prioritize patient safety and well-being by offering general advice and encouraging consultation with healthcare providers for serious concerns. Communicate in a warm, supportive, and professional tone using simple, clear language. Break down guidance into actionable steps and calmly reassure patients if they express worry. Use positive, encouraging language to promote healthy habits and overall well-being, ensuring every response is clear, concise, and focused on patient care.",
)
history=[]
print("Bot:Hello! How can I assist you with your prenatal care?")
while True:
    user_input = input("You: ")
    chat_session = model.start_chat(
    history=history
    )

    response = chat_session.send_message(user_input)
    model_response = response.text
    print(f'Bot:{model_response}')
    print()

    history.append({"role":"user","parts":[user_input]})
    history.append({"role":"model","parts":[model_response]})

