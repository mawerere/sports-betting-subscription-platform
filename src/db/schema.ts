import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  numeric,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['SUPERADMIN', 'ADMIN', 'USER']);
export const subStatusEnum = pgEnum('sub_status', ['ACTIVE', 'INACTIVE', 'EXPIRED']);
export const predStatusEnum = pgEnum('pred_status', ['PENDING', 'WON', 'LOST']);
export const paymentStatusEnum = pgEnum('payment_status', ['PENDING', 'COMPLETED', 'FAILED']);
export const liveMatchStatusEnum = pgEnum('live_match_status', [
  'FIRST_HALF',
  'HALF_TIME',
  'SECOND_HALF',
  'FULL_TIME',
  'PENDING',
]);
export const userAccountStatusEnum = pgEnum('user_account_status', ['ACTIVE', 'SUSPENDED']);

// Users Table
export const users = pgTable(
  'users',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    fullName: text('full_name').notNull(),
    email: text('email').notNull().unique(),
    phone: text('phone').notNull(),
    password: text('password').notNull(),
    role: userRoleEnum('role').default('USER').notNull(),
    subscriptionStatus: subStatusEnum('subscription_status').default('INACTIVE').notNull(),
    accountStatus: userAccountStatusEnum('account_status').default('ACTIVE').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('users_email_idx').on(table.email),
    index('users_phone_idx').on(table.phone),
  ]
);

// Packages Table
export const packages = pgTable('packages', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  durationDays: integer('duration_days').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Subscriptions Table
export const subscriptions = pgTable(
  'subscriptions',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    packageId: text('package_id')
      .notNull()
      .references(() => packages.id, { onDelete: 'cascade' }),
    startDate: timestamp('start_date', { mode: 'date' }).notNull(),
    expiryDate: timestamp('expiry_date', { mode: 'date' }).notNull(),
    status: subStatusEnum('status').default('ACTIVE').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => [
    index('subscriptions_user_idx').on(table.userId),
    index('subscriptions_package_idx').on(table.packageId),
    index('subscriptions_status_idx').on(table.status),
  ]
);

// Predictions Table
export const predictions = pgTable(
  'predictions',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    packageId: text('package_id').references(() => packages.id, { onDelete: 'set null' }),
    isFree: boolean('is_free').default(false).notNull(),
    league: text('league'),
    homeTeam: text('home_team').notNull(),
    awayTeam: text('away_team').notNull(),
    predictionText: text('prediction').notNull(),
    chances: numeric('chances', { precision: 5, scale: 2 }).notNull(),
    matchDate: timestamp('match_date', { mode: 'date' }).notNull(),
    status: predStatusEnum('status').default('PENDING').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('predictions_package_idx').on(table.packageId),
    index('predictions_match_date_idx').on(table.matchDate),
    index('predictions_status_idx').on(table.status),
    index('predictions_is_free_idx').on(table.isFree),
  ]
);

// Payments Table
export const payments = pgTable(
  'payments',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    packageId: text('package_id')
      .notNull()
      .references(() => packages.id, { onDelete: 'cascade' }),
    amount: integer('amount').notNull(),
    network: text('network').notNull(),
    transactionReference: text('transaction_reference'),
    status: paymentStatusEnum('status').default('PENDING').notNull(),
    paidAt: timestamp('paid_at', { mode: 'date' }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => [
    index('payments_user_idx').on(table.userId),
    index('payments_package_idx').on(table.packageId),
    index('payments_status_idx').on(table.status),
    index('payments_tx_ref_idx').on(table.transactionReference),
  ]
);

// Ledger Table
export const ledger = pgTable(
  'ledger',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    paymentId: text('payment_id').references(() => payments.id, { onDelete: 'set null' }),
    transactionType: text('transaction_type').notNull(),
    credit: integer('credit').default(0).notNull(),
    debit: integer('debit').default(0).notNull(),
    balanceAfter: integer('balance_after').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => [
    index('ledger_user_idx').on(table.userId),
    index('ledger_payment_idx').on(table.paymentId),
  ]
);

// Notifications Table
export const notifications = pgTable('notifications', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Live Matches Table
export const liveMatches = pgTable(
  'live_matches',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    league: text('league').notNull(),
    homeTeam: text('home_team').notNull(),
    awayTeam: text('away_team').notNull(),
    score: text('score').default('0 - 0').notNull(),
    minute: text('minute').default("0'").notNull(),
    status: liveMatchStatusEnum('status').default('PENDING').notNull(),
    predictionText: text('prediction').notNull(),
    chances: text('chances').notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('live_matches_status_idx').on(table.status)]
);

// Drizzle Relations
export const usersRelations = relations(users, ({ many }) => ({
  subscriptions: many(subscriptions),
  payments: many(payments),
  ledgerEntries: many(ledger),
}));

export const packagesRelations = relations(packages, ({ many }) => ({
  subscriptions: many(subscriptions),
  predictions: many(predictions),
  payments: many(payments),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  package: one(packages, {
    fields: [subscriptions.packageId],
    references: [packages.id],
  }),
}));

export const predictionsRelations = relations(predictions, ({ one }) => ({
  package: one(packages, {
    fields: [predictions.packageId],
    references: [packages.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
  package: one(packages, {
    fields: [payments.packageId],
    references: [packages.id],
  }),
  ledgerEntries: many(ledger),
}));

export const ledgerRelations = relations(ledger, ({ one }) => ({
  user: one(users, {
    fields: [ledger.userId],
    references: [users.id],
  }),
  payment: one(payments, {
    fields: [ledger.paymentId],
    references: [payments.id],
  }),
}));

// Infer Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Package = typeof packages.$inferSelect;
export type NewPackage = typeof packages.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

export type Prediction = typeof predictions.$inferSelect;
export type NewPrediction = typeof predictions.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

export type LedgerEntry = typeof ledger.$inferSelect;
export type NewLedgerEntry = typeof ledger.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

export type LiveMatch = typeof liveMatches.$inferSelect;
export type NewLiveMatch = typeof liveMatches.$inferInsert;