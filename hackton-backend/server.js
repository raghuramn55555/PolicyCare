// // import express from 'express';
// // import cors from 'cors';
// // import config from './config/index.js';
// // import logger from './utils/logger.js';
// // import recommendRouter from './routes/recommend.js';
// // import chatRouter from './routes/chat.js';
// // import authRouter from './routes/auth.js';
// // import popularRouter from './routes/popular.js';
// // import policeRouter from './routes/police.js';
// // import insuranceRouter from './routes/insurance.js';
// // import vectorDB from './services/vectorDB.js';
// // import { initializePolicies, initializeAgents } from './services/policyLoader.js';

// // const app = express();

// // // --------------- Middleware ---------------
// // app.use(cors());
// // app.use(express.json());

// // // --------------- Routes ---------------
// // app.get('/health', (_req, res) => {
// //   res.json({ status: 'ok', message: 'PolicySetu API is running' });
// // });

// // app.use('/recommend', recommendRouter);
// // app.use('/api/chat', chatRouter);
// // app.use('/api/auth', authRouter);
// // app.use('/popular', popularRouter);
// // app.use('/api/police', policeRouter);
// // app.use('/api/insurance', insuranceRouter);

// // // --------------- Global Error Handler ---------------
// // app.use((err, _req, res, _next) => {
// //   logger.error(`Unhandled error: ${err.message}`, 'Server');
// //   res.status(500).json({ success: false, message: 'Internal server error' });
// // });

// // // --------------- Startup ---------------
// // async function initializeServer() {
// //   try {
// //     logger.info('Initializing VectorDB...', 'Startup');
// //     await vectorDB.initialize();

// //     logger.info('Loading policies and agents...', 'Startup');
// //     await initializePolicies();
// //     await initializeAgents();

// //     logger.info('All data loaded — server is ready', 'Startup');
// //   } catch (error) {
// //     logger.error(`Initialization failed: ${error.message}`, 'Startup');
// //   }
// // }

// // const server = app.listen(config.port, async () => {
// //   logger.info(`Server running on http://localhost:${config.port}`, 'Startup');
// //   await initializeServer();
// // });

// // // --------------- Graceful Shutdown ---------------
// // function shutdown(signal) {
// //   logger.info(`${signal} received — shutting down gracefully`, 'Server');
// //   server.close(() => {
// //     logger.info('HTTP server closed', 'Server');
// //     process.exit(0);
// //   });
// // }

// // process.on('SIGINT', () => shutdown('SIGINT'));
// // process.on('SIGTERM', () => shutdown('SIGTERM'));


// import { useState, useRef, useEffect } from "react";
// import axios from "axios";

// function Chatbot() {
//   const [open, setOpen] = useState(false);
//   const [message, setMessage] = useState("");
//   const [chat, setChat] = useState([
//     {
//       sender: "bot",
//       text: "Hello! I am your AI Knowledge Assistant. How can I help you today?"
//     }
//   ]);
//   const [loading, setLoading] = useState(false);

//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat, loading]);

//   const sendMessage = async () => {
//     if (!message.trim() || loading) return;

//     const userText = message;
//     setMessage("");
//     setLoading(true);

//     setChat(prev => [...prev, { sender: "user", text: userText }]);

//     try {
//       const res = await axios.post(
//         "http://localhost:8000/api/chat",
//         { message: userText }
//       );

//       setChat(prev => [
//         ...prev,
//         { sender: "bot", text: res.data.reply }
//       ]);
//     } catch (error) {
//       setChat(prev => [
//         ...prev,
//         { sender: "bot", text: "⚠ Unable to connect to AI service." }
//       ]);
//     }

//     setLoading(false);
//   };

//   const clearChat = () => {
//     setChat([
//       {
//         sender: "bot",
//         text: "Chat cleared. How can I help you again?"
//       }
//     ]);
//   };

//   return (
//     <>
//       {/* Floating Button */}
//       <button
//         onClick={() => setOpen(!open)}
//         className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-blue-600 hover:scale-110 text-white p-4 rounded-full shadow-2xl transition-all duration-300 z-50"
//       >
//         💬
//       </button>

//       {open && (
//         <div className="fixed bottom-20 right-6 w-96 h-[520px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 z-50">

//           {/* Header */}
//           <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 flex justify-between items-center">
//             <div>
//               <h3 className="font-semibold text-lg">PolicySetu AI</h3>
//               <p className="text-xs text-blue-100">
//                 Smart Insurance Assistant
//               </p>
//             </div>

//             <div className="flex gap-3 items-center">
//               <button
//                 onClick={clearChat}
//                 className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30"
//               >
//                 Clear
//               </button>
//               <button
//                 onClick={() => setOpen(false)}
//                 className="text-lg"
//               >
//                 ✕
//               </button>
//             </div>
//           </div>

//           {/* Chat Area */}
//           <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-gray-50 to-white">
//             {chat.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`flex ${
//                   msg.sender === "user"
//                     ? "justify-end"
//                     : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
//                     msg.sender === "user"
//                       ? "bg-indigo-600 text-white rounded-br-none"
//                       : "bg-white border border-gray-200 text-gray-700 rounded-bl-none"
//                   }`}
//                 >
//                   {msg.text}
//                 </div>
//               </div>
//             ))}

//             {loading && (
//               <div className="text-sm text-gray-500 animate-pulse">
//                 Thinking...
//               </div>
//             )}

//             <div ref={chatEndRef} />
//           </div>

//           {/* Input Section */}
//           <div className="p-3 border-t flex gap-2 bg-white">
//             <input
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && !loading) {
//                   e.preventDefault();
//                   sendMessage();
//                 }
//               }}
//               placeholder="Ask about insurance policies..."
//               className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
//             />

//             <button
//               onClick={sendMessage}
//               className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm shadow-md"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default Chatbot;


import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import logger from './utils/logger.js';
import recommendRouter from './routes/recommend.js';
import chatRouter from './routes/chat.js';
import authRouter from './routes/auth.js';
import popularRouter from './routes/popular.js';
import policeRouter from './routes/police.js';
import insuranceRouter from './routes/insurance.js';
import vectorDB from './services/vectorDB.js';
import { initializePolicies, initializeAgents } from './services/policyLoader.js';

const app = express();

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());

// --------------- Routes ---------------
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'PolicySetu API is running' });
});

app.use('/recommend', recommendRouter);
app.use('/api/chat', chatRouter);
app.use('/api/auth', authRouter);
app.use('/popular', popularRouter);
app.use('/api/police', policeRouter);
app.use('/api/insurance', insuranceRouter);

// --------------- Global Error Handler ---------------
app.use((err, _req, res, _next) => {
  logger.error(`Unhandled error: ${err.message}`, 'Server');
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// --------------- Startup ---------------
async function initializeServer() {
  try {
    logger.info('Initializing VectorDB...', 'Startup');
    await vectorDB.initialize();

    logger.info('Loading policies and agents...', 'Startup');
    await initializePolicies();
    await initializeAgents();

    logger.info('All data loaded — server is ready', 'Startup');
  } catch (error) {
    logger.error(`Initialization failed: ${error.message}`, 'Startup');
  }
}

const server = app.listen(config.port, async () => {
  logger.info(`Server running on http://localhost:${config.port}`, 'Startup');
  await initializeServer();
});

// --------------- Graceful Shutdown ---------------
function shutdown(signal) {
  logger.info(`${signal} received — shutting down gracefully`, 'Server');
  server.close(() => {
    logger.info('HTTP server closed', 'Server');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));