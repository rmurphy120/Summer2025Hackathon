from google.adk import Agent
from .prompts import INSTRUCTION

race_finder_agent = Agent(
    name="Race_Finder",
    model="gemini-2.0-flash",
    instruction=INSTRUCTION,
)