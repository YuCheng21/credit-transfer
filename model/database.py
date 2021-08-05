import mysql.connector


class Mysql:
    def __init__(self, config):
        self.conn = mysql.connector.connect(**config)
        self.cursor = self.conn.cursor(dictionary=True)

    def __enter__(self):
        return self.conn

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.conn.close()

    def exec(self, sql):
        try:
            self.cursor.execute(sql)
            self.conn.commit()
        except:
            self.conn.rollback()

    def query(self, sql):
        self.cursor.execute(sql)
        return self.cursor.fetchall()

    def connection(self):
        return self.conn

    def __del__(self):
        self.conn.close()
