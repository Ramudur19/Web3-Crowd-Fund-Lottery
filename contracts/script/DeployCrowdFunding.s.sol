// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {Script} from "forge-std/Script.sol";
import {CrowdFunding} from "../src/CrowdFunding.sol";

contract DeployCrowdFunding is Script {
    function run() external returns (CrowdFunding) {
        //vm is a special cheatcode object provided by Foundry to interact with the EVM
        vm.startBroadcast();
        CrowdFunding crowdFunding = new CrowdFunding();

        vm.stopBroadcast();

        return crowdFunding;
    }
}
