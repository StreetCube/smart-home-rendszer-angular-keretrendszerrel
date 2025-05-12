const GENERIC_TYPES =
  require('../constants/zigbee2mqtt.constants').GENERIC_TYPES;
const SPECIFIC_TYPES =
  require('../constants/zigbee2mqtt.constants').SPECIFIC_TYPES;

exports.setEventOnlyOnce = (eventHandler, eventName, handlingFunction) => {
  eventHandler.off(eventName, handlingFunction);
  eventHandler.on(eventName, handlingFunction);
};

exports.getZigbeeDeviceProperties = (exposes) => {
  let properties = {};

  exposes.forEach((expose) => {
    if (GENERIC_TYPES.includes(expose.type)) {
      switch (expose.type) {
        case 'composite':
          expose.features.forEach((feature) => {
            properties = {
              ...properties,
              ...checkCompositeAndSpecific(feature),
            };
          });
          break;
        default:
          properties[expose.property] = expose;
          break;
      }
    } else {
      properties = { ...properties, ...checkCompositeAndSpecific(expose) };
    }
  });
  return properties;
};

function checkCompositeAndSpecific(expose, properties = {}, specificType = '') {
  if (SPECIFIC_TYPES.includes(expose.type)) {
    specificType = expose.type;
  }
  if (expose.features && expose.features.length > 0) {
    expose.features.forEach((feature) => {
      if (feature.type === 'composite') {
        checkCompositeAndSpecific(feature, properties, specificType);
      } else {
        if (specificType) {
          feature.specificType = specificType;
        }

        properties[feature.property] = feature;
      }
    });
  }
  return properties;
}
