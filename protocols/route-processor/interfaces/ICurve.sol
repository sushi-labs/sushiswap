
interface ICurve {
  function exchange(int128 i, int128 j, uint256 dx, uint256 min_dy) payable external returns (uint256);
}

interface ICurveLegacy {
  function exchange(int128 i, int128 j, uint256 dx, uint256 min_dy) payable external;
}

