import { Address } from 'ethereumjs-util';
import Common from '@ethereumjs/common';
import { PrecompileInput, PrecompileFunc } from './types';
interface Precompiles {
    [key: string]: PrecompileFunc;
}
declare const ripemdPrecompileAddress = "0000000000000000000000000000000000000003";
declare const precompiles: Precompiles;
declare type DeletePrecompile = {
    address: Address;
};
declare type AddPrecompile = {
    address: Address;
    function: PrecompileFunc;
};
declare type CustomPrecompile = AddPrecompile | DeletePrecompile;
declare function getActivePrecompiles(common: Common, customPrecompiles?: CustomPrecompile[]): Map<string, PrecompileFunc>;
export { PrecompileFunc, PrecompileInput, DeletePrecompile, AddPrecompile, CustomPrecompile, ripemdPrecompileAddress, getActivePrecompiles, precompiles, };
