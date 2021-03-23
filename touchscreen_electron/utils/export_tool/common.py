import os
from cryptography.fernet import Fernet
import zlib 
import sys

def load_key(key_file):
    return open(key_file, "rb").read()

def generate_key():
    key = Fernet.generate_key()
    with open("./test.key", "wb") as key_file:
        key_file.write(key)

def encode_data(string):
    string_in_bytes = string.encode()
    crc_val = zlib.crc32(string_in_bytes)
    string_with_crc = string + str(crc_val)
    return string_with_crc


def decode_data(string):
    given_crc = string[-10:]
    size = len(string)
    string_no_crc = string[:size - 10]
    string_in_bytes = string_no_crc.encode()
    
    actual_crc = zlib.crc32(string_in_bytes)
    if(given_crc != str(actual_crc)):
        print("THE DATA WAS TAMPERED WITH");
        sys.exit(70)
    else:
        return string_no_crc