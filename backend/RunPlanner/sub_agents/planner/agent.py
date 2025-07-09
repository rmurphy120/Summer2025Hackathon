from google.adk import Agent
from .prompts import INSTRUCTION

planner_agent = Agent(
    name="Planner_Agent",
    model="gemini-2.0-flash",
    instruction=INSTRUCTION,
)