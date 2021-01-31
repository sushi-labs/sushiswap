{ lib, stdenv, buildGoModule, libobjc, IOKit, sources ? import ../sources.nix }:

buildGoModule rec {
  pname = "celo-blockchain";
  version = "1.2.2";

  src = sources.celo-blockchain;

  runVend = true;
  vendorSha256 = "05i41djfqghqrjkrzwnldhrx2rcrh3kd3sq3yv81jm9jqgw22wzs";

  doCheck = false;

  subPackages = [
    "cmd/abidump"
    "cmd/abigen"
    "cmd/blspopchecker"
    "cmd/bootnode"
    "cmd/checkpoint-admin"
    "cmd/clef"
    "cmd/devp2p"
    "cmd/ethkey"
    "cmd/evm"
    "cmd/faucet"
    "cmd/geth"
    "cmd/p2psim"
    "cmd/rlpdump"
    "cmd/utils"
    "cmd/wnode"
  ];

  # Fix for usb-related segmentation faults on darwin
  propagatedBuildInputs = lib.optionals stdenv.isDarwin [ libobjc IOKit ];

  meta = with lib; {
    homepage = "https://celo.org/";
    description = "Official golang implementation of the Celo blockchain";
    license = with licenses; [ lgpl3 gpl3 ];
    maintainers = with maintainers; [ adisbladis lionello xrelkd RaghavSood ];
  };
}
