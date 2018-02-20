package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	_ "github.com/lib/pq"
	"golang.org/x/sync/errgroup"
)

const (
	Table = "population"
)

type Key struct {
	Name  string
	Since time.Duration
}

type Update struct {
	Name   string
	Amount int
}

var (
	keys = []Key{
		{Name: "days1", Since: 24 * time.Hour},
		{Name: "days10", Since: 10 * 24 * time.Hour},
		{Name: "days30", Since: 30 * 24 * time.Hour},
	}
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

func getUpdates(ctx context.Context, updates chan<- Update) error {
	defer close(updates)

	eg, ctx := errgroup.WithContext(ctx)
	for _, key := range keys {
		key := key
		eg.Go(func() error {
			count, err := getCharacterCount(ctx, key.Since)
			if err != nil {
				return fmt.Errorf("Error getting update for %q: %v", key.Name, err)
			}

			select {
			case <-ctx.Done():
				return ctx.Err()

			case updates <- Update{
				Name:   key.Name,
				Amount: count,
			}:
			}

			return nil
		})
	}
	err := eg.Wait()
	if err != nil {
		return err
	}
	return nil
}

func initTable(ctx context.Context, db *sql.DB) error {
	var cols []string
	for _, key := range keys {
		cols = append(cols, fmt.Sprintf("%v INTEGER NOT NULL", key.Name))
	}

	_, err := db.ExecContext(ctx, fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %v (
		date TIMESTAMP PRIMARY KEY DEFAULT CURRENT_TIMESTAMP,
		%v
	);`, Table, strings.Join(cols, ", ")))
	if err != nil {
		return fmt.Errorf("Error creating table %q: %v", Table, err)
	}
	return nil
}

func main() {
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
	defer db.Close()

	eg, ctx := errgroup.WithContext(context.Background())

	updates := make(chan Update, len(keys))
	eg.Go(func() error {
		return getUpdates(ctx, updates)
	})

	eg.Go(func() error {
		return initTable(ctx, db)
	})

	err = eg.Wait()
	if err != nil {
		log.Fatalln(err)
	}

	var cols []string
	var params []string
	var counts []interface{}
	for update := range updates {
		cols = append(cols, update.Name)
		params = append(params, fmt.Sprintf("$%v", len(params)+1))
		counts = append(counts, update.Amount)
	}

	_, err = db.Exec(fmt.Sprintf(
		`INSERT INTO %v (%v) VALUES (%v);`,
		Table,
		strings.Join(cols, ", "),
		strings.Join(params, ", "),
	), counts...)
	if err != nil {
		log.Fatalf("Failed to insert data: %v", err)
	}
}
