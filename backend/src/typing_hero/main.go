package main

import (
	"fmt"
	"net/http"
)
func main() {
  fmt.Print("Hello")

  http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    var greeting = "hello user! You are on my web page!"
    fmt.Fprintln(w, greeting)
  })

  http.ListenAndServe(":8080", nil)
}
