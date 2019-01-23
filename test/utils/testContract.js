module.exports = {
  v5WithImport: `
  pragma solidity >=0.4.0 <0.6.0;

    import "lib.sol";

    contract SimpleStorage {
        uint storedData;

        function set(uint x) public {
            storedData = x;
        }

        function get() public view returns (uint) {
            return storedData;
        }
    }
  `,
  v5: `
  pragma solidity >=0.4.0 <0.6.0;
    contract SimpleStorage {
        uint storedData;

        function set(uint x) public {
            storedData = x;
        }

        function get() public view returns (uint) {
            return storedData;
        }
    }
  `,
  v5WithError: `
  pragma solidity >0.4.99 <0.6.0;

  contract NewContract {
    int num = 2;

    using ZLibrary for int;

    function addTwo() {
      num = num.add(40);
    }
  }

  library ZLibrary {
    function add(int num1, int num2) view returns(int result) {
      return num1 + num2;
    }
  }
  `
};