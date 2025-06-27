import os
from dotenv import load_dotenv

load_dotenv()  #loading .env variables into your python environment


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "mysql+pymysql://root:Optexe-05@localhost/habit_tracker")  #URI to connect to the MariaDB
    SQLALCHEMY_TRACK_MODIFICATIONS = False  #this disables a warning about tracking notifications
    SECRET_KEY = os.getenv("SECRET_KEY") #secret key defined in the .env file.. Used for session security
