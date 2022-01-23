import { RNSerialport, definitions, actions, RNSerialportStatic, IDevice } from 'react-native-serialport';
import { Buffer } from 'buffer';

export class GbxDevice {
	DEVICE_NAME = "GBxCart RW";
	DEVICE_MIN_FW = 1;
	DEVICE_MAX_FW = 4;

	DEVICE_CMD = {
		"NULL": 0x30,
		"OFW_RESET_AVR": 0x2A,
		"OFW_CART_MODE": 0x43,
		"OFW_FW_VER": 0x56,
		"OFW_PCB_VER": 0x68,
		"OFW_USART_1_7M_SPEED": 0x3E,
		"OFW_CART_PWR_ON": 0x2F,
		"OFW_CART_PWR_OFF": 0x2E,
		"OFW_QUERY_CART_PWR": 0x5D,
		"OFW_DONE_LED_ON": 0x3D,
		"OFW_ERROR_LED_ON": 0x3F,
		"OFW_GB_CART_MODE": 0x47,
		"OFW_GB_FLASH_BANK_1_COMMAND_WRITES": 0x4E,
		"QUERY_FW_INFO": 0xA1,
		"SET_MODE_AGB": 0xA2,
		"SET_MODE_DMG": 0xA3,
		"SET_VOLTAGE_3_3V": 0xA4,
		"SET_VOLTAGE_5V": 0xA5,
		"SET_VARIABLE": 0xA6,
		"SET_FLASH_CMD": 0xA7,
		"SET_ADDR_AS_INPUTS": 0xA8,
		"CLK_HIGH": 0xA9,
		"CLK_LOW": 0xAA,
		"DMG_CART_READ": 0xB1,
		"DMG_CART_WRITE": 0xB2,
		"DMG_CART_WRITE_SRAM": 0xB3,
		"DMG_MBC_RESET": 0xB4,
		"DMG_MBC7_READ_EEPROM": 0xB5,
		"DMG_MBC7_WRITE_EEPROM": 0xB6,
		"DMG_MBC6_MMSA_WRITE_FLASH": 0xB7,
		"AGB_CART_READ": 0xC1,
		"AGB_CART_WRITE": 0xC2,
		"AGB_CART_READ_SRAM": 0xC3,
		"AGB_CART_WRITE_SRAM": 0xC4,
		"AGB_CART_READ_EEPROM": 0xC5,
		"AGB_CART_WRITE_EEPROM": 0xC6,
		"AGB_CART_WRITE_FLASH_DATA": 0xC7,
		"AGB_CART_READ_3D_MEMORY": 0xC8,
		"AGB_BOOTUP_SEQUENCE": 0xC9,
		"DMG_FLASH_WRITE_BYTE": 0xD1,
		"AGB_FLASH_WRITE_BYTE": 0xD2,
		"FLASH_PROGRAM": 0xD3,
		"CART_WRITE_FLASH_CMD": 0xD4,
	};

	DEVICE_VAR = {
		"ADDRESS": [32, 0x00],
		"TRANSFER_SIZE": [16, 0x00],
		"BUFFER_SIZE": [16, 0x01],
		"DMG_ROM_BANK": [16, 0x02],
		"CART_MODE": [8, 0x00],
		"DMG_ACCESS_MODE": [8, 0x01],
		"FLASH_COMMAND_SET": [8, 0x02],
		"FLASH_METHOD": [8, 0x03],
		"FLASH_WE_PIN": [8, 0x04],
		"FLASH_PULSE_RESET": [8, 0x05],
		"FLASH_COMMANDS_BANK_1": [8, 0x06],
		"FLASH_SHARP_VERIFY_SR": [8, 0x07],
		"DMG_READ_CS_PULSE": [8, 0x08],
		"DMG_WRITE_CS_PULSE": [8, 0x09],
	};

