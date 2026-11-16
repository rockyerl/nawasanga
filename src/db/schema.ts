import { sqliteTable, text, integer, real, index } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// ---------------------------------------------------------------------------
// 1. Core Auth & Dynamic RBAC
// ---------------------------------------------------------------------------

export const roles = sqliteTable("roles", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  code: text("code").notNull().unique(),
  description: text("description"),
  isSystem: integer("is_system", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const permissions = sqliteTable("permissions", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  group: text("group").notNull(),
  description: text("description"),
});

export const rolePermissions = sqliteTable("role_permissions", {
  id: text("id").primaryKey(),
  roleId: text("role_id")
    .notNull()
    .references(() => roles.id, { onDelete: "cascade" }),
  permissionId: text("permission_id")
    .notNull()
    .references(() => permissions.id, { onDelete: "cascade" }),
});

export const navigationMenus = sqliteTable("navigation_menus", {
  id: text("id").primaryKey(),
  portal: text("portal").notNull().default("client"), // 'client' | 'internal'
  title: text("title").notNull(),
  path: text("path").notNull(),
  icon: text("icon").notNull(),
  requiredPermission: text("required_permission").notNull(),
  category: text("category").notNull().default("General"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

// ---------------------------------------------------------------------------
// 2. Organizations & Multi-tenancy
// ---------------------------------------------------------------------------

export const organizations = sqliteTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  industry: text("industry"),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  address: text("address"),
  city: text("city"),
  province: text("province"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  plan: text("plan").notNull().default("starter"), // trial, starter, pro, enterprise
  maxAssets: integer("max_assets").notNull().default(10),
  status: text("status").notNull().default("active"), // active, suspended, pending_kyc
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").references(() => organizations.id),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    roleId: text("role_id")
      .notNull()
      .references(() => roles.id),
    avatarUrl: text("avatar_url"),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("idx_users_org").on(table.organizationId),
    index("idx_users_role").on(table.roleId),
  ]
);

// ---------------------------------------------------------------------------
// 3. Vehicles, Drivers, Locations & Fuel Operations
// ---------------------------------------------------------------------------

export const fuelTypes = sqliteTable("fuel_types", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(), // Solar, Dexlite, Pertamina Dex, Pertalite, Pertamax
  category: text("category").notNull(), // diesel, gasoline
  emissionFactorKgCo2PerLiter: real("emission_factor").notNull(), // standard IPCC emission factor
  unitPriceIdr: integer("unit_price_idr").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

export const drivers = sqliteTable(
  "drivers",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    licenseNumber: text("license_number").notNull(),
    phoneNumber: text("phone_number").notNull(),
    status: text("status").notNull().default("active"), // active, inactive
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("idx_drivers_org_status").on(table.organizationId, table.status),
  ]
);

export const locations = sqliteTable(
  "locations",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    type: text("type").notNull().default("pool"), // pool, depot, site, branch
    address: text("address"),
    latitude: real("latitude"),
    longitude: real("longitude"),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  },
  (table) => [
    index("idx_locations_org").on(table.organizationId),
  ]
);

export const vehicles = sqliteTable(
  "vehicles",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    plateNumber: text("plate_number").notNull().unique(),
    brandModel: text("brand_model").notNull(),
    vehicleType: text("vehicle_type").notNull(), // Truck, Pick-up, Sedan, SUV, Heavy Equipment
    fuelTypeId: text("fuel_type_id")
      .notNull()
      .references(() => fuelTypes.id),
    assignedDriverId: text("assigned_driver_id").references(() => drivers.id),
    locationId: text("location_id").references(() => locations.id),
    year: integer("year"),
    status: text("status").notNull().default("operational"), // operational, maintenance, idle
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("idx_vehicles_org_status").on(table.organizationId, table.status),
    index("idx_vehicles_driver").on(table.assignedDriverId),
  ]
);

// ---------------------------------------------------------------------------
// 4. Fuel & Carbon Emission Transaction Logs
// ---------------------------------------------------------------------------

export const fuelLogs = sqliteTable(
  "fuel_logs",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    vehicleId: text("vehicle_id")
      .notNull()
      .references(() => vehicles.id, { onDelete: "cascade" }),
    driverId: text("driver_id").references(() => drivers.id),
    fuelTypeId: text("fuel_type_id")
      .notNull()
      .references(() => fuelTypes.id),
    liters: real("liters").notNull(),
    costIdr: integer("cost_idr").notNull(),
    odometerKm: integer("odometer_km"),
    emissionCo2Kg: real("emission_co2_kg").notNull(), // calculated = liters * emission factor
    fuelStation: text("fuel_station"),
    receiptImageUrl: text("receipt_image_url"),
    loggedAt: integer("logged_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("idx_fuel_logs_org_date").on(table.organizationId, table.loggedAt),
    index("idx_fuel_logs_veh_date").on(table.vehicleId, table.loggedAt),
    index("idx_fuel_logs_driver").on(table.driverId),
  ]
);

// ---------------------------------------------------------------------------
// 5. Billing, Subscriptions, Promos & KYC
// ---------------------------------------------------------------------------

export const subscriptions = sqliteTable(
  "subscriptions",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    plan: text("plan").notNull(), // trial, starter, pro, enterprise
    billingCycle: text("billing_cycle").notNull().default("monthly"), // monthly, annual
    priceIdr: integer("price_idr").notNull(),
    startsAt: integer("starts_at", { mode: "timestamp_ms" }).notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    status: text("status").notNull().default("active"), // active, expired, cancelled
  },
  (table) => [
    index("idx_subscriptions_org").on(table.organizationId, table.status),
  ]
);

