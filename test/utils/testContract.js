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
  v425: `
    contract Mortal {
    address publi owner;
    constructor() public { owner = msg.sender; }
    function kill() public { if (msg.sender == owner) selfdestruct(owner); }
  }
    contract Greeter is Mortal {
    string public greeting;
    constructor(string memory _greeting) public {
      greeting = _greeting;
    }
  }`
  
};