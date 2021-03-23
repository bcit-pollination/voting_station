import os
import sys
from cryptography.fernet import Fernet
from common import load_key, decode_data
def decrypt_data(keyfile, input_path):
    path_to_export_tool = './utils/export_tool/'
    
    decrypt_input_file = open("{}encoded_data.txt".format(input_path), "r")
    input = decrypt_input_file.read()
    decrypt_input_file.close()

    key = load_key(path_to_export_tool+keyfile)
    f = Fernet(key)
    decrypted_msg = f.decrypt(input.encode())
    print(decrypted_msg.decode('ascii'));

decrypt_data(sys.argv[1], sys.argv[2])