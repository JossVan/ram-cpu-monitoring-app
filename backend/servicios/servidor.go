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

func kill(w http.ResponseWriter, r *http.Request) {
	enableCors(w)
	listapid, existen := r.URL.Query()["pid"]
	// Imprimir para depurar
	fmt.Printf("%v\n", listapid)
	if existen {
		cmd := exec.Command("sh", "-c", "kill -9 "+listapid[0])
		out, errorcito := cmd.CombinedOutput()
		if errorcito != nil {
			log.Print(errorcito)
			return
		}
		io.WriteString(w, string(out[:]))
	} else {

		io.WriteString(w, "efe")
	}

}

func setupRoutes() {
	http.HandleFunc("/", inicio)
	http.HandleFunc("/RAM", infoRam)
	http.HandleFunc("/procesos", procesos)
	http.HandleFunc("/kill", kill)
}

func main() {
	setupRoutes()
	fmt.Println("buenas...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
