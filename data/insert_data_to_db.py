from decouple import config
import mysql.connector
from mysql.connector import Error
import json

try:
    db = mysql.connector.connect(
        host="localhost",
        port=config("MYSQL_PORT"),
        user=config("MYSQL_USER"),
        password=config("MYSQL_PASSWORD"),
        database="taipei_day_trip_website",
    )

    if db.is_connected():
        print("db is connected.")
        cursor = db.cursor(dictionary=True)

        # with open("taipei-attractions.json") as f:
        #     data = json.load(f)
        #     attractions = data["result"]["results"]
        #     for attraction in attractions:
        #         # Get image URIs
        #         file_uris = attraction["file"].lower().split("https://")
        #         images = []
        #         for uri in file_uris:
        #             if uri.endswith("jpg") or uri.endswith("png"):
        #                 images.append("https://" + uri)

        #         # Insert attractions into database
        #         attraction_data = {
        #             "id": attraction["_id"],
        #             "name": attraction["stitle"],
        #             "category": attraction["CAT2"],
        #             "description": attraction["xbody"],
        #             "address": attraction["address"].replace(" ", ""),
        #             "transport": attraction["info"],
        #             "mrt": attraction["MRT"],
        #             "latitude": attraction["latitude"],
        #             "longitude": attraction["longitude"],
        #             "images": ",".join(images),
        #         }

        #         sql = "INSERT INTO attractions (id, name, category, description, address, transport, mrt, latitude, longitude, images) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        #         val = [attraction_data[key] for key in attraction_data]
        #         cursor.execute(sql, tuple(val))
        #         db.commit()
        #         print(cursor.rowcount, "record inserted.")

        # sql = "CREATE TABLE user (id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL)"

        sql = "CREATE TABLE booking (id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, attractionId BIGINT NOT NULL,userId BIGINT NOT NULL, date DATE NOT NULL, time VARCHAR(50) NOT NULL, price BIGINT NOT NULL, FOREIGN KEY(attractionId) REFERENCES attractions(id), FOREIGN KEY(userId) REFERENCES user(id) ON DELETE CASCADE);"

        cursor.execute(sql)
        db.commit()

except Error as e:
    print("Error occured: ", e)
    db.rollback()

finally:
    if db.is_connected():
        cursor.close()
        db.close()
        print("db is closed.")
