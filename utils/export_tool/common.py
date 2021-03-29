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
    print(crc_val)
    string_with_crc = string + ':' + str(crc_val) 


    return string_with_crc


def decode_data(string):
    len_of_crc = get_crc_len(string)
    given_crc = string[-len_of_crc:]
    
    size = len(string)
    string_no_crc = string[:size - (len_of_crc + 1)]
    string_in_bytes = string_no_crc.encode()
    
    actual_crc = zlib.crc32(string_in_bytes)
    if(given_crc != str(actual_crc)):
        print("THE DATA WAS TAMPERED WITH")
        sys.exit(70)
    else:
        return string_no_crc

def get_crc_len(string):
    size = len(string)
    for i in range(size - 1):
        if string[size-i-1] == ':':
            return i


# decode_data('gAAAAABgYWMT5aOyX9Xg1nIxGKS6xPkaUGoCM2k6avs7XEHf2ctQltrkWdng4_MDwGE2NADn5llvniNiNOkIpcRppbz6qm5iIhVvDKBu0jCZMV-p7hwa8Fk7JHTX9pzcBVguLiJjkPxonjMnmbQxC9yoArJ1eTgMhjPF9_2JV8OnUmW95PiB6CRHOAj0WNtQaaCi8zHfug2fYuM2ct7oxEshwrMLrHPH2XUt0IyEj7KhxVCW5A9PMzv4ripExJFrcDe-A731eHduyCnlybjKZhcOM-Z1zLnTO0MClUhIe8XJ9Hx3M7adakN9YBx7OvUCCht1rGKqVmeTWBpElJPhOUX46huPitXUBsJQ3J8ZmQZ-rTNltVY4RPg5g-cHSbtNrko1klG7m9Ljf4BVoB-CzNOF43ebY7GWkCfDtjq6wGtm7JK82qSTsAW0ZvjOM4_LjIt65VMxuEdYLCvqyM8Ge20pUwM0pJ4nO7_vZlwzy2m30D-JyPxoihG91vKpa1k0txeo-QGP3DAHykZomxvvLxwVkYryYHcPrgb6p10rtj_T-f6l8mq6FCnqu9dEIM5uz-DDCGLqhEzmHeEuLp8_Uyq91W865366ZN_1zIEkziu_I_P22-S7HIz-npk4Ssci035FlYAJxvnh3lp2z3LspyAW_8rsm5D4lLcc03jRxFbn_knFjemy82bTTUChcY8Kq8SJYDbl486yUNYf_PECBPpzJBdHOD5hlug9NJmRJwHKvK9A30dfFaYZ2Z1i2sEhqBA8RU-vCGsZ4QVXM1trEH7hqsQfwDHDHNXGlccCU9NiukQMALAaAJk6pHIoSlQuCtC55bYSzvDKMAuC5jBfgtxGS1EgwKXysx4A6U-04yaZuWirP9K9NptlqPXBSFNVEBYlFQWT7xwqIq3PKUimOBEaF6KhMNad_1ejnvHTqHBIc5jYSYTBvEMeAy9Y8RIILu6kLEgvkULJjIVHIyvoKAE-z5DyTGqtobPAOaxT46lxROTcbv-KtiZlf9La5kg-8bomDiWBP7mLRdLX-QQ39wpu9IW8L_C3rEtpotzB7-SvQRGaTwdzDsrchfrgRLnZ1FkTks80GGRDzkgapOw-PNXHXhF9NGagFu4C_YGqsuofZwx9Yw69PuJU7qbPNlSDwBclkACvBTbdsBwe3Zj8DEritiJWtzN1zZMHQm-OXLKUqvrnJ04VQFhrjkawjuDWTy3tAhT5j0thh13HLRCv6vugfmaMx37gEotiYJbzH-2VDRry7E1-NsPkABgnKHrSqZrhMInYYhh7KWk9Mcp4-30-YWTCT6JLv5m_AmPusHmjC5omfIGgORPVg1Sz4NnMzC7hcPXYCgktPowLOdxMbUnWs6ermNPDwgxdIPPf-cTFdyz3Km5-GfoJxyhe6lgzpEpq9vVXnHTTrAYoi-2-x6t9rgaNTFIi1s1AWWhWcdFTWJZYVHnh5ptCT_HoqH57kt1xaXx7dk31D_iPLHlAaKAiJD8D8gMKclo31SKuHy5YTz-10nklGR4ojzontwSdAXyJfVn9dMKE2dVxiAMFL9dbla-5LnVeF3kpIxyhjLXyn4Kwwor3c04A7Y4km3xm4eCIi1I3319TtJCHN-XNkY40AWT57LSPmyaSuO0-wG_JMrOEHe94Lxk5vDea-xFUbtdefPnya_OlLeV0VU5EOwMbLspEMJZ76eAYHR_I-ePoiekMKc8S29m2xe-MlA-l-1W12aWY13re_Bb6YvE3I7iIFRTwfQ_p7tw-2rGlMi29zUjZPZ3KJu6s0awRCOZDbaTkoXFwuqiZzQJ-PjZR2CelQa3DgCd7vgeF93dEYvXzzbdGr6cWc72GxdqgFDYH8uwbgnyi7orq7y63QjH5rr7XxxgxUTs1bLDaJoLD-OocMemDP5zB7xbNe8MzOstKMxICszl1ABA1v_ruYZGUFkHeY2HwsyVQDg5sVqrBdDMe6NlGUxfsL5-fJQNA9_9X2iFL9yq6ECvBGNOqPGfMZersyudcQqk3pwhWExmwBm2obrgiH0-uIuiAbbXc3-G2xXdT1do2LXpKh3ltDhirWAuhV-U_TdWELkjOkmFjrfWdrm1OjdCXGNDHPRnPqli5klsmH0YXhhoRQ1YpeluU13O4VyW9GXQe4vCsSA8qtKLoPMvdgsqwgFeK4nZiTItiMTwQg9GSw2gHZA4vcJBUWYc5vQu6RdLvYmiWph6tppJoZYH8wpoP83c2NVcowk13T8HsR_lwGOmBZe7jO1LBkgwamoAkdjexHz0kikaUxiX1BJkLx4bsb4ZKsqkjc_vmQbWG6yA2FMiHy3v9yXqLl0judumW_JwABskMJmc_QzXlJ8cJrMcBy5uMgE2JZaLOb_NAm9znRGsb:93189061')
# print(get_crc('jibberis32321321341242353241251342h!!!!!:1234567890'))