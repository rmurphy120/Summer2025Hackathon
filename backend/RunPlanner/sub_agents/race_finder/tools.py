import math
import requests
from typing import List, Dict
import argparse
import json
import os
from dotenv import load_dotenv
from firecrawl import FirecrawlApp
from bs4 import BeautifulSoup
import re
from datetime import datetime
import time

load_dotenv()

# US state centroids and codes
US_STATE_CENTROIDS = [
    {"code": "AL", "lat": 32.806671, "lon": -86.791130},
    {"code": "AK", "lat": 61.370716, "lon": -152.404419},
    {"code": "AZ", "lat": 33.729759, "lon": -111.431221},
    {"code": "AR", "lat": 34.969704, "lon": -92.373123},
    {"code": "CA", "lat": 36.116203, "lon": -119.681564},
    {"code": "CO", "lat": 39.059811, "lon": -105.311104},
    {"code": "CT", "lat": 41.597782, "lon": -72.755371},
    {"code": "DE", "lat": 39.318523, "lon": -75.507141},
    {"code": "FL", "lat": 27.766279, "lon": -81.686783},
    {"code": "GA", "lat": 33.040619, "lon": -83.643074},
    {"code": "HI", "lat": 21.094318, "lon": -157.498337},
    {"code": "ID", "lat": 44.240459, "lon": -114.478828},
    {"code": "IL", "lat": 40.349457, "lon": -88.986137},
    {"code": "IN", "lat": 39.849426, "lon": -86.258278},
    {"code": "IA", "lat": 42.011539, "lon": -93.210526},
    {"code": "KS", "lat": 38.526600, "lon": -96.726486},
    {"code": "KY", "lat": 37.668140, "lon": -84.670067},
    {"code": "LA", "lat": 31.169546, "lon": -91.867805},
    {"code": "ME", "lat": 44.693947, "lon": -69.381927},
    {"code": "MD", "lat": 39.063946, "lon": -76.802101},
    {"code": "MA", "lat": 42.230171, "lon": -71.530106},
    {"code": "MI", "lat": 43.326618, "lon": -84.536095},
    {"code": "MN", "lat": 45.694454, "lon": -93.900192},
    {"code": "MS", "lat": 32.741646, "lon": -89.678696},
    {"code": "MO", "lat": 38.456085, "lon": -92.288368},
    {"code": "MT", "lat": 46.921925, "lon": -110.454353},
    {"code": "NE", "lat": 41.125370, "lon": -98.268082},
    {"code": "NV", "lat": 38.313515, "lon": -117.055374},
    {"code": "NH", "lat": 43.452492, "lon": -71.563896},
    {"code": "NJ", "lat": 40.298904, "lon": -74.521011},
    {"code": "NM", "lat": 34.840515, "lon": -106.248482},
    {"code": "NY", "lat": 42.165726, "lon": -74.948051},
    {"code": "NC", "lat": 35.630066, "lon": -79.806419},
    {"code": "ND", "lat": 47.528912, "lon": -99.784012},
    {"code": "OH", "lat": 40.388783, "lon": -82.764915},
    {"code": "OK", "lat": 35.565342, "lon": -96.928917},
    {"code": "OR", "lat": 44.572021, "lon": -122.070938},
    {"code": "PA", "lat": 40.590752, "lon": -77.209755},
    {"code": "RI", "lat": 41.680893, "lon": -71.511780},
    {"code": "SC", "lat": 33.856892, "lon": -80.945007},
    {"code": "SD", "lat": 44.299782, "lon": -99.438828},
    {"code": "TN", "lat": 35.747845, "lon": -86.692345},
    {"code": "TX", "lat": 31.054487, "lon": -97.563461},
    {"code": "UT", "lat": 40.150032, "lon": -111.862434},
    {"code": "VT", "lat": 44.045876, "lon": -72.710686},
    {"code": "VA", "lat": 37.769337, "lon": -78.169968},
    {"code": "WA", "lat": 47.400902, "lon": -121.490494},
    {"code": "WV", "lat": 38.491226, "lon": -80.954570},
    {"code": "WI", "lat": 44.268543, "lon": -89.616508},
    {"code": "WY", "lat": 42.755966, "lon": -107.302490},
]

