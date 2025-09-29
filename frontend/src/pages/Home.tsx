import React from "react";
import CampaignList from "../components/CampaignList";
import CreateCampaign from "../components/CreateCampaign";

const Home: React.FC = () => {
  return (
    <div>
      <h1>Decentralized Crowdfunding</h1>
      <CreateCampaign />
      <CampaignList />
    </div>
  );
};

export default Home;
