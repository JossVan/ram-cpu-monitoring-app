package main

import (
	//"log"
	"fmt"
	"io"
	"log"
	"net/http"
	"os/exec"
)

func inicio(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Bienvenido... Proyecto 1")
}
func enableCors(w http.ResponseWriter) {
	(w).Header().Set("Access-Control-Allow-Origin", "*")
}
func infoRam(w http.ResponseWriter, r *http.Request) {
	enableCors(w)
	cmd := exec.Command("sh", "-c", "cat /proc/memo_201602676")
	out, errorcito := cmd.CombinedOutput()
	if errorcito != nil {
		log.Print(errorcito)
		return
	}
	salida := string(out[:])
	io.WriteString(w, salida)
}
func procesos(w http.ResponseWriter, r *http.Request) {
	enableCors(w)
	cmd := exec.Command("sh", "-c", "cat /proc/cpu_201602676")
	out, errorcito := cmd.CombinedOutput()
	if errorcito != nil {
		log.Print(errorcito)
		return
	}
	salida := string(out[:])
	io.WriteString(w, salida)
}

func setupRoutes() {
	http.HandleFunc("/", inicio)
	http.HandleFunc("/RAM", infoRam)
	http.HandleFunc("/procesos", procesos)
}

func main() {
	setupRoutes()
	fmt.Println("buenas...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