def haversine(lat1, lon1, lat2, lon2):
    R = 3958.8  # Earth radius in miles
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def states_within_distance(lat: float, lon: float, distance_miles: float) -> list[str]:
    """
    Given a latitude, longitude, and distance in miles, returns a list of US state two-letter codes within that distance.
    All parameters are explicitly typed for compatibility with automatic function calling.
    """
    result = []
    for state in US_STATE_CENTROIDS:
        d = haversine(lat, lon, state["lat"], state["lon"])
        if d <= distance_miles:
            result.append(state["code"])
    return result

def scrape_race_events(state: str, from_date: str, to_date: str) -> List[Dict]:
    """
    Scrape race events from runningintheusa.com for a given state and date range using Firecrawl API and BeautifulSoup for HTML parsing.
    dates should be formated MM-DD-YYYY, and the state should be the two-letter abbreviation (e.g., CA for California)
    """
    api_key = os.environ.get('FIRECRAWL_API_KEY')
    if not api_key:
        raise RuntimeError('FIRECRAWL_API_KEY environment variable not set.')
    app = FirecrawlApp(api_key)
    base_url = "https://runningintheusa.com/classic/list/{state}/{from_date}-to-{to_date}/page-{page}"
    events = []
    page = 1
    while True:
        url = base_url.format(state=state, from_date=from_date, to_date=to_date, page=page)
        print(f"Scraping URL: {url}")
        response = app.scrape_url(
            url=url,
            formats=['html'],
            only_main_content=True,
            parse_pdf=False,
            max_age=14400000
        )
        html = response.html.get('html', '') if isinstance(response.html, dict) else response.html
        soup = BeautifulSoup(html, 'html.parser')
        table = soup.find('table')
        if not table:
            break
        rows = table.find_all('tr')
        if len(rows) <= 1:
            break
        for tr in rows[1:]:  # skip header
            tds = tr.find_all('td')
            if len(tds) < 4:
                continue
            # Parse date to MM-DD-YYYY format
            date_raw = tds[1].get_text(" ", strip=True)
            # Example: 'Jul 27, 2025 Sunday' or 'Jul 27, 2025'
            date_match = re.match(r"([A-Za-z]{3,}) (\d{1,2}), (\d{4})", date_raw)
            if date_match:
                month_str, day_str, year_str = date_match.groups()
                try:
                    date_obj = datetime.strptime(f"{month_str} {day_str} {year_str}", "%b %d %Y")
                except ValueError:
                    date_obj = datetime.strptime(f"{month_str} {day_str} {year_str}", "%B %d %Y")
                date_fmt = date_obj.strftime("%m-%d-%Y")
            else:
                date_fmt = date_raw  # fallback if parsing fails
            name_block = tds[2].get_text("\n", strip=True)
            name = name_block
            distance = ""
            if "\n" in name_block:
                parts = name_block.split("\n")
                name = parts[0]
                if len(parts) > 1:
                    distance = parts[1]
            # Get event URL from the 'More Information' link
            more_info_a = tds[2].find('a', href=True)
            event_url = ""
            if more_info_a:
                event_url = more_info_a['href']
                if event_url.startswith("/"):
                    event_url = f"https://www.runningintheusa.com{event_url}"
            location = tds[3].get_text(strip=True)
            events.append({
                "name": name,
                "date": date_fmt,
                "location": location,
                "distance": distance,
                "url": event_url
            })
        # Check if the next page exists by looking for the next page number in the HTML
        next_page_str = f"page-{page + 1}"
        if next_page_str not in html:
            break
        page += 1
        time.sleep(6)  # Sleep 6 seconds to stay under 10 requests per minute
    return events

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Scrape race events from runningintheusa.com")
    parser.add_argument('--state', type=str, required=True, help='State abbreviation (e.g., MO)')
    parser.add_argument('--from_date', type=str, required=True, help='Start date in MM-DD-YYYY format')
    parser.add_argument('--to_date', type=str, required=True, help='End date in MM-DD-YYYY format')
    args = parser.parse_args()

    events = scrape_race_events(args.state.upper(), args.from_date, args.to_date)
    print(json.dumps(events, indent=2))