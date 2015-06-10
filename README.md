# What ?


A gallery of public available cameras. It's art, dont touch.

http://barrabinfc.github.io/insecam-feedtv/

![](https://raw.githubusercontent.com/barrabinfc/insecam-feedtv/master/misc/screen.jpg)

# To run on raspberry

Install chromium

    sudo apt-get update && apt-get upgrade -y
    sudo apt-get install chromium x11-xserver-utils unclutter


– edit `/etc/xdg/lxsession/LXDE/autostart` and comment # screen saver line and add those lines:

    @xset s off
    @xset -dpms
    @xset s noblank
    @chromium --kiosk --incognito http://barrabinfc.github.io/insecam-feedtv/

