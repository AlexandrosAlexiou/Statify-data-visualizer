#!/usr/bin/env python3
import pymysql
import sys

password = 'password'


def backup_database():
    try:
        con = pymysql.connect(host='localhost', user='root', password=password, autocommit=True, local_infile=1)
        print('Connected to DB: {}'.format('localhost'))
        cursor = con.cursor()
        cursor.execute("""USE StatisticsDB;""")
        cursor.execute("""SELECT * INTO OUTFILE '/Users/alexandrosalexiou/WebstormProjects/Statify/Data_config/Exported_data/csv/indicators.csv'
                            FIELDS TERMINATED BY ',' ENCLOSED BY '"' FROM indicators;""")

        cursor.execute("""SELECT * INTO OUTFILE '/Users/alexandrosalexiou/WebstormProjects/Statify/Data_config/Exported_data/csv/countries.csv'
                            FIELDS TERMINATED BY ',' ENCLOSED BY '"' FROM countries;""")

        cursor.execute("""SELECT * INTO OUTFILE '/Users/alexandrosalexiou/WebstormProjects/Statify/Data_config/Exported_data/csv/years.csv'
                            FIELDS TERMINATED BY ',' ENCLOSED BY '"' FROM years;""")

        cursor.execute("""SELECT * INTO OUTFILE '/Users/alexandrosalexiou/WebstormProjects/Statify/Data_config/Exported_data/csv/measurements.csv'
                            FIELDS TERMINATED BY ',' ENCLOSED BY '"' FROM measurements;""")
        print("Backup finished.")
        print("Csv files location: /Users/alexandrosalexiou/Workspaces/PyCharm/Data_config/Exported_data/csv/")
        con.close()
    except Exception as e:
        print('MySQL Error: {}'.format(str(e)))
        sys.exit(1)


backup_database()
