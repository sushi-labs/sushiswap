# Perl Documentation
# # 's/search/replace/g'

##################################################
#            Changes to MasterChefV2             #
##################################################

# SafeTransfer simplification
perl -0777 -i -pe 's/safeT/t/g' ../../contracts/MasterChefV2.sol

# Adding public to totalAllocPoint
perl -0777 -i -pe 's/uint256 totalAllocPoint/uint256 public totalAllocPoint/g' ../../contracts/MasterChefV2.sol

# Adding virtual to sushiPerBlock()
perl -0777 -i -pe 's/function sushiPerBlock\(\) public view returns/function sushiPerBlock\(\) public view virtual returns/g' ../../contracts/MasterChefV2.sol