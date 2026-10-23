import { describe, expect, it } from "vitest";
import { calculateSubnet } from "./subnet";

describe("calculateSubnet", () => {
  it("computes a typical /24 network", () => {
    const result = calculateSubnet("192.168.1.10/24");
    expect(result.rows).toEqual([
      ["Network", "192.168.1.0"],
      ["Subnet mask", "255.255.255.0"],
      ["Broadcast", "192.168.1.255"],
      ["First host", "192.168.1.1"],
      ["Last host", "192.168.1.254"],
      ["Usable hosts", "254"],
    ]);
  });

  it("handles a /31 point-to-point network", () => {
    const result = calculateSubnet("10.0.0.0/31");
    expect(result.rows[4][1]).toBe("10.0.0.1");
    expect(result.rows[5][1]).toBe("2");
  });

  it("handles a /32 host route", () => {
    const result = calculateSubnet("192.168.1.1/32");
    expect(result.rows[3][1]).toBe("192.168.1.1");
    expect(result.rows[4][1]).toBe("192.168.1.1");
    expect(result.rows[5][1]).toBe("1");
  });

  it("rejects invalid octets", () => {
    expect(() => calculateSubnet("256.1.1.1/24")).toThrow("Each octet must be between 0 and 255.");
  });

  it("rejects invalid prefixes", () => {
    expect(() => calculateSubnet("192.168.1.1/33")).toThrow("The prefix must be between 0 and 32.");
  });

  it("rejects malformed input", () => {
    expect(() => calculateSubnet("192.168.1.1")).toThrow(
      "Use the format 192.168.1.10/24.",
    );
  });
});
