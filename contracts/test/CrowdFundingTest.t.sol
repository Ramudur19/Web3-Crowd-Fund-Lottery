// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test, console} from "forge-std/Test.sol";
import {CrowdFunding} from "../src/CrowdFunding.sol";

contract CrowdFundingTest is Test {
    CrowdFunding public crowdFunding;
    address creator = address(0x1);
    address funder1 = address(0x2);
    address funder2 = address(0x3);

    function setUp() public {
        crowdFunding = new CrowdFunding();
    }

    // Test campaign creation
    function testCreateCampaign() public {
        // using prank to simulate msg.sender
        vm.prank(creator);
        crowdFunding.createCampaign(1 ether, 10); // 10 days duration

        // Fetch the created campaign
        (
            address _creator,
            uint256 goal,
            uint256 deadline,
            uint256 amountCollected,
            bool withdrawn
        ) = crowdFunding.campaigns(1);
        // checking the campaign details
        assertEq(_creator, creator);
        assertEq(goal, 1 ether);
        assertTrue(deadline > block.timestamp);
        assertEq(amountCollected, 0);
        assertFalse(withdrawn);
    }

    //test funding a campaign
    function testFundingChampaign() public {
        // Create a campaign first
        vm.prank(creator);
        crowdFunding.createCampaign(1 ether, 10); // 10 days duration

        // Fund the campaign from funder1
        vm.deal(funder1, 2 ether); // give funder1 some ETH
        vm.prank(funder1);
        crowdFunding.fundCampaign{value: 0.5 ether}(1);

        // Fund the campaign from funder2
        vm.deal(funder2, 2 ether); // give funder2 some ETH
        vm.prank(funder2);
        crowdFunding.fundCampaign{value: 0.3 ether}(1);

        // Fetch the campaign details
        (, , , uint256 amountCollected, ) = crowdFunding.campaigns(1);
        assertEq(amountCollected, 0.8 ether);

        // Check individual contributions
        uint256 contributionFunder1 = crowdFunding.contributions(1, funder1);
        uint256 contributionFunder2 = crowdFunding.contributions(1, funder2);
        assertEq(contributionFunder1, 0.5 ether);
        assertEq(contributionFunder2, 0.3 ether);
    }

    //test withdraw champaign funds by creator
    function testWithdrawFundsSuccess() public {
        //creating a campaign first
        vm.prank(creator);
        crowdFunding.createCampaign(1 ether, 5);

        //funding the campaign
        vm.deal(funder1, 2 ether);
        vm.prank(funder1);
        crowdFunding.fundCampaign{value: 1 ether}(1);

        // move time forward beyond deadline
        vm.warp(block.timestamp + 6 days);

        //withdraw funds by creator
        uint256 beforeBalance = creator.balance;
        vm.prank(creator);
        crowdFunding.withdrawFunds(1);

        uint256 afterBalance = creator.balance;
        assertEq(afterBalance, beforeBalance + 1 ether);
    }

    // test withdraw champaign funds by non-creator
    function testWithdrawFundsFailNotCreator() public {
        //creating a campaign first
        vm.prank(creator);
        crowdFunding.createCampaign(1 ether, 5);

        //funding the campaign
        vm.deal(funder1, 2 ether);
        vm.prank(funder1);
        crowdFunding.fundCampaign{value: 1 ether}(1);

        // move time forward beyond deadline
        vm.warp(block.timestamp + 6 days);

        //attempt withdraw funds by non-creator
        vm.prank(funder1);
        vm.expectRevert("Only creator can withdraw funds");
        crowdFunding.withdrawFunds(1);
    }

    // test withdraw champaign funds before deadline
    function testWithdrawFundsFailBeforeDeadline() public {
        //creating a campaign first
        vm.prank(creator);
        crowdFunding.createCampaign(1 ether, 5);

        //funding the campaign
        vm.deal(funder1, 2 ether);
        vm.prank(funder1);
        crowdFunding.fundCampaign{value: 1 ether}(1);

        //attempt withdraw funds by creator before deadline
        vm.prank(creator);
        vm.expectRevert("Campaign is still ongoing");
        crowdFunding.withdrawFunds(1);
    }

    // test withdraw champaign funds if goal not reached
    function testWithdrawFundsFailGoalNotReached() public {
        //creating a campaign first
        vm.prank(creator);
        crowdFunding.createCampaign(1 ether, 5);

        //funding the campaign with less than goal
        vm.deal(funder1, 2 ether);
        vm.prank(funder1);
        crowdFunding.fundCampaign{value: 0.5 ether}(1);

        // move time forward beyond deadline
        vm.warp(block.timestamp + 6 days);

        //attempt withdraw funds by creator when goal not reached
        vm.prank(creator);
        vm.expectRevert("Funding goal not reached");
        crowdFunding.withdrawFunds(1);
    }

    // test withdraw champaign funds twice
    function testWithdrawFundsFailAlreadyWithdrawn() public {
        //creating a campaign first
        vm.prank(creator);
        crowdFunding.createCampaign(1 ether, 5);

        //funding the campaign
        vm.deal(funder1, 2 ether);
        vm.prank(funder1);
        crowdFunding.fundCampaign{value: 1 ether}(1);

        // move time forward beyond deadline
        vm.warp(block.timestamp + 6 days);

        //withdraw funds by creator first time
        vm.prank(creator);
        crowdFunding.withdrawFunds(1);

        //attempt withdraw funds by creator second time
        vm.prank(creator);
        vm.expectRevert("Funds already withdrawn");
        crowdFunding.withdrawFunds(1);
    }

    // test funding a non-existent campaign
    function testFundNonExistentCampaign() public {
        vm.deal(funder1, 2 ether);
        vm.prank(funder1);
        vm.expectRevert();
        crowdFunding.fundCampaign{value: 0.5 ether}(999); // Non-existent campaign ID
    }

    // test creating a campaign with zero goal
    function testCreateCampaignFailZeroGoal() public {
        vm.prank(creator);
        vm.expectRevert("Goal must be greater than 0");
        crowdFunding.createCampaign(0, 10);
    }

    // test creating a campaign with zero duration
    function testCreateCampaignFailZeroDuration() public {
        vm.prank(creator);
        vm.expectRevert("Duration must be greater than 0");
        crowdFunding.createCampaign(1 ether, 0);
    }

    // test funding a campaign with zero value
    function testFundCampaignFailZeroValue() public {
        // Create a campaign first
        vm.prank(creator);
        crowdFunding.createCampaign(1 ether, 10); // 10 days duration

        // Attempt to fund with zero value
        vm.prank(funder1);
        vm.expectRevert("Funding amount must be greater than 0");
        crowdFunding.fundCampaign{value: 0}(1);
    }

    // test funding a campaign after deadline

    function testFundCampaignFailAfterDeadline() public {
        // Create a campaign first
        vm.prank(creator);
        crowdFunding.createCampaign(1 ether, 5); // 5 days duration

        // Move time forward beyond deadline
        vm.warp(block.timestamp + 6 days);

        // Attempt to fund after deadline
        vm.deal(funder1, 2 ether);
        vm.prank(funder1);
        vm.expectRevert("Campaign has ended");
        crowdFunding.fundCampaign{value: 0.5 ether}(1);
    }

    // test refund champaign funds in the contract

    function testRefundFunds() public {
        //creating a campaign first
        vm.prank(creator);
        crowdFunding.createCampaign(1 ether, 5);

        //funding the campaign
        vm.deal(funder1, 2 ether);
        vm.prank(funder1);
        crowdFunding.fundCampaign{value: 0.5 ether}(1);

        vm.deal(funder2, 2 ether);
        vm.prank(funder2);
        crowdFunding.fundCampaign{value: 0.3 ether}(1);

        // move time forward beyond deadline
        vm.warp(block.timestamp + 6 days);

        //refund funds by funders
        uint256 beforeBalanceFunder1 = funder1.balance;
        uint256 beforeBalanceFunder2 = funder2.balance;

        vm.prank(funder1);
        crowdFunding.refundFunds(1);

        vm.prank(funder2);
        crowdFunding.refundFunds(1);

        uint256 afterBalanceFunder1 = funder1.balance;
        uint256 afterBalanceFunder2 = funder2.balance;

        assertEq(afterBalanceFunder1, beforeBalanceFunder1 + 0.5 ether);
        assertEq(afterBalanceFunder2, beforeBalanceFunder2 + 0.3 ether);
    }

    // test refund champaign funds if goal reached
    function testRefundFundsFailGoalReached() public {
        //creating a campaign first
        vm.prank(creator);
        crowdFunding.createCampaign(1 ether, 5);

        //funding the campaign
        vm.deal(funder1, 2 ether);
        vm.prank(funder1);
        crowdFunding.fundCampaign{value: 1 ether}(1);

        // move time forward beyond deadline
        vm.warp(block.timestamp + 6 days);

        //attempt refund funds by funder when goal reached
        vm.prank(funder1);
        vm.expectRevert("Funding goal was reached");
        crowdFunding.refundFunds(1);
    }

    // test refund champaign funds before deadline
    function testRefundFundsFailBeforeDeadline() public {
        //creating a campaign first
        vm.prank(creator);
        crowdFunding.createCampaign(1 ether, 5);

        //funding the campaign
        vm.deal(funder1, 2 ether);
        vm.prank(funder1);
        crowdFunding.fundCampaign{value: 0.5 ether}(1);

        //attempt refund funds by funder before deadline
        vm.prank(funder1);
        vm.expectRevert("Campaign is still ongoing");
        crowdFunding.refundFunds(1);
    }

    // test refund champaign funds if no contributions

    function testRefundFundsFailNoContributions() public {
        //creating a campaign first
        vm.prank(creator);
        crowdFunding.createCampaign(1 ether, 5);

        // move time forward beyond deadline
        vm.warp(block.timestamp + 6 days);

        //attempt refund funds by funder with no contributions
        vm.prank(funder1);
        vm.expectRevert("No contributions to refund");
        crowdFunding.refundFunds(1);
    }

    //test refund champaign funds twice by same funder
    function testRefundFundsFailAlreadyRefunded() public {
        //creating a campaign first
        vm.prank(creator);
        crowdFunding.createCampaign(1 ether, 5);

        //funding the campaign
        vm.deal(funder1, 2 ether);
        vm.prank(funder1);
        crowdFunding.fundCampaign{value: 0.5 ether}(1);

        // move time forward beyond deadline
        vm.warp(block.timestamp + 6 days);

        //refund funds by funder first time
        vm.prank(funder1);
        crowdFunding.refundFunds(1);

        //attempt refund funds by funder second time
        vm.prank(funder1);
        vm.expectRevert("No contributions to refund");
        crowdFunding.refundFunds(1);
    }
}
