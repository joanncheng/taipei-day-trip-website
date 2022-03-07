from flask import Blueprint
from mysql.connector import pooling, Error
from decouple import config

models_bp = Blueprint("models", __name__)


class Database:
    def __init__(self):
        self.cnxpool = pooling.MySQLConnectionPool(
            pool_name="mypool",
            pool_size=2,
            pool_reset_session=True,
            host="localhost",
            user=config("MYSQL_USER"),
            password=config("MYSQL_PASSWORD"),
            database="taipei_day_trip_website",
        )

    def get_attraction(self, attraction_id):
        try:
            cnx = self.cnxpool.get_connection()
            cursor = cnx.cursor(dictionary=True)

            cursor.execute("SELECT * FROM attractions WHERE id = %s", (attraction_id,))

            record = cursor.fetchone()
            return record

        except Exception as e:
            print("Error occured: ", e)
            return False

        finally:
            if cnx.is_connected():
                cursor.close()
                cnx.close()

    def get_pagination(self, per_page, page, keyword):
        try:
            cnx = self.cnxpool.get_connection()
            cursor = cnx.cursor(dictionary=True)

            offset = page * per_page

            if not keyword:
                cursor.execute(
                    "SELECT * FROM attractions ORDER BY id LIMIT %s OFFSET %s;",
                    (
                        per_page + 1,
                        offset,
                    ),
                )
            else:
                cursor.execute(
                    "SELECT * FROM attractions WHERE name LIKE %s ORDER BY id LIMIT %s OFFSET %s;",
                    (
                        "%" + keyword + "%",
                        per_page + 1,
                        offset,
                    ),
                )

            record = cursor.fetchall()

            if len(record) == per_page + 1:
                next_page = page + 1
                attractions = record[:-1]
            else:
                next_page = None
                attractions = record

            return {"next_page": next_page, "attractions": attractions}

        except Exception as e:
            print("Error occured: ", e)
            return False

        finally:
            if cnx.is_connected():
                cursor.close()
                cnx.close()


try:
    mydbpool = Database()
except Error as e:
    print("Error while connecting to MySQL: ", e)
