# setup
.PHONY: setup down
setup: build network sleep migrate handshake relayer-start

# build
.PHONY: build build-contract build-relayer
build: build-contract build-relayer build-container

build-contract:
	pnpm typechain

build-relayer:
	@make -C relayer build

build-container:
	@make -C chains build

# network
.PHONY: network network-down
network:
	@make -C chains network

network-down:
	@make -C chains network-down

# contract migration
.PHONY: migrate
migrate:
	pnpm hardhat deploy:IBC --network ibc0
	pnpm hardhat deploy:IBC --network ibc1
	#npx hardhat run scripts/deploy.ts --network ibc0
	#npx hardhat run scripts/deploy.ts --network ibc1

# contract migration
.PHONY: transfer
transfer:
	pnpm hardhat transfer:IBC --network ibc0
	@make sleep
	pnpm hardhat check:IBC --network ibc1

# relayer
.PHONY: handshake relayer-start relayer-stop
handshake:
	./relayer-scripts/init-rly

relayer-start:
	./relayer-scripts/relayer-start

relayer-stop:
	./relayer-scripts/relayer-stop

.PHONY: sleep
sleep:
	sleep 5

.PHONY: proto
proto:
ifndef SOLPB_DIR
	$(error SOLPB_DIR is not specified)
else
	. ./scripts/solpb.sh
endif
