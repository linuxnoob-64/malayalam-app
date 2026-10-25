from http.server import BaseHTTPRequestHandler
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
import json
import os

from pathlib import Path
from dotenv import dotenv_values, load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = PROJECT_ROOT / ".env.local"

if not os.getenv("VERCEL"):
    load_dotenv(ENV_FILE, override=True)

max_turns = 8

# Response Schema
class LessonResponse(BaseModel):
    script: str = Field(description="Malayalam script (Malayalam Lipi) of the roleplay character's response")
    romanized: str = Field(description="Manglish romanized text of the roleplay character's response. IN THE LATIN ALPHABET")
    english: str = Field(description="Natural English translation of the roleplay character's response")
    hint_word: str = Field(description="First good word of a good reply by the user in Malayalam script (1st hint)")
    hint_full_romanized: str = Field(description="Full phrase of a good reply by the user in Manglish (2nd hint)")
    hint_full_english: str = Field(description="English translation of the hint (3rd hint)")
    grade: int = Field(
        ge=0,
        le=5,
        description="""
        Integer grade of the user's latest input from 0 to 5.

        5: Natural, grammatically correct Malayalam that is relevant to
        the conversation and responds appropriately to the context.
        Humor, sarcasm, and playful answers are acceptable when relevant.

        4: Relevant and understandable Malayalam with minor grammatical
        errors, awkward phrasing, or slightly unnatural word choices.

        3: The response is on-topic and understandable, but has noticeable
        grammatical or vocabulary errors, or only partially addresses
        the conversational context.

        2: The response is only partly relevant or understandable, with
        significant language errors that make the intended meaning
        difficult to interpret.

        1: The response has very little understandable Malayalam or bears
        little meaningful relation to the conversation.

        0: Gibberish, no meaningful attempt to communicate, or a response in a language other than Malayalam or understandable
        romanized Malayalam.

        GRADING RULES:
        - Accept both Malayalam script and understandable romanized Malayalam.
        - Grade only the user's latest input.
        - Evaluate grammatical accuracy, vocabulary, naturalness, comprehensibility, and relevance to the ongoing conversation.
        - A grammatically correct but completely unrelated response must not receive a 5.
        - A humorous, sarcastic, or absurd response can receive a 5 if it is linguistically correct and relevant to the conversation.
        - Judge relevance in context, not by whether the user agrees with the character or gives the expected answer.
        - Do not penalize valid colloquial or regional Malayalam.
        - Deduct points proportionately for language errors and irrelevance.
        - Do not inflate grades merely to be encouraging.
        - Provide an accurate, specific rationale for the assigned grade.
        - Always reply in Malayalam. Never switch to English or offer to speak English, even if the user struggles. If they seem lost, use simpler Malayalam.
        - hint_word, hint_full_romanized and hint_full_english are what the USER could say back to you next, in the user's voice, never your own line.
        - A reply in English or any other language other than Malayalam or Manglish romanization is an automatic 0; this overrides relevance
        - romanized fields use Latin letters only, no Malayalam script.
        """
    )
    rationale: str = Field(description="A 1-sentence explanation of why you gave the assigned grade of the user's input and suggestions on how to improve; refer to the user as 'you'")


def generate_ai_response(user_message,scenario,turn,chat_history):
    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
    prompt = f"""
            You are an authentic Malayalam roleplay agent participating in a multi-turn conversation.

            ### CONTEXT & VARIABLES
            - Current Turn: {turn} of {max_turns}
            - Scenario: {scenario}
            - Recent Chat History: {chat_history}
            - Latest User Message: "{user_message}"

            ### ROLE & INSTRUCTIONS
            1. Character Persona & Language:
            - Stay fully in character according to the scenario.
            - Reply in natural, conversational Malayalam script (മലയാളം).
            - Maintain a natural dialogue flow that fits the ongoing history.

            2. Turn & Pacing Control:
            {"- TURN LIMIT REACHED (Turn " + str(turn) + "/" + str(max_turns) + "): Wrap up the roleplay naturally in this final response. Give a definitive closing statement as the character. DO NOT ask any follow-up questions." if turn >= max_turns else "- IN-PROGRESS TURN (Turn " + str(turn) + "/" + str(max_turns) + "): Keep the conversation active, meaningful, and engaging. DO NOT try to end or wrap up the scenario yet. End your response with a natural question or conversational prompt to encourage the user to reply."}

            3. Output Format:
            - Output valid JSON only. Do not wrap in markdown code blocks or add extra text outside the JSON object.
            """

    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt,
            config=types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(
                    thinking_level="high"
                ),
                response_mime_type="application/json",
                response_schema=LessonResponse,
            ),
        )
        if response.parsed is None:
            raise ValueError("Gemini returned no valid parsed response")

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
            turn  = data.get("turn")
            chat_history = data.get("chat_history")

            if not isinstance(user_message, str) or not user_message.strip():
                self.send_json(400, {"error": "user_message must be a non-empty string"})
                return

            if not isinstance(scenario, str) or not scenario.strip():
                self.send_json(400, {"error": "scenario must be a non-empty string"})
                return

            if not isinstance(turn, str) or not turn.strip():
                self.send_json(400, {"error": "turn must be a non-empty string"})
                return
            
            if not isinstance(chat_history, str) or not chat_history.strip():
                self.send_json(400, {"error": "chat_history must be a non-empty string"})
                return

            result = generate_ai_response(user_message,scenario,turn,chat_history)

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
    turn = 1
    grades = []
    chat_history = []
    # Test scenario: Uncle asking about college
    test_scenario = "Do you speak Malayalam? An uncle to the user (his niece or nephew) asking about school and studies. First turn: Mone, ninte vidyālayam enganeyundu? Padhanamokke nannāyi pokunnundo?" 
    # response1 = "Athe ammāvā, ente paṭhanam nannāyi pokunnundu. Pareekshaykkuvēṇṭi nannāyi paṭhikkunnundu."
    print("Scenario: " + test_scenario)

    while turn <= max_turns:
        test_user_message = input("Enter text: ")

        print(f"\nTurn: {turn}/{max_turns}")
        print(f"User message sent: {test_user_message}\n")
        chat_history.append(test_user_message)

        if test_user_message == "exit":
            break

        print("Calling Gemini...")

        result = generate_ai_response(test_user_message, test_scenario, turn, chat_history)

        if result:
            print("\n--- Parsed AI Response Object ---")
            print(f"Malayalam : {result.script}")
            print(f"Manglish         : {result.romanized}")
            print(f"English          : {result.english}")
            print(f"Hint 1 (Word)    : {result.hint_word}")
            print(f"Hint 2 (Manglish): {result.hint_full_romanized}")
            print(f"Hint 3 (English) : {result.hint_full_english}")
            print(f"Grade (0-5)      : {result.grade}")
            print(f"Rationale        : {result.rationale}\n")
        else:
            print("Something went wrong...")

        turn+=1
        grades.append(result.grade)
        chat_history.append(result.romanized)

    print("\n--- Results ---")
    avg_grade = 0
    for i, grade in enumerate(grades):
        avg_grade += grade*20
        print(f"Response {i+1}, \"{chat_history[2*i]}\": {grade*20}")

    print("\n--- Final Grade ---")

    avg_grade /= len(grades)
    print(f"{avg_grade} out of 100%")
