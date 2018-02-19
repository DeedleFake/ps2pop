export CGO_ENABLED=0

.PHONY: all clean

all: build ps2pop

clean:
	go clean -x
	npm run clean

build:
	npm run build

ps2pop:
	go build -v
