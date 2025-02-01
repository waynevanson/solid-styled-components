{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-24.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    nixpkgs,
    flake-utils,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {inherit system;};
        nativeBuildInputs = with pkgs; [
          corepack
          direnv
          nodejs
          pnpm
        ];
      in {
        devShells.default =
          pkgs.mkShell {
            inherit system nativeBuildInputs;
          };
      }
    );
}
