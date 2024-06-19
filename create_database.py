import requests
from bs4 import BeautifulSoup
import wikipediaapi
from geopy.geocoders import Nominatim
import csv
import os
import sqlite3

csvFile = "countries.csv"
geolocator = Nominatim(user_agent="metern")

failed = []

countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burma",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Democratic Republic of the Congo",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Holy See",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine State",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States of America",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
]


def getFunFact(country_name):
    # Initialize the wikipedia-api
    wiki_wiki = wikipediaapi.Wikipedia("Data Scraper", "en")

    # Get the Wikipedia page for the given country
    page = wiki_wiki.page(country_name)

    # Check if the page exists
    if not page.exists():
        print(f"Sorry, no Wikipedia page found for {country_name}.")
        return

    # Try to extract the introduction section as a fun fact
    fun_fact = page.summary.split("\n")[0]

    return fun_fact


def getEntry(entry, soup: BeautifulSoup):
    return soup.find("td", string=f" {entry} ").find_next_sibling("td").get_text()


def createCountryEntry(country):
    # URL of the Wikipedia page containing the list of countries
    url = f"https://www.countryreports.org/country/{''.join(country.split())}.htm"

    # Fetch the content of the page
    response = requests.get(url)
    strip = " ".join(response.text.split())

    soup = BeautifulSoup(strip, "html.parser")

    try:
        capital = getEntry("Capital", soup)
        population = getEntry("Population", soup)
        location = getEntry("Location", soup)
        coords = geolocator.geocode(country)
    except:
        print(f"######### Failed querying: {country}")
        failed.append(f"Q:{country}")
        return

    try:
        writeToCsv(
            [
                country,
                capital,
                location,
                population,
                coords.latitude,
                coords.longitude,
                getFunFact(country),
            ],
            csvFile,
        )
    except:
        print(f"######### Could not write: {country}")
        failed.append(f"W:{country}")
        return


def writeToCsv(input, fname):
    newFile = False
    fixed_input = []
    for val in input:
        try:
            val = val.strip()
        except:
            pass
        fixed_input.append(val)

    if not os.path.exists(fname):
        newFile = True

    with open(fname, "a", newline="") as file:
        writer = csv.writer(file)
        if newFile:
            writer.writerow(
                [
                    "country",
                    "capital",
                    "location",
                    "population",
                    "latitude",
                    "longitude",
                    "fun-fact",
                ]
            )

        writer.writerow(fixed_input)

    print(fixed_input)


def createDatabase(dbName, fileName):
    con = sqlite3.connect(dbName)  # change to 'sqlite:///your_filename.db'
    cur = con.cursor()
    cur.execute(
        "CREATE TABLE countries (a, b, c, d, e, f, g);"
    )  # use your column names here

    with open(fileName, "r") as fin:
        dr = csv.DictReader(fin)
        to_db = [
            (
                i["a"],
                i["b"],
                i["c"],
                i["d"],
                i["e"],
                i["f"],
                i["g"],
            )
            for i in dr
        ]

    cur.executemany(
        "INSERT INTO countries (a, b, c, d, e, f, g) VALUES (?, ?, ?, ?, ?, ?, ?);",
        to_db,
    )
    con.commit()
    con.close()


if __name__ == "__main__":
    if os.path.exists(csvFile):
        os.remove(csvFile)

    for country in countries:
        createCountryEntry(country)

    createDatabase("countries.sqlite3", csvFile)

    print(failed)
