from google.adk import Agent
from .prompts import INSTRUCTION

from RunPlanner.sub_agents.trainer.agent import trainer_agent
from RunPlanner.sub_agents.planner.agent import planner_agent
from RunPlanner.sub_agents.race_finder.agent import race_finder_agent
from RunPlanner.sub_agents.race_logistics.agent import race_logistics_agent

root_agent = Agent(
    name="Orchestrator_Agent",
    model="gemini-2.0-flash",
    instruction=INSTRUCTION,
    sub_agents=[
        trainer_agent,
        planner_agent,
        race_finder_agent,
        race_logistics_agent
    ],

)