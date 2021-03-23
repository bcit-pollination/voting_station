import os
import sys
from cryptography.fernet import Fernet
from common import load_key, encode_data

def encrypt_data(data, keyfile, output_path):
    path_to_export_tool = './utils/export_tool/'
    msg = data.encode()

    key = load_key(path_to_export_tool + keyfile) #TODO: Add path to export tool
    f = Fernet(key)

    encrypted_msg = f.encrypt(msg)

    encrypt_output_file = open("{}encoded_data.txt".format(output_path), "w")
    encrypt_output_file.write(encode_data(encrypted_msg.decode('utf-8')))
    encrypt_output_file.close()
    print('success');

encrypt_data(sys.argv[1], sys.argv[2], sys.argv[3])