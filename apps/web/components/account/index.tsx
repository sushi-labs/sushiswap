import { FC, useRef, useState } from "react";
import priorityConnector from "app/connectors/priorityConnector";
import { Button, Dialog } from "ui";
const { usePriorityWeb3React } = priorityConnector;

const Account: FC = () => {
  const [open, setOpen] = useState(false);
  const { chainId, account } = usePriorityWeb3React(undefined);
  const cancelButtonRef = useRef(null);

  return (
    <div className="flex flex-col">
      <h2>ChainId Using Hook: {chainId}</h2>
      <h3>Account Using Hook: {account}</h3>
      <Button onClick={() => setOpen(!open)}>Connect</Button>

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
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => setOpen(false)}
            >
              Deactivate
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
