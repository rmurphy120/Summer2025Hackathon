from google.adk import Agent
from .prompts import INSTRUCTION, DESCRIPTION
from .tools import states_within_distance, scrape_race_events

race_finder_agent = Agent(
    name="Race_Finder_Agent",
    model="gemini-2.0-flash",
    instruction=INSTRUCTION,
    description=DESCRIPTION,
    tools=[
        states_within_distance,
        scrape_race_events,
        # MCPToolset(
        #     connection_params=StdioServerParameters(
        #         command="npx",
        #         args=[
        #             "-y",
        #             "firecrawl-mcp",
        #         ],
        #         env={
        #             "FIRECRAWL_API_KEY": "•••••••••••••••••••••••"
        #         }
        #     ),
        # ),
    ],
)