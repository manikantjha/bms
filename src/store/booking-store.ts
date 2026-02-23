"use client";

import { create } from "zustand";
import type { CartItem, BookingClientInput } from "@/types/booking.types";

interface BookingState {
  clients: BookingClientInput[];
  customerName: string;
  email: string;
  phone: string;
  eventDate: string;
  eventTime: string;
  location: string;
  specialInstructions: string;

  setCustomerDetails: (details: {
    customerName: string;
    email: string;
    phone: string;
  }) => void;
  setEventDetails: (details: {
    eventDate: string;
    eventTime: string;
    location: string;
    specialInstructions: string;
  }) => void;
  addClient: (clientName: string) => void;
  removeClient: (index: number) => void;
  updateClientName: (index: number, name: string) => void;
  addServiceToClient: (clientIndex: number, service: CartItem) => void;
  removeServiceFromClient: (
    clientIndex: number,
    serviceId: string
  ) => void;
  getTotalPrice: () => number;
  reset: () => void;
}

const initialState = {
  clients: [{ clientName: "", services: [] }],
  customerName: "",
  email: "",
  phone: "",
  eventDate: "",
  eventTime: "",
  location: "",
  specialInstructions: "",
};

export const useBookingStore = create<BookingState>((set, get) => ({
  ...initialState,

  setCustomerDetails: (details) =>
    set({
      customerName: details.customerName,
      email: details.email,
      phone: details.phone,
    }),

  setEventDetails: (details) =>
    set({
      eventDate: details.eventDate,
      eventTime: details.eventTime,
      location: details.location,
      specialInstructions: details.specialInstructions,
    }),

  addClient: (clientName) =>
    set((state) => ({
      clients: [...state.clients, { clientName, services: [] }],
    })),

  removeClient: (index) =>
    set((state) => ({
      clients: state.clients.filter((_, i) => i !== index),
    })),

  updateClientName: (index, name) =>
    set((state) => ({
      clients: state.clients.map((client, i) =>
        i === index ? { ...client, clientName: name } : client
      ),
    })),

  addServiceToClient: (clientIndex, service) =>
    set((state) => ({
      clients: state.clients.map((client, i) => {
        if (i !== clientIndex) return client;
        const exists = client.services.some(
          (s) => s.serviceId === service.serviceId
        );
        if (exists) return client;
        return { ...client, services: [...client.services, service] };
      }),
    })),

  removeServiceFromClient: (clientIndex, serviceId) =>
    set((state) => ({
      clients: state.clients.map((client, i) => {
        if (i !== clientIndex) return client;
        return {
          ...client,
          services: client.services.filter((s) => s.serviceId !== serviceId),
        };
      }),
    })),

  getTotalPrice: () => {
    const { clients } = get();
    return clients.reduce(
      (total, client) =>
        total + client.services.reduce((sum, s) => sum + s.price, 0),
      0
    );
  },

  reset: () => set(initialState),
}));
