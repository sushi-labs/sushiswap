import { Methods } from '../communication';
import { Safe } from '../safe';
import { Wallet } from '../wallet';

import { Permission, PermissionsError, PERMISSIONS_REQUEST_REJECTED } from '../types/permissions';

const hasPermission = (required: Methods, permissions: Permission[]): boolean =>
  permissions.some((permission) => permission.parentCapability === required);

const requirePermission = () => (_: unknown, propertyKey: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;

  descriptor.value = async function () {
    // @ts-expect-error accessing private property from decorator. 'this' context is the class instance
    const wallet = new Wallet((this as Safe).communicator);

    let currentPermissions = await wallet.getPermissions();

    if (!hasPermission(propertyKey as Methods, currentPermissions)) {
      currentPermissions = await wallet.requestPermissions([{ [propertyKey as Methods]: {} }]);
    }

    if (!hasPermission(propertyKey as Methods, currentPermissions)) {
      throw new PermissionsError('Permissions rejected', PERMISSIONS_REQUEST_REJECTED);
    }

    return originalMethod.apply(this);
  };

  return descriptor;
};

export default requirePermission;
