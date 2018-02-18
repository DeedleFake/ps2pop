FROM debian
MAINTAINER DeedleFake

EXPOSE 8080

COPY ps2popupdate /ps2popupdate

COPY ps2pop /ps2pop
COPY cmd/ps2pop/build /pub

ENTRYPOINT ["/ps2pop"]
