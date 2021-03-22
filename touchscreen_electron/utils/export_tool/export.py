import os
import sys
from cryptography.fernet import Fernet
from common import load_key
def encrypt_data(data, keyfile, output_path):
    path_to_export_tool = './utils/export_tool/'
    msg = data.encode()

    key = load_key(path_to_export_tool + keyfile)
    f = Fernet(key)

    encrypted_msg = f.encrypt(msg)

    encrypt_output_file = open("tmp.txt", "wb")
    encrypt_output_file.write(encrypted_msg)
    encrypt_output_file.close()

    os.system('{}encode-crc32 tmp.txt > {}encoded_data.txt'.format(path_to_export_tool, output_path))
    os.remove('tmp.txt')
    print('success');

encrypt_data(sys.argv[1], sys.argv[2], sys.argv[3])