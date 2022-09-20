all: setup build

setup:
	curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

build:
	wasm-pack build --target=web --out-name fkl-wasm --out-dir pkg-web
	wasm-pack build --target=nodejs --out-name fkl-wasm --out-dir pkg-node

