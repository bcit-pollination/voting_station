import os
import sys
from cryptography.fernet import Fernet
from common import load_key, decode_data
def decrypt_data(keyfile, input_path):
    # print(keyfile)
    # print(input_path)
    # print(os.getcwd())
    path_to_export_tool = './utils/export_tool/'
    
    decrypt_input_file = open("{}encoded_data.txt".format(input_path), "r")
    input = decrypt_input_file.read()
    decrypt_input_file.close()
    
    # print(input)
    # print(type(input))

    key = load_key(path_to_export_tool + keyfile)
    f = Fernet(key)

    # print(key)

    data = decode_data(input)
    decrypted_msg = f.decrypt(data.encode())


    # print(decrypted_msg)
    print(decrypted_msg.decode('ascii'))

decrypt_data(sys.argv[1], sys.argv[2])