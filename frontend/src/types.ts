export interface Campaign {
    _id?: string;
    title: string;
    description?: string;
    story?: string;
    image?: string;
    campaignId: number;
    creator: string;
    goal: string; // in wei
    deadline: number; // timestamp
    amountCollected: string; // in wei
}