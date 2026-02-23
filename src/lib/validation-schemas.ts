import { z } from "zod/v4";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  isQuoteRequest: z.boolean().default(false),
});

export type ContactFormData = z.infer<typeof contactSchema>;

const bookingClientSchema = z.object({
  clientName: z.string().min(2, "Client name must be at least 2 characters"),
  services: z
    .array(
      z.object({
        serviceId: z.string().uuid(),
        serviceName: z.string(),
        price: z.number().positive(),
      })
    )
    .min(1, "Each client must have at least one service"),
});

export const bookingSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  phone: z.string().optional(),
  eventDate: z.string().min(1, "Event date is required"),
  eventTime: z.string().min(1, "Event time is required"),
  location: z.string().optional(),
  specialInstructions: z.string().optional(),
  clients: z
    .array(bookingClientSchema)
    .min(1, "At least one client is required"),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

export const serviceSchema = z.object({
  name: z.string().min(2, "Service name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be positive"),
  durationMinutes: z.number().int().positive().optional(),
  categoryId: z.string().uuid().optional(),
  isActive: z.boolean().default(true),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

export const portfolioSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  imageUrl: z.string().url("Valid image URL required"),
  category: z.string().optional(),
  isFeatured: z.boolean().default(false),
});
export type PortfolioFormData = z.infer<typeof portfolioSchema>;

export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
});
export type CategoryFormData = z.infer<typeof categorySchema>;

export const bookingStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled"]),
});
export type BookingStatusData = z.infer<typeof bookingStatusSchema>;
