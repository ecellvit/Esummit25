//TODO:: (1) Set up validation for teams that are qualified via middleware

"use client";

import { useEffect, useState } from "react";
import { socket } from "@/socket";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("timer", handleTimer);
    socket.on("noArg", handleNoArg);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("timer", handleTimer);
      socket.off("noArg", handleNoArg);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  function handleHello() {
    socket.emit("hello", { name, age });
  }

  function handleNoArg() {
    console.log("No arguments received");
  }

  function handleTimer(data: { message: string, timestamp: number }) {
    console.log(data.message);
    console.log(`Last timer event: ${new Date(data.timestamp)} ago`);
  }

  return (
    <>
      <p>Status: { isConnected ? "connected" : "disconnected" }</p>
      <p>Transport: { transport }</p>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        required
      />
      <button onClick={handleHello}>
        Say Hello
      </button>
    </>
  );
}