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

    def get_number_of_rows(self, keyword=None):
        try:
            cnx = self.cnxpool.get_connection()
            cursor = cnx.cursor(dictionary=True)

            if not keyword:
                cursor.execute("SELECT * FROM attractions")
            else:
                cursor.execute("SELECT * FROM attractions WHERE name LIKE %s", ("%" + keyword + "%",))
            cursor.fetchall()
            return cursor.rowcount

        except Error as e:
            print("Error occured: ", e)
            return False

        finally:
            if cnx.is_connected():
                cursor.close()
                cnx.close()

    def paginate(self, limit, offset, keyword=None):
        try:
            cnx = self.cnxpool.get_connection()
            cursor = cnx.cursor(dictionary=True)

            if not keyword:
                cursor.execute(
                    "SELECT * FROM attractions ORDER BY id LIMIT %s OFFSET %s",
                    (
                        limit,
                        offset,
                    ),
                )
            else:
                cursor.execute(
                    "SELECT * FROM attractions WHERE name LIKE %s ORDER BY id LIMIT %s OFFSET %s",
                    (
                        "%" + keyword + "%",
                        limit,
                        offset,
                    ),
                )
            result = cursor.fetchall()
            return result

        except Error as e:
            print("Error occured: ", e)
            return False

        finally:
            if cnx.is_connected():
                cursor.close()
                cnx.close()

    def query(self, sql, params=None, fetch_data="one"):
        try:
            cnx = self.cnxpool.get_connection()
            cursor = cnx.cursor(dictionary=True)

            if not params:
                cursor.execute(sql)
                result = cursor.fetchall()
            else:
                cursor.execute(sql, tuple(params))
                if fetch_data == "one":
                    result = cursor.fetchone()
                elif fetch_data == "all":
                    result = cursor.fetchall()
            return result

        except Error as e:
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
