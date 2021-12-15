package main

import (
	//"log"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os/exec"
	"strings"
)

func inicio(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Bienvenido... Proyecto 1")
}
func enableCors(w http.ResponseWriter, req *http.Request) {
	(w).Header().Set("Access-Control-Allow-Origin", "*")
	(w).Header().Set("Access-Control-Allow-Credentials", "true")
	(w).Header().Set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
	(w).Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
}
func infoRam(w http.ResponseWriter, r *http.Request) {
	enableCors(w, r)
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
	enableCors(w, r)
	cmd := exec.Command("sh", "-c", "cat /proc/cpu_201602676")
	out, errorcito := cmd.CombinedOutput()
	if errorcito != nil {
		log.Print(errorcito)
		return
	}
	salida := string(out[:])
	io.WriteString(w, salida)
}
func usuario(w http.ResponseWriter, r *http.Request) {
	enableCors(w, r)
	decoder := json.NewDecoder(r.Body)
	var params map[string]string
	decoder.Decode(&params)
	if len(params) != 0 {
		comando := "getent passwd " + params["user"] + " | cut -d: -f1"
		cmd := exec.Command("sh", "-c", comando)
		out, errorcito := cmd.CombinedOutput()
		if errorcito != nil {
			io.WriteString(w, "{\"values\":\"false\"}")
			return
		}
		salida := string(out[:])
		salida = strings.Replace(salida, "\n", "", 2)
		salida = "{\"values\":\"" + salida + "\"}"

		io.WriteString(w, salida)
	}
}
func kill(w http.ResponseWriter, r *http.Request) {
	enableCors(w, r)
	decoder := json.NewDecoder(r.Body)
	var params map[string]string
	decoder.Decode(&params)

	if len(params) != 0 {
		comando := "echo admin | sudo -S kill " + params["pid"]
		cmd := exec.Command("sh", "-c", comando)
		out, errorcito := cmd.CombinedOutput()
		if errorcito != nil {
			io.WriteString(w, "{ok:\"false\"}")
			return
		}
		fmt.Println(string(out[:]))
		io.WriteString(w, "{ok:\"true\"}")
	}

}
func cpu(w http.ResponseWriter, r *http.Request) {
	enableCors(w, r)
	cmd := exec.Command("sh", "-c", "top -bn 1 -i -c | head -n 3 | tail -1 | awk {'print $8'}")
	out, errorcito := cmd.CombinedOutput()
	if errorcito != nil {
		fmt.Println(errorcito)
		return
	}
	salida := string(out[:])
	salida = strings.Replace(salida, "\n", "", 2)
	io.WriteString(w, "{\"total\":\""+salida+"\"}")
}
func setupRoutes() {
	http.HandleFunc("/", inicio)
	http.HandleFunc("/RAM", infoRam)
	http.HandleFunc("/procesos", procesos)
	http.HandleFunc("/kill", kill)
	http.HandleFunc("/cpu", cpu)
	http.HandleFunc("/user", usuario)
}

func main() {
	setupRoutes()
	fmt.Println("buenas...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