	PCB_VERSIONS = { 4: 'v1.3', 5: 'v1.4', 6: 'v1.4a', 101: 'Mini v1.0d' };
	ACTIONS = { "ROM_READ": 1, "SAVE_READ": 2, "SAVE_WRITE": 3, "ROM_WRITE": 4, "ROM_WRITE_VERIFY": 4, "SAVE_WRITE_VERIFY": 3 };
	SUPPORTED_CARTS = {};

	FW = [];
	FW_UPDATE_REQ = false;
	MODE = undefined;
	PORT = '';
	DEVICE: RNSerialportStatic | undefined = undefined;
	WORKER = undefined;
	INFO = { "action": undefined, "last_action": undefined };
	ERROR = false;
	CANCEL = false;
	CANCEL_ARGS = {};
	SIGNAL = undefined;
	POS = 0;
	NO_PROG_UPDATE = false;
	FAST_READ = false;
	SKIPPING = false;
	BAUDRATE = 1000000;
	MAX_BUFFER_LEN = 512;

	constructor() {
		// this.Initialize(port, max_baud, flashcarts)
	}

	LoadFirmwareVersion() {
		try {
			// RNSerialport.writeString(this.DEVICE_CMD.OFW_ERROR_LED_ON.toString());
			RNSerialport.writeHexString(this.DEVICE_CMD.OFW_ERROR_LED_ON.toString(16).toUpperCase());
			RNSerialport.writeHexString(this.DEVICE_CMD.OFW_DONE_LED_ON.toString(16).toUpperCase());
			RNSerialport.writeHexString(this.DEVICE_CMD.OFW_PCB_VER.toString(16).toUpperCase());
			RNSerialport.writeHexString(this.DEVICE_CMD.OFW_FW_VER.toString(16).toUpperCase());
			RNSerialport.writeHexString(this.DEVICE_CMD.OFW_CART_PWR_ON.toString(16).toUpperCase());
			console.log("Trying lol");
		} catch (error) {
			console.error(error);
		}
	}

	// async Initialize(port = undefined, max_baud = 1700000, flashcarts = undefined) {
	// 	if (await this.IsConnected()) this.DEVICE?.disconnect();

	// 	RNSerialport.startUsbService();
		
	// 	const conn_msg = [];
	// 	let ports: IDevice[] = [];

	// 	// Get port
	// 	if (port) {
	// 		ports = [port];
	// 	} else {
	// 		const devices = await RNSerialport.getDeviceList()

	// 		if (!devices) return;
	// 		if (devices.length === 0) return;

	// 		devices.forEach(device => {
	// 			if (device.vendorId === 0x1A86 && device.productId === 0x7523) {
	// 				ports.push(device);
	// 			}
	// 		});
	// 	}

	// 	// console.log(ports);

	// 	ports.forEach(devicePort => {
	// 		try {
	// 			console.log(RNSerialport.isOpen().then(res => {
	// 				console.log(`First: ${res}`)
	// 			}));
	// 			// RNSerialport.connectDevice(devicePort.name, this.BAUDRATE);

	// 			console.log(RNSerialport.isOpen().then(res => {
	// 				console.log(`Second: ${res}`)
	// 			}));

	// 		} catch (error) {
	// 			console.error(error);
	// 		}
	// 	});

	// 	RNSerialport.stopUsbService();
	// }

	// async IsConnected(): Promise<boolean> {
	// 	if (!this.DEVICE) return false;
	// 	if (!this.DEVICE.isOpen()) return false;

	// 	try {
	// 		// while (this.DEVICE.in_waiting > 0) {
	// 		// 	console.debug(`Clearing input buffer... (${this.DEVICE.in_waiting})`);
	// 		// 	this.DEVICE.reset_input_buffer();
	// 		// 	await sleep(500);
	// 		// }
	// 		// this.DEVICE.reset_output_buffer()
	// 		return true
	// 	} catch (error) {
	// 		console.error(error);
	// 		return false;
	// 	}
	// }
}

function sleep(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
