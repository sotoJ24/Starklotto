import React from "react";

// Definición de la interfaz
interface TicketInfo {
  player: string;
  number1: number;
  number2: number;
  number3: number;
  number4: number;
  number5: number;
  claimed: boolean;
  drawId: number;
}

// Props del componente
interface TicketInfoDisplayProps {
  ticket: TicketInfo;
}

// Componente funcional
const TicketInfoDisplay: React.FC<TicketInfoDisplayProps> = ({ ticket }) => {
  const numbers = [
    ticket.number1,
    ticket.number2,
    ticket.number3,
    ticket.number4,
    ticket.number5,
  ];

  return (
    <div className="border-4 border-yellow-400 rounded-lg p-6 bg-white text-black shadow-lg relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500 to-red-500 opacity-20 rounded-lg"></div>
      <h2 className="text-3xl font-bold mb-4 text-center">LOTTO</h2>
      <h3 className="text-lg font-bold mb-4 text-center">
        Lottery #{ticket.drawId}
      </h3>
      <div className="flex justify-center mb-4">
        {numbers.map((number, index) => (
          <div
            key={index}
            className="w-12 h-12 flex items-center justify-center bg-yellow-400 text-white rounded-full mx-2 border-2 border-gray-300"
          >
            {number < 10 ? `0${number}` : number}
          </div>
        ))}
      </div>
      <p className="mb-2 text-center">
        <strong>Claimed:</strong> {ticket.claimed ? "Yes" : "No"}
      </p>
      <p className="text-center">
        <strong>Draw ID:</strong> {ticket.drawId}
      </p>
      <p className="text-center text-3xl">
        <strong>Good Luck</strong>
      </p>
    </div>
  );
};

export default TicketInfoDisplay;
