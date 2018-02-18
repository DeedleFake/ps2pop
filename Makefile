DOCKERTARG=deedlefake/ps2pop

.PHONY: all docker clean

all: docker

clean:
	$(MAKE) -C cmd/ps2pop $@
	$(MAKE) -C cmd/ps2popupdate $@

docker: cmd/ps2popupdate/ps2popupdate cmd/ps2pop/ps2pop cmd/ps2pop/build
	docker build -t $(DOCKERTARG) .

cmd/ps2popupdate/ps2popupdate:
	$(MAKE) -C cmd/ps2popupdate $(notdir $@)

cmd/ps2pop/ps2pop:
	$(MAKE) -C cmd/ps2pop $(notdir $@)

cmd/ps2pop/build:
	$(MAKE) -C cmd/ps2pop $(notdir $@)
