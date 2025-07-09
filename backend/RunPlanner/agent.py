from google.adk import Agent
from .prompts import INSTRUCTION

from RunPlanner.sub_agents.trainer.agent import trainer_agent

root_agent = Agent(
    name="Orchestrator_Agent",
    model="gemini-2.0-flash",
    instruction=INSTRUCTION,
    sub_agents=[
        trainer_agent,
        # Add other sub-agents here as needed
    ],

)