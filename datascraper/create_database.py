from geopy.geocoders import Nominatim
from bs4 import BeautifulSoup
from data import countries, facts
import requests
import csv
import os
import sqlite3
from collections import defaultdict

fileName = "countries"
dbFileName = f"{fileName}.sqlite3"
csvFileName = f"{fileName}.csv"

geolocator = Nominatim(user_agent="metern")

basis = [
    "name",
    "iso3",
    "iso2",
    "capital",
    "currency",
    "currency_name",
    "currency_symbol",
    "tld",
    "native",
    "region",
    "region_id",
    "subregion",
    "nationality",
    "latitude",
    "longitude",
    "emoji",
    "emojiU",
    "funfact",
    "queryName",
]


def getEntry(entry, soup: BeautifulSoup):
    return (
        soup.find("td", string=f" {entry} ").find_next_sibling("td").get_text().strip()
    )


def createCountryEntry(country: str):
    # URL of the Wikipedia page containing the list of countries
    search = "".join(country.split())
    url = f"https://www.countryreports.org/country/{search}.htm"

    # Fetch the content of the page
    response = requests.get(url)
    strip = " ".join(response.text.split())

    soup = BeautifulSoup(strip, "html.parser")

    try:
        capital = getEntry("Capital", soup)
        population = getEntry("Population", soup)
        location = getEntry("Location", soup)
        currency = getEntry("Currency", soup)
    except Exception as error:
        print(f"######### Failed querying: {country}, Error: {error}")
        return

    try:
        coords = [0, 0]  # wikiPage.coordinates
        queryName = country.lower().replace(" ", "_")
    except Exception as error:
        print(f"######### Failed fetching geodata: {country}, Error: {error}")
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
                queryName,
            ],
            csvFile,
        )
    except Exception as error:
        print(f"######### Failed writing: {country}, Error: {error}")
        return


def writeToCsv(input, fname):
    newFile = False
    fixed_input = [x.strip() if x == str else x for x in input]

    if not os.path.exists(fname):
        newFile = True

    with open(fname, "a", newline="") as file:
        writer = csv.writer(file)
        if newFile:
            writer.writerow(entries)

        writer.writerow(fixed_input)

    print(fixed_input)


def createDatabase(csvFileName, dbFileName, colTags):
    if os.path.exists(dbFileName):
        os.remove(dbFileName)

    columns = ",".join([entry for entry in colTags])

    con = sqlite3.connect(dbFileName)
    cur = con.cursor()
    cur.execute(f"CREATE TABLE countries (id INTEGER PRIMARY KEY, {columns});")

    with open(csvFileName, "r") as fin:
        dr = csv.DictReader(fin)
        to_db = [tuple(i[tag] for tag in colTags) for i in dr]

    values = ",".join(["?" for entry in colTags])
    cur.executemany(
        f"INSERT INTO countries ({columns}) VALUES ({values});",
        to_db,
    )
    con.commit()
    con.close()


if __name__ == "__main__":
    #    if os.path.exists(csvFile):
    #        os.remove(csvFile)
    #
    #    for country in countries:
    #        createCountryEntry(country)

    createDatabase("new.csv", "countries.sqlite3", basis)
