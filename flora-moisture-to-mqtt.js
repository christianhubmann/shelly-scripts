let EventTypes = {
    moisture: 4104,
};

function utoi(num, bitsz) {
    let mask = 1 << (bitsz - 1);
    return num & mask ? num - (1 << bitsz) : num;
}

function getUInt8(buffer, offset) {
    return buffer.at(offset);
}

function getUInt16LE(buffer, offset) {
    return 0xffff & ((buffer.at(offset + 1) << 8) | buffer.at(offset));
}

function getInt8(buffer, offset) {
    return utoi(getUInt8(buffer, offset), 8);
}

function bleScanCallback(event, result) {
    if (event !== BLE.Scanner.SCAN_RESULT) {
        return;
    }

    if (typeof result.addr === "undefined" ||
        typeof result.service_data === "undefined" ||
        typeof result.service_data.fe95 === "undefined") {
        return;
    }

    if (getUInt16LE(result.service_data.fe95, 12) === EventTypes.moisture) {
        let moisture = getInt8(result.service_data.fe95, 15);

        let topic = "shelly/Flora" +
            result.addr.slice(9, 11) +
            result.addr.slice(12, 14) +
            result.addr.slice(15, 17) +
            "/Moisture";

        console.log(topic + ": ", moisture);

        if (MQTT.isConnected()) {
            MQTT.publish(topic, JSON.stringify(moisture));
        }
        else {
            console.log("MQTT is not connected");
        }
    }
}

function bleScan() {
    let bleConfig = Shelly.getComponentConfig("ble");

    if (!bleConfig.enable) {
        console.log("BLE is not enabled");
        return;
    }

    let bleScanner = BLE.Scanner.Start({
        duration_ms: BLE.Scanner.INFINITE_SCAN
    });

    if (!bleScanner === false) {
        console.log("Error when starting the BLE scanner");
        return;
    }

    BLE.Scanner.Subscribe(bleScanCallback);
    console.log("BLE is successfully started");
}

// delay for 2s, otherwise BLE won't start when rebooting the device
Timer.set(2000, false, bleScan);
