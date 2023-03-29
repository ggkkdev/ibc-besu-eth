# IBC transfer from besu to ethereum

Install
```sh
$ pnpm install
```

## Run with make
Build, migrate, handshake
```sh
$ make setup
```
Make transfer from besu to ethereum
```sh
$ make transfer
```

## Without make

Build the contracts
```sh
$ pnpm typechain
```

Build the relayer
```sh
$ cd relayer
$ go build -o ./build/uly .
$ cd ..
```

Build the two chains
```sh
$ docker compose build --no-cache
```

Start chains
```sh
$ docker compose up -d ibc0 ibc1
```

Deploy the contracts on both
```sh
$ pnpm hardhat deploy:IBC --network ibc0
$ pnpm hardhat deploy:IBC --network ibc1
```

Handshake from the relayer
```sh
$ ./relayer-scripts/init-rly
```

Start the relayer
```sh
$ ./relayer-scripts/relayer-start
```

Transfer
```sh
$ pnpm hardhat transfer:IBC --network ibc0
```

Check the balance on the other chain
```sh
$ pnpm hardhat check:IBC --network ibc1
```
