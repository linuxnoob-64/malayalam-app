from http.server import BaseHTTPRequestHandler
from google import genai
from pydantic import BaseModel, Field
import json
import os

from pathlib import Path
from dotenv import dotenv_values, load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = PROJECT_ROOT / ".env.local"

if not os.getenv("VERCEL"):
    load_dotenv(ENV_FILE, override=True)

# Response Schema
class LessonResponse(BaseModel):
    script: str = Field(description="Malayalam script text")
    manglish: str = Field(description="Manglish romanized text")
    english: str = Field(description="English translation")
    hint_word: str = Field(description="First good word of a good reply (1st hint)")
    hint_full_manglish: str = Field(description="Full phrase in Manglish (2nd hint)")
    hint_full_english: str = Field(description="Full phrase + English translation(3rd hint)")
    grade: int = Field(
        ge=0,
        le=5,
        description="""
        Integer grade of the user input from 0 to 5, where:
        5 is the natural and correct response, 
        4 is correct but not natural, 
        3 is technically correct but not natural or grammatically incorrect, 
        2 is a good attempt with noticeable mistakes,
        1 is a poor attempt but recognisable effort,
        0 is complete gibberish, like a response in English or a different language other than Malayalam or off topic completely
        """
    )
    rationale: str = Field(description="A 1-sentence explanation of why you gave the assigned grade and suggestions on how to improve")


def generate_ai_response(user_message,scenario):
    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
    prompt = f"User said: {user_message}. Scenario: {scenario}. Reply in character and output structured JSON."

    try:
        response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents = prompt,
        config={
            'system_instruction': scenario,
            'response_mime_type': 'application/json',
            'response_schema': LessonResponse,
        },
        )
        return response.parsed
    except Exception as e:
        return f"Error: {str(e)}, Please try again later."

class handler(BaseHTTPRequestHandler):
    def send_json(self, status_code, data):
        response_body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type","application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(response_body)))
        self.end_headers()
        self.wfile.write(response_body)

    def do_POST(self):
        try:
            content_length = int(self.headers.get("Content-Length", "0"))

            if content_length <= 0 or content_length > 100000:
                self.send_json(400, {"error": "Invalid request size"})
                return

            body = self.rfile.read(content_length)
            data = json.loads(body.decode("utf-8"))

            if not isinstance(data, dict):
                self.send_json(400, {"error": "JSON body must be an object"})
                return

            user_message  = data.get("user_message")
            scenario = data.get("scenario")

            if not isinstance(user_message, str) or not user_message.strip():
                self.send_json(400, {"error": "user_message must be a non-empty string"})
                return

            if not isinstance(scenario, str) or not scenario.strip():
                self.send_json(400, {"error": "scenario must be a non-empty string"})
                return

            result = generate_ai_response(user_message,scenario)

            if isinstance(result,str):
                self.send_json(500, {"error": result})
                return

            self.send_json(200, result.model_dump())

        except (json.JSONDecodeError, UnicodeDecodeError):
            self.send_json(400, {"error": "Invalid JSON request"})

        except (ValueError, TypeError):
            self.send_json(400, {"error": "Invalid request data"})

        except Exception:
            self.send_json(500, {"error": "Internal server error"})

    def do_GET(self):
        self.send_json(200, {"message": "Backend is running"})


# --- LOCAL TEST ---
if __name__ == "__main__":
    # Test scenario: Uncle asking about college
    test_scenario = "Do you speak Malayalam? An uncle asking about college and studies."
    test_user_message = "No, I do not speak Malayalam"#"Enikku sukhamanu, njan college-il padikkunnu."

    print(f"Testing scenario: {test_scenario}")
    print(f"User message sent: {test_user_message}\n")
    print("Calling Gemini...")

    result = generate_ai_response(test_user_message, test_scenario)

    if result:
        print("\n--- Parsed AI Response Object ---")
        print(f"Malayalam Script : {result.script}")
        print(f"Manglish         : {result.manglish}")
        print(f"English          : {result.english}")
        print(f"Hint 1 (Word)    : {result.hint_word}")
        print(f"Hint 2 (Manglish): {result.hint_full_manglish}")
        print(f"Hint 3 (English) : {result.hint_full_english}")
        print(f"Grade (0-5)      : {result.grade}")
        print(f"Rationale        : {result.rationale}")

