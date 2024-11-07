import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Proveedor, Cotizacion, Pedido, Comunidad, Responsable } from '../types/types';

interface AppState {
  proveedores: Proveedor[];
  cotizaciones: Cotizacion[];
  pedidos: Pedido[];
  comunidades: Comunidad[];
  responsables: Responsable[];
}

type Action = 
  | { type: 'ADD_PROVEEDOR'; payload: Proveedor }
  | { type: 'UPDATE_PROVEEDOR'; payload: Proveedor }
  | { type: 'DELETE_PROVEEDOR'; payload: string }
  | { type: 'ADD_COTIZACION'; payload: Cotizacion }
  | { type: 'UPDATE_COTIZACION'; payload: Cotizacion }
  | { type: 'DELETE_COTIZACION'; payload: string }
  | { type: 'ADD_PEDIDO'; payload: Pedido }
  | { type: 'UPDATE_PEDIDO'; payload: Pedido }
  | { type: 'DELETE_PEDIDO'; payload: string }
  | { type: 'ADD_COMUNIDAD'; payload: Comunidad }
  | { type: 'UPDATE_COMUNIDAD'; payload: Comunidad }
  | { type: 'DELETE_COMUNIDAD'; payload: string }
  | { type: 'ADD_RESPONSABLE'; payload: Responsable }
  | { type: 'UPDATE_RESPONSABLE'; payload: Responsable }
  | { type: 'DELETE_RESPONSABLE'; payload: string }
  | { type: 'LOAD_DATA'; payload: AppState };

const initialState: AppState = {
  proveedores: [],
  cotizaciones: [],
  pedidos: [],
  comunidades: [],
  responsables: []
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_PROVEEDOR':
      return {
        ...state,
        proveedores: [...state.proveedores, action.payload]
      };
    case 'UPDATE_PROVEEDOR':
      return {
        ...state,
        proveedores: state.proveedores.map(prov =>
          prov.id === action.payload.id ? action.payload : prov
        )
      };
    case 'DELETE_PROVEEDOR':
      return {
        ...state,
        proveedores: state.proveedores.filter(prov => prov.id !== action.payload)
      };
    case 'ADD_COTIZACION':
      return {
        ...state,
        cotizaciones: [...state.cotizaciones, action.payload]
      };
    case 'UPDATE_COTIZACION':
      return {
        ...state,
        cotizaciones: state.cotizaciones.map(cot =>
          cot.id === action.payload.id ? action.payload : cot
        )
      };
    case 'DELETE_COTIZACION':
      return {
        ...state,
        cotizaciones: state.cotizaciones.filter(cot => cot.id !== action.payload)
      };
    case 'ADD_PEDIDO':
      return {
        ...state,
        pedidos: [...state.pedidos, action.payload]
      };
    case 'UPDATE_PEDIDO':
      return {
        ...state,
        pedidos: state.pedidos.map(ped =>
          ped.id === action.payload.id ? action.payload : ped
        )
      };
    case 'DELETE_PEDIDO':
      return {
        ...state,
        pedidos: state.pedidos.filter(ped => ped.id !== action.payload)
      };
    case 'ADD_COMUNIDAD':
      return {
        ...state,
        comunidades: [...state.comunidades, action.payload]
      };
    case 'UPDATE_COMUNIDAD':
      return {
        ...state,
        comunidades: state.comunidades.map(com =>
          com.id === action.payload.id ? action.payload : com
        )
      };
    case 'DELETE_COMUNIDAD':
      return {
        ...state,
        comunidades: state.comunidades.filter(com => com.id !== action.payload)
      };
    case 'ADD_RESPONSABLE':
      return {
        ...state,
        responsables: [...state.responsables, action.payload]
      };
    case 'UPDATE_RESPONSABLE':
      return {
        ...state,
        responsables: state.responsables.map(resp =>
          resp.id === action.payload.id ? action.payload : resp
        )
      };
    case 'DELETE_RESPONSABLE':
      return {
        ...state,
        responsables: state.responsables.filter(resp => resp.id !== action.payload)
      };
    case 'LOAD_DATA':
      return action.payload;
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedData = localStorage.getItem('appData');
    if (savedData) {
      dispatch({ type: 'LOAD_DATA', payload: JSON.parse(savedData) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('appData', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}