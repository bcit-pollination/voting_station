import os
from glob import glob
from subprocess import check_output, CalledProcessError

def get_usb_devices():
    sdb_devices = map(os.path.realpath, glob('/sys/block/sd*'))
    usb_devices = (dev for dev in sdb_devices
        if 'usb' in dev.split('/')[5])
    # return dict((os.path.basename(dev), dev) for dev in usb_devices)
    ## INTERESTING THOUGH, sdb_devices worked for me, usb_devices didn't
    return dict((os.path.basename(dev), dev) for dev in sdb_devices)

def get_mount_points(devices=None):
    devices = devices or get_usb_devices()  # if devices are None: get_usb_devices
    output = check_output(['mount']).splitlines()
    output = [tmp.decode('UTF-8') for tmp in output]

    def is_usb(path):
        return any(dev in path for dev in devices)
    usb_info = (line for line in output if is_usb(line.split()[0]))

    return ['"info": "{}", "path": "{}"'.format(info.split()[0], info.split()[2]) for info in usb_info]

def print_formatted_mount_points(usb_list):
    output = ""
    output+= '{ "usbs":['
    for i in range(len(usb_list) ):
        output+= '{' + usb_list[i] + '}'
        if i != (len(usb_list)- 1 ):
            output += ','
    output+= ']}'
    print(output)

usb_list = get_mount_points()
print_formatted_mount_points(usb_list)