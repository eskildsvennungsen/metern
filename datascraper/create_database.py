from data import countries, facts
import csv
import os
import sqlite3

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
    createDatabase("db_data.csv", "countries.sqlite3", basis)
