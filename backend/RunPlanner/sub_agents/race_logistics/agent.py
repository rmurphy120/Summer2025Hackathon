from google.adk import Agent
from .prompts import INSTRUCTION

race_logistics_agent = Agent(
    name="Race_Logistics",
    model="gemini-2.0-flash",
    instruction=INSTRUCTION,
)