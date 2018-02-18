package main

import (
	"bufio"
	"context"
	"database/sql"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

var (
	DB *sql.DB

	tables = []string{
		"days1",
		"days10",
		"days30",
	}
)

func getData(ctx context.Context, table string) (*sql.Rows, error) {
	var found bool
	for _, t := range tables {
		if t == table {
			found = true
			break
		}
	}
	if !found {
		return nil, fmt.Errorf("Invalid table: %q", table)
	}

	return DB.QueryContext(ctx, fmt.Sprintf(`SELECT * FROM %v ORDER BY Date`, table))
}

func handleData(rw http.ResponseWriter, req *http.Request) {
	rw.Header().Set("Content-Type", "application/json")
	e := json.NewEncoder(rw)

	wanted := req.FormValue("data")
	if wanted == "" {
		err := e.Encode(tables)
		if err != nil {
			log.Printf("Failed to encode table list: %v", err)
		}
		return
	}

	data, err := getData(req.Context(), wanted)
	if err != nil {
		e.Encode(map[string]interface{}{
			"error": err.Error(),
		})
		log.Printf("Failed to get data for %q: %v", wanted, err)
		return
	}
	defer data.Close()

	w := bufio.NewWriter(rw)
	defer w.Flush()
	e = json.NewEncoder(w)

	w.WriteByte('[')
	defer w.WriteByte(']')

	var comma bool
	for data.Next() {
		if comma {
			w.WriteByte(',')
		}
		comma = true

		var row struct {
			Time   time.Time `json:"time"`
			Number int       `json:"number"`
		}
		err = data.Scan(&row.Time, &row.Number)
		if err != nil {
			log.Printf("Failed to scan row: %v", err)
			continue
		}

		err = e.Encode(row)
		if err != nil {
			log.Printf("Failed to encode row: %v", err)
			continue
		}
	}
	if err := data.Err(); err != nil {
		log.Printf("Failed to get rows: %v", err)
	}
}

func main() {
	root := flag.String("root", "pub", "Root of the web server.")
	dbpath := flag.String("db", "ps2pop.db", "Path to database.")
	flag.Parse()

	db, err := sql.Open("sqlite3", *dbpath)
	if err != nil {
		log.Fatalf("Failed to open database at %q: %v", *dbpath, err)
	}
	DB = db

	http.HandleFunc("/data", handleData)
	http.Handle("/", http.FileServer(http.Dir(*root)))

	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatalf("Failed to start web server: %v", err)
	}
}
