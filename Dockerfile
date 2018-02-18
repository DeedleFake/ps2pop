FROM alpine
MAINTAINER DeedleFake

EXPOSE 8080

COPY cmd/ps2popupdate/ps2popupdate /ps2popupdate

COPY ps2pop /ps2pop
COPY build /pub

CMD ["/ps2pop"]
