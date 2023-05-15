# Shelly Scripts
## flora-moisture-to-mqtt
This script acts as a BLE-to-MQTT-gateway for Xiaomi HHCC Mi Flower Care sensors.

* Enable Bluetooth and Bluetooth gateway in Shelly Settings.

* Enable the MQTT network in Shelly Settings.

* Add the script and start it. The script will start scanning for BLE devices. If it receives moisture data from a Flower Care sensor, it publishes the data on MQTT.

Thank you to [hannseman](https://github.com/hannseman/homebridge-mi-hygrothermograph) for implementing the parsing logic, and to [ALLTERCO](https://github.com/ALLTERCO/shelly-script-examples) for low-level byte parsing in mJS.