BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] UNIQUEIDENTIFIER NOT NULL,
    [firstName] NVARCHAR(80) NOT NULL,
    [lastName] NVARCHAR(80) NOT NULL,
    [displayName] NVARCHAR(80) NOT NULL,
    [email] NVARCHAR(320) NOT NULL,
    [passwordHash] NVARCHAR(255) NOT NULL,
    [avatarUrl] NVARCHAR(2048),
    [role] NVARCHAR(20) NOT NULL CONSTRAINT [users_role_df] DEFAULT 'USER',
    [status] NVARCHAR(32) NOT NULL CONSTRAINT [users_status_df] DEFAULT 'PENDING_VERIFICATION',
    [preferredLanguage] NVARCHAR(5) NOT NULL CONSTRAINT [users_preferredLanguage_df] DEFAULT 'es',
    [preferredTheme] NVARCHAR(10) NOT NULL CONSTRAINT [users_preferredTheme_df] DEFAULT 'light',
    [emailVerifiedAt] DATETIME2,
    [passwordChangedAt] DATETIME2 NOT NULL CONSTRAINT [users_passwordChangedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [failedLoginCount] INT NOT NULL CONSTRAINT [users_failedLoginCount_df] DEFAULT 0,
    [lockedUntil] DATETIME2,
    [lastLoginAt] DATETIME2,
    [termsAcceptedAt] DATETIME2,
    [privacyAcceptedAt] DATETIME2,
    [deletedAt] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [users_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [users_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[sessions] (
    [id] UNIQUEIDENTIFIER NOT NULL,
    [userId] UNIQUEIDENTIFIER NOT NULL,
    [tokenHash] CHAR(64) NOT NULL,
    [ipHash] CHAR(64),
    [userAgent] NVARCHAR(512),
    [deviceName] NVARCHAR(160),
    [rememberMe] BIT NOT NULL CONSTRAINT [sessions_rememberMe_df] DEFAULT 0,
    [expiresAt] DATETIME2 NOT NULL,
    [lastSeenAt] DATETIME2 NOT NULL CONSTRAINT [sessions_lastSeenAt_df] DEFAULT CURRENT_TIMESTAMP,
    [revokedAt] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [sessions_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [sessions_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [sessions_token_hash_key] UNIQUE NONCLUSTERED ([tokenHash])
);

-- CreateTable
CREATE TABLE [dbo].[auth_codes] (
    [id] UNIQUEIDENTIFIER NOT NULL,
    [userId] UNIQUEIDENTIFIER NOT NULL,
    [email] NVARCHAR(320),
    [purpose] NVARCHAR(40) NOT NULL,
    [codeHash] CHAR(64) NOT NULL,
    [attempts] INT NOT NULL CONSTRAINT [auth_codes_attempts_df] DEFAULT 0,
    [maxAttempts] INT NOT NULL CONSTRAINT [auth_codes_maxAttempts_df] DEFAULT 5,
    [resendCount] INT NOT NULL CONSTRAINT [auth_codes_resendCount_df] DEFAULT 0,
    [lastSentAt] DATETIME2 NOT NULL CONSTRAINT [auth_codes_lastSentAt_df] DEFAULT CURRENT_TIMESTAMP,
    [expiresAt] DATETIME2 NOT NULL,
    [resendAvailableAt] DATETIME2,
    [usedAt] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [auth_codes_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [auth_codes_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[notifications] (
    [id] UNIQUEIDENTIFIER NOT NULL,
    [userId] UNIQUEIDENTIFIER NOT NULL,
    [type] NVARCHAR(40) NOT NULL,
    [titleEs] NVARCHAR(180) NOT NULL,
    [titleEn] NVARCHAR(180) NOT NULL,
    [messageEs] NVARCHAR(1000) NOT NULL,
    [messageEn] NVARCHAR(1000) NOT NULL,
    [actionUrl] NVARCHAR(2048),
    [readAt] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [notifications_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [notifications_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[auth_attempts] (
    [id] UNIQUEIDENTIFIER NOT NULL,
    [userId] UNIQUEIDENTIFIER,
    [email] NVARCHAR(320) NOT NULL,
    [action] NVARCHAR(40) NOT NULL,
    [success] BIT NOT NULL,
    [reason] NVARCHAR(80),
    [ipHash] CHAR(64),
    [userAgent] NVARCHAR(512),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [auth_attempts_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [auth_attempts_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[audit_logs] (
    [id] UNIQUEIDENTIFIER NOT NULL,
    [actorUserId] UNIQUEIDENTIFIER,
    [subjectUserId] UNIQUEIDENTIFIER,
    [action] NVARCHAR(100) NOT NULL,
    [entityType] NVARCHAR(60),
    [entityId] NVARCHAR(64),
    [ipHash] CHAR(64),
    [userAgent] NVARCHAR(512),
    [detailsText] NVARCHAR(2000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [audit_logs_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [audit_logs_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [users_role_status_idx] ON [dbo].[users]([role], [status]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [users_display_name_idx] ON [dbo].[users]([displayName]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [users_status_locked_until_idx] ON [dbo].[users]([status], [lockedUntil]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [users_created_at_idx] ON [dbo].[users]([createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [sessions_user_status_idx] ON [dbo].[sessions]([userId], [revokedAt], [expiresAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [sessions_expires_at_idx] ON [dbo].[sessions]([expiresAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [sessions_last_seen_at_idx] ON [dbo].[sessions]([lastSeenAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [auth_codes_user_purpose_idx] ON [dbo].[auth_codes]([userId], [purpose], [usedAt], [expiresAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [auth_codes_email_purpose_idx] ON [dbo].[auth_codes]([email], [purpose], [createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [auth_codes_expires_at_idx] ON [dbo].[auth_codes]([expiresAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [auth_codes_consumed_at_idx] ON [dbo].[auth_codes]([usedAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [auth_codes_user_last_sent_idx] ON [dbo].[auth_codes]([userId], [purpose], [lastSentAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [notifications_user_read_idx] ON [dbo].[notifications]([userId], [readAt], [createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [notifications_user_type_idx] ON [dbo].[notifications]([userId], [type]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [auth_attempts_email_action_idx] ON [dbo].[auth_attempts]([email], [action], [createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [auth_attempts_ip_action_idx] ON [dbo].[auth_attempts]([ipHash], [action], [createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [auth_attempts_user_created_idx] ON [dbo].[auth_attempts]([userId], [createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [audit_logs_actor_created_idx] ON [dbo].[audit_logs]([actorUserId], [createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [audit_logs_subject_created_idx] ON [dbo].[audit_logs]([subjectUserId], [createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [audit_logs_action_created_idx] ON [dbo].[audit_logs]([action], [createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [audit_logs_entity_idx] ON [dbo].[audit_logs]([entityType], [entityId]);

-- AddForeignKey
ALTER TABLE [dbo].[sessions] ADD CONSTRAINT [sessions_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[auth_codes] ADD CONSTRAINT [auth_codes_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[notifications] ADD CONSTRAINT [notifications_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[auth_attempts] ADD CONSTRAINT [auth_attempts_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[audit_logs] ADD CONSTRAINT [audit_logs_actorUserId_fkey] FOREIGN KEY ([actorUserId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[audit_logs] ADD CONSTRAINT [audit_logs_subjectUserId_fkey] FOREIGN KEY ([subjectUserId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
