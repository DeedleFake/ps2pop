package main

import (
	"bufio"
	"database/sql"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"time"

	_ "github.com/lib/pq"
)

const (
	Table = "population"
)

var (
	DB *sql.DB

	cols = []string{
		"days1",
		"days10",
		"days30",
	}
)

func handleData(rw http.ResponseWriter, req *http.Request) {
	rw.Header().Set("Content-Type", "application/json")
	e := json.NewEncoder(rw)

	rows, err := DB.QueryContext(req.Context(), fmt.Sprintf(`SELECT * FROM %v ORDER BY date;`, Table))
	if err != nil {
		e.Encode(map[string]interface{}{
			"error": err.Error(),
		})
		log.Printf("Failed to get data: %v", err)
		return
	}
	defer rows.Close()

	w := bufio.NewWriter(rw)
	defer w.Flush()
	e = json.NewEncoder(w)

	w.WriteByte('[')
	defer w.WriteByte(']')

	var comma bool
	for rows.Next() {
		if comma {
			w.WriteByte(',')
		}
		comma = true

		data := []interface{}{new(time.Time)}
		for range cols {
			data = append(data, new(int))
		}

		err = rows.Scan(data...)
		if err != nil {
			log.Printf("Failed to scan row: %v", err)
			continue
		}

		row := map[string]interface{}{
			"time": data[0],
		}
		for i, col := range cols {
			row[col] = data[i+1]
		}

		err = e.Encode(row)
		if err != nil {
			log.Printf("Failed to encode row: %v", err)
			continue
		}
	}
	if err := rows.Err(); err != nil {
		log.Printf("Failed to get rows: %v", err)
	}
}

func main() {
	root := flag.String("root", "pub", "Root of the web server.")
	addr := flag.String("addr", ":8080", "Address to listen on.")
	dbaddr := flag.String("dbaddr", "localhost", "Database address.")
	dbuser := flag.String("dbuser", "postgres", "Database user.")
	dbpass := flag.String("dbpass", "", "Database password.")
	dbname := flag.String("dbname", "ps2pop", "Database name.")
	flag.Parse()

	db, err := sql.Open("postgres", fmt.Sprintf(
		"postgres://%v:%v@%v/%v?sslmode=disable",
		*dbuser,
		*dbpass,
		*dbaddr,
		*dbname,
	))
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}
	DB = db

	http.HandleFunc("/data", handleData)
	http.Handle("/", http.FileServer(http.Dir(*root)))

	log.Printf("Starting HTTP server on %q", *addr)
	err = http.ListenAndServe(*addr, nil)
	if err != nil {
		log.Fatalf("Failed to start web server: %v", err)
	}
}
