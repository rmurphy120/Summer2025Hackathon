from google.adk import Agent
from .prompts import INSTRUCTION

timeline_estimator_agent = Agent(
    name="Timeline_Estimator_Agent",
    model="gemini-2.0-flash",
    instruction=INSTRUCTION,
)