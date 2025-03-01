"use client";

import { useState } from "react";
import { AiFillMessage } from "react-icons/ai";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const presetQuestions = [
  "¿Qué combina con el color amarillo?",
  "¿Qué combina con una camiseta azul?",
  "¿Qué combina con el color rojo?",
  "¿Qué combina con una camiseta roja?",
];

const predefinedResponses: Record<string, string> = {
  "¿qué combina con el color amarillo?":
    "Con una camiseta blanca, jeans azules o incluso accesorios negros. ¡El contraste queda genial!",
  "¿qué combina con una camiseta azul?":
    "Puedes usar pantalones beige, unos jeans grises o una chaqueta de cuero negra. Todo depende del estilo que busques.",
    "¿qué combina con el color rojo?":
    "Con una camiseta blanca, jeans azules o incluso accesorios negros. ¡El contraste queda genial!",
    "¿qué combina con una camiseta roja?":
    "Puedes usar pantalones beige, unos jeans grises o una chaqueta de cuero negra. Todo depende del estilo que busques.",
};

export default function SimpleChatbot() {
  const [isOpen, setIsOpen] = useState(false); 
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const handlePresetClick = (question: string) => {
    setUserInput(question);
    handleSendMessage(question);
  };

  const handleSendMessage = (input?: string) => {
    const textToSend = input ?? userInput;
    if (!textToSend.trim()) return;

    const newMessage: Message = { sender: "user", text: textToSend };
    setMessages((prev) => [...prev, newMessage]);

    const userQuery = textToSend.toLowerCase().trim();
    let botReply = "Lo siento, no tengo una respuesta disponible.";

    if (predefinedResponses[userQuery]) {
      botReply = predefinedResponses[userQuery];
    }

    const botMessage: Message = { sender: "bot", text: botReply };
    setMessages((prev) => [...prev, botMessage]);

    setUserInput("");
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="
          fixed
          bottom-6
          right-6
          bg-cyan-500
          hover:bg-cyan-600
          text-white
          p-4
          rounded-full
          shadow-lg
          transition-transform
          transform
          hover:scale-105
          z-50
        "
      >
        <AiFillMessage className="w-6 h-6" />
      </button>

      {isOpen && (
        <div
          className="
            fixed
            bottom-16
            right-6
            w-80
            h-[450px]
            bg-white
            border
            border-gray-300
            rounded-md
            shadow-xl
            flex
            flex-col
            animate-fadeIn
            z-50
          "
        >
          <div className="bg-cyan-500 text-white p-3 rounded-t-md flex items-center justify-between">
            <span className="font-semibold">myAssistant</span>
            <button onClick={toggleChat} className="text-white">
              ✕
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto mb-4 
            scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 bg-gray-100">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`
                  max-w-[75%] p-2 rounded-md text-gray-900
                  ${
                    msg.sender === "user"
                      ? "bg-[#ffeb7c] ml-auto text-right"
                      : "bg-white mr-auto text-left"
                  }
                `}
              >
                <strong>{msg.sender === "user" ? "Tú:" : "Bot:"}</strong>{" "}
                {msg.text}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1 p-2 bg-white border-t border-gray-200">
            {presetQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetClick(question)}
                className="
                  text-sm
                  text-white
                  bg-cyan-400
                  hover:bg-cyan-500
                  px-2
                  py-1
                  rounded-full
                  transition-colors
                "
              >
                {question}
              </button>
            ))}
          </div>

          <div className="p-2 border-t border-gray-200 flex">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="
                flex-1
                p-2
                border border-gray-300
                rounded-l-full
                focus:outline-none
                text-sm
              "
              placeholder="Escribe tu pregunta..."
            />
            <button
              onClick={() => handleSendMessage()}
              className="
                bg-cyan-500
                hover:bg-cyan-600
                text-white
                px-4
                py-2
                rounded-r-full
                text-sm
              "
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
