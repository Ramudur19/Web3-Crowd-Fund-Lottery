import React, { useState } from "react";
import { parseEther } from "ethers";
import { useCrowdFunding } from "../Hooks/useCrowdFunding";
import { useMetaMaskAuth } from "../Hooks/useMetaMaskAuth";
import { api } from "../api/axios";
import "./CreateChampaign.css";

const CreateCampaign: React.FC = () => {
  const { account, connectWallet } = useMetaMaskAuth();
  const { contract, signer } = useCrowdFunding(account);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState(7);
  const [story, setStory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!contract || !signer) return alert("Connect wallet first!");

    try {
      const goalWei = parseEther(goal);
      const tx = await contract.createCampaign(goalWei, duration);
      await tx.wait();

      const campaignId = await contract.campaignCount();
      const creator = await signer.getAddress();

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("story", story);
      formData.append("campaignId", Number(campaignId).toString());
      formData.append("creator", creator);
      formData.append("goal", goalWei.toString());
      formData.append("deadline", (Math.floor(Date.now() / 1000) + duration * 24 * 3600).toString());
      if (image) formData.append("image", image);

      await api.post("/campaigns", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Campaign created successfully!");
      setTitle("");
      setDescription("");
      setGoal("");
      setDuration(7);
      setStory("");
      setImage(null);
      setPreview(null);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error creating campaign");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImage(file || null);
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="create-campaign-container">
      <div className="form-card">
        <h2> Launch a New Campaign</h2>
        <p className="subtitle">Share your story and raise funds securely.</p>

        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <input placeholder="Goal (ETH)" value={goal} onChange={e => setGoal(e.target.value)} />
        <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} />
        <textarea placeholder="Story" rows={6} value={story} onChange={e => setStory(e.target.value)} />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && <img src={preview} alt="preview" />}

        <button onClick={handleCreate}>Create Campaign</button>
        {!account && <button onClick={connectWallet}>Connect MetaMask</button>}
      </div>
    </div>
  );
};

export default CreateCampaign;
