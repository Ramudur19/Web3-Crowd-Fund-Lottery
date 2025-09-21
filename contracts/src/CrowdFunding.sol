// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdFunding {
    //champaign structure
    struct Campaign {
        address creator;
        uint256 goal;
        uint256 deadline;
        uint256 amountCollected;
        bool withdrawn;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    uint256 public campaignCount;

    event ChampaignCreated(
        uint256 id,
        address creator,
        uint256 goal,
        uint256 deadline
    );
    event ChampaignFunded(uint256 id, address funder, uint256 amount);
    event ChampaignWithdrawn(uint256 id, address creator, uint256 amount);
    event ChampaignRefunded(uint256 id, address funder, uint256 amount);

    //Functions

    //Cration
    function createCampaign(uint256 _goal, uint256 _durationInDays) public {
        require(_goal > 0, "Goal must be greater than 0");
        require(_durationInDays > 0, "Duration must be greater than 0");

        //Incrementing the campaign count
        campaignCount++;
        //Creating the campaign and saving it in the mapping
        campaigns[campaignCount] = Campaign({
            creator: msg.sender, //creater of the campaign
            goal: _goal,
            deadline: block.timestamp + (_durationInDays * 1 days),
            amountCollected: 0,
            withdrawn: false
        });
        emit ChampaignCreated(
            campaignCount,
            msg.sender,
            _goal,
            block.timestamp + (_durationInDays * 1 days)
        );
    }

    //Funding
    function fundCampaign(uint256 _id) public payable {
        //accessing the campaign from the mapping directly increases gas cost
        // require(campaigns[_id].deadline > block.timestamp, "Campaign has ended");
        // require(msg.value > 0, "Funding amount must be greater than 0");
        // campaigns[_id].amountCollected += msg.value;

        //creating alias to access the campaign mapping to save gas
        Campaign storage campaign = campaigns[_id];
        require(campaign.deadline > block.timestamp, "Campaign has ended");
        require(msg.value > 0, "Funding amount must be greater than 0");

        contributions[_id][msg.sender] += msg.value;
        campaign.amountCollected += msg.value;
        emit ChampaignFunded(_id, msg.sender, msg.value);
    }

    //Withdraw
    function withdrawFunds(uint256 _id) external {
        //creating alias to access the campaign mapping to save gas
        Campaign storage campaign = campaigns[_id];
        require(
            msg.sender == campaign.creator,
            "Only creator can withdraw funds"
        );
        require(
            block.timestamp > campaign.deadline,
            "Campaign is still ongoing"
        );
        require(
            campaign.amountCollected >= campaign.goal,
            "Funding goal not reached"
        );
        require(!campaign.withdrawn, "Funds already withdrawn");
        campaign.withdrawn = true;
        //payable(campaign.creator).transfer(campaign.amountCollected);

        // using call instead of transfer
        (bool success, ) = payable(campaign.creator).call{
            value: campaign.amountCollected
        }("");
        require(success, "Withdraw transfer failed");
        emit ChampaignWithdrawn(
            _id,
            campaign.creator,
            campaign.amountCollected
        );
    }

    //Refund
    function refundFunds(uint256 _id) external {
        // creating alias to access the campaign mapping to save gas
        Campaign storage campaign = campaigns[_id];
        require(
            campaign.deadline < block.timestamp,
            "Campaign is still ongoing"
        );
        require(
            campaign.amountCollected < campaign.goal,
            "Funding goal was reached"
        );

        uint256 contributedAmount = contributions[_id][msg.sender];
        require(contributedAmount > 0, "No contributions to refund");

        // reset before sending funds (to prevent re-entrancy attacks)
        contributions[_id][msg.sender] = 0;
        // payable(msg.sender).transfer(contributedAmount);
        // using call instead of transfer
        (bool success, ) = payable(msg.sender).call{value: contributedAmount}(
            ""
        );
        require(success, "Refund transfer failed");

        emit ChampaignRefunded(_id, msg.sender, contributedAmount);
    }
}
