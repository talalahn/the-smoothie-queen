const leftPad = (value, length) => {
  while (value.length < length) {
    value = '0' + value;
  }
  return value;
};

export const formatTimer = (durationMs) => {
  durationMs = Math.floor(durationMs);
  const seconds = Math.floor(durationMs / 1000);
  const ms = Math.floor(durationMs / 10) % 100;
  // eslint-disable-next-line @upleveled/upleveled/no-unnecessary-interpolations
  return `${seconds}:${leftPad(`${ms}`, 2)}`;
};
