{ sources ? import ./sources.nix, pkgs ? import sources.nixpkgs {
  overlays = [
    (_: pkgs: {
      celo-blockchain = with pkgs;
        with darwin;
        with darwin.apple_sdk.frameworks;
        import ./packages/celo-blockchain.nix {
          inherit lib stdenv buildGoModule libobjc IOKit;
        };
    })
  ];
} }:

with pkgs;

{
  shell = mkShell {
    nativeBuildInputs = [ yarn nodejs celo-blockchain ];
    CFLAGS = if stdenv.isDarwin then "-I/usr/include" else "";
    LDFLAGS = if stdenv.isDarwin then
      "-L${darwin.apple_sdk.frameworks.CoreFoundation}/Library/Frameworks:${darwin.apple_sdk.frameworks.CoreServices}/Library/Frameworks"
    else
      "";
  };
}
