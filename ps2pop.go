package main

import (
	"flag"
	"log"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

func tracker() {
	// TODO: Track population.
}

func handleData(rw http.ResponseWriter, req *http.Request) {
	// TODO: Serialize population.
}

func main() {
	root := flag.String("root", "pub", "Root of the web server.")
	flag.Parse()

	go tracker()

	http.HandleFunc("/data", handleData)
	http.Handle("/", http.FileServer(http.Dir(*root)))

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatalf("Failed to start web server: %v", err)
	}
}
