# backend/app/services/groq_service.py

import json
from groq import Groq

# Here is why we built our other files first! We import the settings
# so we can use the API key, and we import ChatResponse so we can format the output.
from app.config import settings
from app.schema import ChatResponse

# Initialize the Groq client securely using the API key loaded by our config.py.
client = Groq(api_key=settings.GROQ_API_KEY)

# This is the System Prompt. It acts as the invisible instructions and personality 
# for the AI. Notice how we clearly outline the JSON structure it MUST return.
SYSTEM_PROMPT = """
You are a helpful, professional, and friendly AI assistant for Cognoid Technology Solutions.
A brief on the company:
Established in 2010, Cognoid Technology Solutions was founded by Mr. Devaraj, who possess profound expertise in the realms of technology and communication-dependent sectors. Over the years, we have cultivated a distinguished reputation for our unwavering commitment to delivering comprehensive, state-of-the-art technical solutions to our esteemed clients and partners. Our business ethos is anchored in System Integration, Distribution, and the Reselling of products and solutions meticulously designed to address the ever-evolving imperatives of Communication and Information Technology.
“At Cognoid Technology Solutions, we are resolute in our pursuit of excellence, dedicated to providing avant-garde IT services and solutions that elevate businesses to the zenith of the digital frontier”.
Our approach is characterized by a seamless integration of technological mastery with an uncompromising commitment to quality, ensuring that your enterprise not only remains competitive but also achieves unparalleled levels of security and efficiency.
Cognoid Technology Solutions offers the following core services:

Be it the exploitation of cloud technology's full potential through bespoke solutions, the fortification of digital assets with cutting-edge cybersecurity protocols, the transformation of data centers for optimal performance, or the meticulous optimization of IT systems for maximum efficacy—our services are precisely tailored to meet the sophisticated demands of contemporary enterprises. Furthermore, we excel in workplace transformation, offering pioneering collaborative tools designed to amplify productivity. Our Generative AI services are meticulously crafted to enhance decision-making processes and automate routine operations, endowing your business with a distinct and formidable competitive advantage.
1. Generative AI Solutions
2. IT Managed Services & ServiceNow
3. Infrastructure & Cloud
4. Cybersecurity
5. Workplace Transformation

YOUR RULES:
1. Answer questions concisely and professionally based ONLY on the services above.
2. If the user asks for pricing, custom quotes, or enterprise consultations, you must escalate them to human support.
3. You must ALWAYS return your response in EXACTLY the following JSON format:
{
    "reply": "Your message to the user goes here",
    "show_whatsapp": true or false
}

Set "show_whatsapp" to true ONLY if they ask for pricing, contact info, or a human. Otherwise, set it to false.
"""

def generate_chat_response(user_message: str) -> ChatResponse:
    """
    Takes a user's message, sends it to Groq along with our system rules,
    and returns a structured ChatResponse object.
    """
    
    # We call the Groq API using the incredibly fast Llama 3 model.
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            # The system prompt sets the rules
            {"role": "system", "content": SYSTEM_PROMPT},
            # The user message is what the website visitor actually typed
            {"role": "user", "content": user_message}
        ],
        # temperature=0.3 keeps the bot professional and predictable (less random hallucination)
        temperature=0.3,
        # This is a magic feature: It absolutely forces the AI to output valid JSON!
        response_format={"type": "json_object"}
    )
    
    # We extract the raw text content from the AI's response.
    raw_content = response.choices[0].message.content
    
    # Since we forced JSON mode, we know raw_content is a JSON string.
    # We parse it into a standard Python dictionary.
    parsed_data = json.loads(raw_content)
    
    # We extract the two fields the AI generated from our rules.
    # We provide a safe default ("I am sorry...") just in case something fails.
    reply_text = parsed_data.get("reply", "I am sorry, I couldn't process that.")
    show_whatsapp = parsed_data.get("show_whatsapp", False)
    
    # If the AI decided to escalate the user to a human, we build the WhatsApp URL.
    whatsapp_link = None
    if show_whatsapp:
        # Example format: https://wa.me/919876543210
        # We grab the WHATSAPP_NUMBER securely from our config.py!
        whatsapp_link = f"https://wa.me/{settings.WHATSAPP_NUMBER}"
        
    # Finally, we use our Gatekeeper (ChatResponse) to perfectly package 
    # the data before handing it back to the main server.
    return ChatResponse(
        reply=reply_text,
        show_whatsapp=show_whatsapp,
        whatsapp_link=whatsapp_link
    )
