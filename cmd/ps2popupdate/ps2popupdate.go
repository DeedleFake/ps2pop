package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"time"

	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/sync/errgroup"
)

func getCharacterCount(ctx context.Context, since time.Duration) (int, error) {
	req, err := http.NewRequest(
		"GET",
		fmt.Sprintf(
			"https://census.daybreakgames.com/s:%v/count/ps2/character?times.last_login=]%v",
			ServiceID,
			time.Now().Add(-since).Unix(),
		),
		nil,
	)
	if err != nil {
		return 0, err
	}
	req = req.WithContext(ctx)

	rsp, err := http.DefaultClient.Do(req)
	if err != nil {
		return 0, err
	}
	defer rsp.Body.Close()

	var data struct {
		Count int `json:"count"`
	}
	err = json.NewDecoder(rsp.Body).Decode(&data)
	return data.Count, err
}

type Table struct {
	name  string
	since time.Duration
}

func (t Table) Update(ctx context.Context, db *sql.DB) error {
	_, err := db.ExecContext(ctx, fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %v (
		Date DATETIME PRIMARY KEY DEFAULT CURRENT_TIMESTAMP,
		Number INTEGER NOT NULL
	);`, t.name))
	if err != nil {
		return fmt.Errorf("Error creating %q: %v", t.name, err)
	}

	count, err := getCharacterCount(ctx, t.since)
	if err != nil {
		return fmt.Errorf("Error getting character count for %q: %v", t.name, err)
	}

	_, err = db.ExecContext(ctx, fmt.Sprintf(`INSERT INTO %v (Number) VALUES (?);`, t.name), count)
	if err != nil {
		return fmt.Errorf("Error updating %q: %v", t.name, err)
	}

	return nil
}

var (
	tables = []Table{
		{name: "days30", since: 30 * 24 * time.Hour},
		{name: "days10", since: 10 * 24 * time.Hour},
		{name: "days1", since: 24 * time.Hour},
	}
)

func main() {
	dbpath := flag.String("db", "ps2pop.db", "Path to database.")
	flag.Parse()

	db, err := sql.Open("sqlite3", *dbpath)
	if err != nil {
		log.Fatalf("Failed to open database at %q: %v", *dbpath, err)
	}
	defer db.Close()

	eg, ctx := errgroup.WithContext(context.Background())
	for _, table := range tables {
		table := table
		eg.Go(func() error {
			return table.Update(ctx, db)
		})
	}
	err = eg.Wait()
	if err != nil {
		log.Fatalln(err)
	}
}
