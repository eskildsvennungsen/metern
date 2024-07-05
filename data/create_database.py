import csv
import sqlite3
import pandas as pd


def createDatabase(csvFileName, dbFileName, table, extra=""):
    colTags = list(pd.read_csv(csvFileName).columns)
    columns = ",".join([entry for entry in colTags])

    con = sqlite3.connect(dbFileName)
    cur = con.cursor()
    cur.execute(f"CREATE TABLE {table} (id INTEGER PRIMARY KEY, {columns} {extra});")

    with open(csvFileName, "r") as fin:
        dr = csv.DictReader(fin)
        to_db = [tuple(i[tag] for tag in colTags) for i in dr]

    values = ",".join(["?" for entry in colTags])
    cur.executemany(
        f"INSERT INTO {table} ({columns}) VALUES ({values});",
        to_db,
    )
    con.commit()
    con.close()


def transformBorderDatabase(csvFileName):
    borders = []
    db = []

    with open(csvFileName, "r") as f:
        dr = csv.DictReader(f)
        for row in dr:
            borders.append(row)

    with open("db_data_norwegian.csv", "r") as f:
        dr = csv.DictReader(f)
        for row in dr:
            db.append(row)

    primary_key = 1
    new = []
    for i in db:
        current = {"iso2": i["iso2"], "key": primary_key}
        found = 0
        for j in borders:
            if j["country_code"] == current["iso2"]:
                j["country_code"] = current["key"]
                found += 1

            elif j["country_border_code"] == current["iso2"]:
                j["country_border_code"] = current["key"]
                found += 1

            if found > 0:
                new.append(j)
                found = 0

        primary_key += 1

    with open("db_borders_key.csv", "w", newline="", encoding="utf-8") as f:
        tags = list(pd.read_csv(csvFileName).columns)
        writer = csv.DictWriter(f, tags)
        writer.writeheader()
        writer.writerows(new)


if __name__ == "__main__":
    createDatabase("db_data_norwegian.csv", "countries.sqlite3", "countries")
    createDatabase(
        "db_borders_key.csv",
        "countries.sqlite3",
        "borders",
        extra=",FOREIGN KEY(country_code) REFERENCES countries(id), FOREIGN KEY(country_border_code) REFERENCES countries(id)",
    )

    # transformBorderDatabase("db_borders_iso3.csv")
