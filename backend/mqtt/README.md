## Windows

https://github.com/dorssel/usbipd-win

_This documentation is tried with WSL virtualization._

1. Open a terminal, paste: `winget install usbipd`
2. Open a new terminal with admin privileges
3. Paste: `usbipd list`
4. You can find a list of devices, search for the zigbee stick's com port (e.g. COM3)
   - You can find something like this:

```
C:\Windows\System32>usbipd list
Connected:
BUSID  VID:PID    DEVICE                      STATE
1-3    1cf1:0030  Soros USB-eszköz (COM3)     Not shared
1-4    0658:0200  Soros USB-eszköz (COM5)     Not shared
1-5    413c:4503  USB beviteli eszköz         Not shared
```

5. Share the device with `usbipd bind --busid=<BUSID>` command, example: `usbipd bind --busid=1-3`
6. Attach the device to wsl with `usbipd attach --wsl --busid=<BUSID>` command.
   After these steps, the the docker environment will see the COM port as `ttyACM*` or `ttyUSB*`, for example ttyACM0
