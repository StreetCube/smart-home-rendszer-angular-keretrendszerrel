exports.ACCESS = Object.freeze({
  PUBLISHED: 0b001,
  SET: 0b010,
  GET: 0b100,
});

exports.GENERIC_TYPES = [
  'binary',
  'numeric',
  'enum',
  'text',
  'composite',
  'list',
];

exports.SPECIFIC_TYPES = ['light', 'switch', 'fan', 'cover', 'lock', 'climate'];
