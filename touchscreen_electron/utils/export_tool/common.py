import os
from cryptography.fernet import Fernet

def load_key(key_file):
    return open(key_file, "rb").read()

def generate_key():
    key = Fernet.generate_key()
    with open("./test.key", "wb") as key_file:
        key_file.write(key)
