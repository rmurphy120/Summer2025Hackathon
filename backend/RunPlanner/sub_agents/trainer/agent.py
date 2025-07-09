from google.adk import Agent
from .prompts import INSTRUCTION

trainer_agent = Agent(
    name="Trainer_Agent",
    model="gemini-2.0-flash",
    instruction=INSTRUCTION,
)