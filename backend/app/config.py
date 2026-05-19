
    # Import BaseSettings from pydantic_settings.
    # Pydantic is a powerful data validation library. BaseSettings specifically
    # helps us read environment variables from a .env file and validate their types.
from pydantic_settings import BaseSettings

    # We create a class named Settings that inherits from BaseSettings.
    # By inheriting from BaseSettings, this class automatically knows how to 
    # look into your environment variables and the .env file for these specific names.
class Settings(BaseSettings):
        
        # Define GROQ_API_KEY as a string (str).
        # Since we do not provide a default value (like = "default_key"), Pydantic 
        # knows this variable is STRICTLY REQUIRED. If it is missing in the .env file,
        # the server will refuse to start and give a clear error message.
    GROQ_API_KEY: str
        
        # Define WHATSAPP_NUMBER as a string (str). 
        # It must be a string because phone numbers can have leading zeros, and we just 
        # need it to build the "wa.me/9962373399" URL later. This is also strictly required.
    WHATSAPP_NUMBER: str
        
        # Define FRONTEND_URL as a string.
        # We give it a default value of "http://localhost:5173" (the standard Vite React port).
        # If the .env file doesn't have it, it will safely fall back to this default.
        # We will use this in main.py to configure CORS securely.
    FRONTEND_URL: str = "http://localhost:5173"
        
        # The Config class inside Settings is a special subclass that tells Pydantic 
        # the "rules" on how to behave.
    class Config:
            # We explicitly tell it to look for a file named ".env" to find our secrets.
            # When you run the FastAPI app, it will read that file and map the values 
            # to the variables we defined above.
        env_file = ".env"

    # Here, we instantiate (create a usable object of) the Settings class.
    # We store it in a variable called `settings`. 
    # This `settings` object is what we will import into other files (like main.py) 
    # to access our keys securely. For example: settings.GROQ_API_KEY
settings = Settings()