export const billingInvoices = sqliteTable(
  "billing_invoices",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    invoiceNumber: text("invoice_number").notNull().unique(),
    amountIdr: integer("amount_idr").notNull(),
    status: text("status").notNull().default("pending"), // pending, paid, failed, expired
    paymentMethod: text("payment_method"),
    paidAt: integer("paid_at", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("idx_invoices_org_date").on(table.organizationId, table.createdAt),
  ]
);

export const promos = sqliteTable("promos", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  discountPercent: integer("discount_percent").notNull(),
  maxDiscountIdr: integer("max_discount_idr"),
  validUntil: integer("valid_until", { mode: "timestamp_ms" }).notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

export const tickets = sqliteTable(
  "tickets",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    subject: text("subject").notNull(),
    description: text("description").notNull(),
    priority: text("priority").notNull().default("medium"), // low, medium, high
    status: text("status").notNull().default("open"), // open, in_progress, resolved, closed
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("idx_tickets_org_status").on(table.organizationId, table.status),
  ]
);

export const vehicleTypes = sqliteTable("vehicle_types", {
  id: text("id").primaryKey(),
  category: text("category").notNull(), // motorcycle, car, light_truck, heavy_truck, bus, heavy_equipment
  name: text("name").notNull(),
  defaultFuelTypeId: text("default_fuel_type_id"),
  consumptionKm: real("consumption_km").notNull().default(0),
  gvwMinTon: real("gvw_min_ton"),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const articles = sqliteTable(
  "articles",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    author: text("author").notNull(),
    category: text("category").notNull(),
    content: text("content").notNull(),
    publishedAt: text("published_at").notNull(),
    status: text("status").notNull().default("published"), // published, draft, archived
    views: integer("views").notNull().default(0),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("idx_articles_status_date").on(table.status, table.publishedAt),
  ]
);

// ---------------------------------------------------------------------------
// 6. Audit Logs
// ---------------------------------------------------------------------------

export const auditLogs = sqliteTable(
  "audit_logs",
  {
    id: text("id").primaryKey(),
    actorId: text("actor_id"),
    actorEmail: text("actor_email"),
    organizationId: text("organization_id"),
    action: text("action").notNull(),
    resource: text("resource").notNull(),
    details: text("details"),
    ipAddress: text("ip_address"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("idx_audit_logs_org_date").on(table.organizationId, table.createdAt),
  ]
);

// ---------------------------------------------------------------------------
// Drizzle Relations
// ---------------------------------------------------------------------------

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  vehicles: many(vehicles),
  drivers: many(drivers),
  locations: many(locations),
  fuelLogs: many(fuelLogs),
  subscriptions: many(subscriptions),
  invoices: many(billingInvoices),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
  rolePermissions: many(rolePermissions),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}));

export const usersRelations = relations(users, ({ one }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [vehicles.organizationId],
    references: [organizations.id],
  }),
  fuelType: one(fuelTypes, {
    fields: [vehicles.fuelTypeId],
    references: [fuelTypes.id],
  }),
  assignedDriver: one(drivers, {
    fields: [vehicles.assignedDriverId],
    references: [drivers.id],
  }),
  location: one(locations, {
    fields: [vehicles.locationId],
    references: [locations.id],
  }),
  fuelLogs: many(fuelLogs),
}));

export const fuelLogsRelations = relations(fuelLogs, ({ one }) => ({
  organization: one(organizations, {
    fields: [fuelLogs.organizationId],
    references: [organizations.id],
  }),
  vehicle: one(vehicles, {
    fields: [fuelLogs.vehicleId],
    references: [vehicles.id],
  }),
  driver: one(drivers, {
    fields: [fuelLogs.driverId],
    references: [drivers.id],
  }),
  fuelType: one(fuelTypes, {
    fields: [fuelLogs.fuelTypeId],
    references: [fuelTypes.id],
  }),
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  organization: one(organizations, {
    fields: [tickets.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [tickets.userId],
    references: [users.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  organization: one(organizations, {
    fields: [subscriptions.organizationId],
    references: [organizations.id],
  }),
}));

export const billingInvoicesRelations = relations(billingInvoices, ({ one }) => ({
  organization: one(organizations, {
    fields: [billingInvoices.organizationId],
    references: [organizations.id],
  }),
}));
