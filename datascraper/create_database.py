from geopy.geocoders import Nominatim
from bs4 import BeautifulSoup
from data import countries, facts
import requests
import csv
import os
import sqlite3

csvFile = "countries.csv"
geolocator = Nominatim(user_agent="metern")

entries = [
    "name",
    "capital",
    "location",
    "population",
    "currency",
    "latitude",
    "longitude",
    "funfact",
]


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
        currency = getEntry("Currency", soup)
        coords = geolocator.geocode(country)
    except:
        print(f"######### Failed querying: {country}")
        return

    try:
        writeToCsv(
            [
                country,
                capital,
                location,
                population,
                currency,
                coords.latitude,
                coords.longitude,
                facts[country],
            ],
            csvFile,
        )
    except:
        print(f"######### Could not write: {country}")
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
            writer.writerow(entries)

        writer.writerow(fixed_input)

    print(fixed_input)


def createDatabase(dbName, fileName):
    con = sqlite3.connect(dbName)
    cur = con.cursor()
    cur.execute(
        "CREATE TABLE countries (name, capital, location, population, currency, latitude, longitude, funfact);"
    )

    with open(fileName, "r") as fin:
        dr = csv.DictReader(fin)
        to_db = [
            (
                i["name"],
                i["capital"],
                i["location"],
                i["population"],
                i["currency"],
                i["latitude"],
                i["longitude"],
                i["funfact"],
            )
            for i in dr
        ]

    cur.executemany(
        "INSERT INTO countries (name, capital, location, population, currency, latitude, longitude, funfact) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
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
