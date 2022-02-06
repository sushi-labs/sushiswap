import { FC, useRef, useState } from "react";
import { Dialog } from "ui";
import useStore from "../../lib/store";

const Account: FC = () => {
  const [open, setOpen] = useState(false);
  const { chainId, account } = useStore((state) => state);
  const cancelButtonRef = useRef(null);

  return (
    <div className="flex flex-col">
      <h2>ChainId Using Hook: {chainId}</h2>
      <h3>Account Using Hook: {account}</h3>
      <button onClick={() => setOpen(!open)}>Connect</button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content>
          <Dialog.Header
            title="Connect wallet"
            onClose={() => setOpen(false)}
          />
          <Dialog.Description as="p">
            Are you sure you want to deactivate your account? All of your data
            will be permanently removed. This action cannot be undone.
          </Dialog.Description>
          <Dialog.Actions>
            <button
              type="button"
              className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => setOpen(false)}
            >
              Deactivate
            </button>
            <button
              type="button"
              className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => setOpen(false)}
              ref={cancelButtonRef}
            >
              Cancel
            </button>
          </Dialog.Actions>
        </Dialog.Content>
      </Dialog>
    </div>
  );
};

export default Account;
