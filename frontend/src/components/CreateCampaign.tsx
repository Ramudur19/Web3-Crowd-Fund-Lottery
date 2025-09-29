import React, { useState } from "react";
import { parseEther } from "ethers";
import { useCrowdFunding } from "../contracts/useCrowdFunding";
import { api } from "../api/axios";

const CreateCampaign: React.FC = () => {
  const { contract, signer } = useCrowdFunding();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState(7);

  const handleCreate = async () => {
    if (!contract || !signer) return;
    try {
      const goalWei = parseEther(goal); // use parseEther directly
      const tx = await contract.createCampaign(goalWei, duration);
      await tx.wait();

      const campaignId = await contract.campaignCount();

      await api.post("/campaigns", {
        title,
        description,
        campaignId: Number(campaignId),
        creator: await signer.getAddress(),
        goal: goalWei.toString(),
        deadline: Math.floor(Date.now() / 1000) + duration * 24 * 3600
      });

      alert("Campaign created successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error creating campaign");
    }
  };

  return (
    <div>
      <h2>Create Campaign</h2>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <input placeholder="Goal in ETH" value={goal} onChange={e => setGoal(e.target.value)} />
      <input placeholder="Duration in days" type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} />
      <button onClick={handleCreate}>Create</button>
    </div>
  );
};

export default CreateCampaign;
