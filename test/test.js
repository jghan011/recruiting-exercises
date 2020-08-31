var assert = require("assert");
var expect = require("chai").expect;

describe("Inventory Allocator", () => {
  class InventoryAllocator {
    allocate = (order, warehouses) => {
      let hasApples = false;
      let warehouseName;

      warehouses.forEach((warehouse) => {
        if (warehouse.inventory.apple >= order.apple) {
          hasApples = true;
          warehouseName = warehouse.name;
        }
      });

      if (hasApples === true) {
        let returnedWarehouse = {
          [warehouseName]: {
            apple: order.apple,
          },
        };
        return [returnedWarehouse];
      } else {
        return [];
      }
    };
  }
  it("Happy Case, exact inventory match! 1 apple, owd warehouse", () => {
    const allocator = new InventoryAllocator();

    const order = { apple: 1 };
    const warehouses = [
      { name: "owd", inventory: { apple: 1, oranges: 2, banana: 3 } },
    ];

    const output = allocator.allocate(order, warehouses);
    const expectedOutput = [{ owd: { apple: 1 } }];

    expect(output).eql(expectedOutput);
  });

  it("Happy Case, exact inventory match! 5 apples, owd warehouse", () => {
    const allocator = new InventoryAllocator();

    const order = { apple: 5 };
    const warehouses = [{ name: "owd", inventory: { apple: 5 } }];

    const output = allocator.allocate(order, warehouses);
    const expectedOutput = [{ owd: { apple: 5 } }];

    expect(output).eql(expectedOutput);
  });

  it("Happy Case, exact inventory match! 5 apples, dm warehouse", () => {
    const allocator = new InventoryAllocator();

    const order = { apple: 5 };
    const warehouses = [{ name: "dm", inventory: { apple: 5 } }];

    const output = allocator.allocate(order, warehouses);
    const expectedOutput = [{ dm: { apple: 5 } }];

    expect(output).eql(expectedOutput);
  });

  it("Not enough inventory -> no allocations!", () => {
    const allocator = new InventoryAllocator();

    const order = { apple: 1 };
    const warehouses = [{ name: "owd", inventory: { apple: 0 } }];

    const output = allocator.allocate(order, warehouses);

    expect(output).to.eql([]);
  });

  it("Should split an item across warehouses if that is the only way to completely ship an item", () => {
    const allocator = new InventoryAllocator();

    const order = { apple: 10 };
    const warehouses = [
      { name: "owd", inventory: { apple: 5 } },
      { name: "dm", inventory: { apple: 5 } },
    ];

    const output = allocator.allocate(order, warehouses);

    expect(output).to.eql([{ dm: { apple: 5 } }, { owd: { apple: 5 } }]);
  });
});
