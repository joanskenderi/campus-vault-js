import { createContext, useContext } from 'react';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export default SocketContext;
