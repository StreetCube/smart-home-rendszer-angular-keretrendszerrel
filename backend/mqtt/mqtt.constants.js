exports.TOPICS = {
  BRIDGE: {
    INFO: 'zigbee2mqtt/bridge/info',
    STATE: 'zigbee2mqtt/bridge/state',
    DEVICES: 'zigbee2mqtt/bridge/devices',
    EVENT: 'zigbee2mqtt/bridge/event',
    RESPONSE: {
      DEVICE_REMOVE: 'zigbee2mqtt/bridge/response/device/remove',
      DEVICE_OPTIONS: 'zigbee2mqtt/bridge/response/device/options',
      PERMIT_JOIN: 'zigbee2mqtt/bridge/response/permit_join',
    },
    REQUEST: {
      DEVICE_REMOVE: 'zigbee2mqtt/bridge/request/device/remove',
      DEVICE_OPTIONS: 'zigbee2mqtt/bridge/request/device/options',
      RESTART: 'zigbee2mqtt/bridge/request/restart',
      PERMIT_JOIN: 'zigbee2mqtt/bridge/request/permit_join',
    },
  },
  DEVICE: {
    AVAILABILITY: (ieeeAddress) => `zigbee2mqtt/${ieeeAddress}/availability`,
    STATE: (ieeeAddress) => `zigbee2mqtt/${ieeeAddress}`,
    SET: (ieeeAddress) => `zigbee2mqtt/${ieeeAddress}/set`,
  },
};

exports.ZIGBEE2MQTT_EVENTS = {
  READY: 'ready',
  STATE_CHANGE: 'stateChange',
  AVAILABILITY_CHANGE: 'availabilityChange',
  DEVICES_LIST_UPDATE: 'devicesListUpdate',
  DEVICE_ADDED: 'deviceAdded',
  DEVICE_STATE_CHANGE: 'deviceStateChange',
  BRIDGE_INFO: 'bridgeInfo',
  BRIDGE_EVENT: 'bridgeEvent',
  RESTART_REQUIRED: 'restartRequired',
};
