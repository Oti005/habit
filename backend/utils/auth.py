from flask_bcrypt import generate_password_hash, check_password_hash
from datetime import datetime


def hash_password(password):
    return generate_password_hash(password).decode('utf-8')  #This hashes the plaintext passwords

def verify_password(password, hashed):
    return check_password_hash(hashed, password)      #verifies user-entered password against stored hash