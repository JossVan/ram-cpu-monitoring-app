package main

import (
	//"log"
	"fmt"
	"log"
	"net/http"
	"os/exec"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func reader(conn *websocket.Conn) {
	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		log.Println(string(p))

		if err := conn.WriteMessage(messageType, p); err != nil {
			log.Println(err)
		}
	}
}

func inicio(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "inicio")
}
func infoRam(w http.ResponseWriter, r *http.Request) {
	//CREO UNA FUNCIÓN WEBSOCKET PARA ENVIAR LOS DATOS DE LA RAM

	upgrader.CheckOrigin = func(r *http.Request) bool {
		return true
	}
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {

		log.Print(err)
		return
	} else {
		cmd := exec.Command("sh", "-c", "cat /proc/memo_201602676")
		out, errorcito := cmd.CombinedOutput()
		if errorcito != nil {
			log.Print(errorcito)
			return
		}
		salida := string(out[:])
		fmt.Fprintf(w, salida)
	}

	reader(ws)
}
func setupRoutes() {
	http.HandleFunc("/", inicio)
	http.HandleFunc("/RAM", infoRam)
}

func main() {
	setupRoutes()
	fmt.Println("buenas...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
