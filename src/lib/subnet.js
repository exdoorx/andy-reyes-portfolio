const toIp = (value) =>
  [value >>> 24, (value >>> 16) & 255, (value >>> 8) & 255, value & 255].join(".");

export function calculateSubnet(input) {
  const match = input
    .trim()
    .match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/);

  if (!match) throw new Error("Use the format 192.168.1.10/24.");

  const octets = match.slice(1, 5).map(Number);
  const bits = Number(match[5]);

  if (octets.some((octet) => octet > 255)) {
    throw new Error("Each octet must be between 0 and 255.");
  }
  if (bits > 32) throw new Error("The prefix must be between 0 and 32.");

  const ip =
    ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  const network = (ip & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const total = 2 ** (32 - bits);

  let hosts;
  let first;
  let last;

  if (bits === 32) {
    hosts = 1;
    first = last = network;
  } else if (bits === 31) {
    hosts = 2;
    first = network;
    last = broadcast;
  } else {
    hosts = total - 2;
    first = network + 1;
    last = broadcast - 1;
  }

  return {
    rows: [
      ["Network", toIp(network)],
      ["Subnet mask", toIp(mask)],
      ["Broadcast", toIp(broadcast)],
      ["First host", toIp(first >>> 0)],
      ["Last host", toIp(last >>> 0)],
      ["Usable hosts", hosts.toLocaleString("en-US")],
    ],
    network,
    broadcast,
    hosts,
  };
}
