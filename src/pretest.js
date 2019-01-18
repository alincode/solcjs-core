module.exports = pretest;

async function pretest(compile, version) {
  try {
    let content = getContent(version);
    await compile(content);
  } catch (error) {
    console.error('pretest failed');
    throw error;
  }
}

function getContent(version) {
  // console.log('=== version ===');
  // console.log(version);
  
  let content;
  if (version.indexOf('v0.5.') != -1) {
    content = `
    pragma solidity >0.4.99 <0.6.0;

    library OldLibrary {
      function someFunction(uint8 a) public returns(bool);
    }

    contract NewContract {
      function f(uint8 a) public returns (bool) {
          return OldLibrary.someFunction(a);
      }
    }`;
  } else if (version.indexOf('v0.4.') != -1) {
    content = `
    contract Mortal {
      address public owner;
      function Mortal() public { owner = msg.sender; }
      function kill() public { if (msg.sender == owner) selfdestruct(owner); }
    }

    contract Greeter is Mortal {
      string public greeting;
      function Greeter(string memory _greeting) public {
        greeting = _greeting;
      }
    }`;
  } else if (version.indexOf('v0.3.')) {
    content = `
    contract Ballot {

      struct Voter {
          uint weight; // weight is accumulated by delegation
          bool voted;  // if true, that person already voted
          address delegate; // person delegated to
          uint vote;   // index of the voted proposal
      }

      struct Proposal
      {
          bytes32 name;   // short name (up to 32 bytes)
          uint voteCount; // number of accumulated votes
      }

      address public chairperson;

      mapping(address => Voter) public voters;

      Proposal[] public proposals;

      function Ballot(bytes32[] proposalNames) {
          chairperson = msg.sender;
          voters[chairperson].weight = 1;

          for (uint i = 0; i < proposalNames.length; i++) {
              proposals.push(Proposal({
                  name: proposalNames[i],
                  voteCount: 0
              }));
          }
      }

      function giveRightToVote(address voter) {
          if (msg.sender != chairperson || voters[voter].voted) {
              throw;
          }
          voters[voter].weight = 1;
      }

      function delegate(address to) {
        Voter sender = voters[msg.sender];
        if (sender.voted)
            throw;

        while (
            voters[to].delegate != address(0) &&
            voters[to].delegate != msg.sender
        ) {
            to = voters[to].delegate;
        }

        if (to == msg.sender) {
            throw;
        }

        sender.voted = true;
        sender.delegate = to;
        Voter delegate = voters[to];
        if (delegate.voted) {
            // If the delegate already voted,
            // directly add to the number of votes
            proposals[delegate.vote].voteCount += sender.weight;
        }
        else {
            // If the delegate did not vote yet,
            // add to her weight.
            delegate.weight += sender.weight;
        }
      }

      function vote(uint proposal) {
        Voter sender = voters[msg.sender];
        if (sender.voted)
            throw;
        sender.voted = true;
        sender.vote = proposal;

        proposals[proposal].voteCount += sender.weight;
      }

      function winningProposal() constant
              returns (uint winningProposal)
      {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal = p;
            }
        }
      }
    }
    `;
  } else if (version.indexOf('v0.2.')) {
    content = `
    contract Test {
      function() { x = 1; }
      uint x;
    }

    // This contract rejects any Ether sent to it. It is good
    // practise to include such a function for every contract
    // in order not to loose Ether.
    contract Rejector {
        function() { throw; }
    }

    contract Caller {
      function callTest(address testAddress) {
          Test(testAddress).call(0xabcdef01); // hash does not exist
          // results in Test(testAddress).x becoming == 1.
          Rejector r = Rejector(0x123);
          r.send(2 ether);
          // results in r.balance == 0
      }
    }`;
  }
  // content = 'contract x { function g() public {} }';
  return content;
}