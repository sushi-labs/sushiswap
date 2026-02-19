import { CoreClient, AppKit } from "@reown/appkit";

export const initializeReown = async () => {
  await CoreClient.initialize({ projectId: "YOUR_PROJECT_ID" });
  await AppKit.initialize({ init: CoreClient });
};

export const connectWallet = async () => {
  try {
    const session = await AppKit.Modal.open();
    console.log("Wallet connected:", session);
    return session;
  } catch (err) {
    console.error(err);
    return null;
  }
};
