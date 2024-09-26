-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `personalId` VARCHAR(191) NOT NULL,
    `matriculationNumber` VARCHAR(191) NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATETIME(3) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL,
    `rolesId` INTEGER NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `password` VARCHAR(191) NOT NULL,
    `enrolledDegree` VARCHAR(191) NULL,
    `currentSemester` VARCHAR(191) NULL,
    `academicYear` VARCHAR(191) NULL,

    UNIQUE INDEX `User_personalId_key`(`personalId`),
    UNIQUE INDEX `User_matriculationNumber_key`(`matriculationNumber`),
    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_rolesId_idx`(`rolesId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Roles_role_key`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Degree` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `degree` VARCHAR(191) NOT NULL,
    `lengthInYears` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subject` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subject` VARCHAR(191) NOT NULL,
    `credits` DOUBLE NOT NULL,
    `degreeId` INTEGER NOT NULL,
    `semester` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Grades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `midtermGrade` INTEGER NULL,
    `seminarGrade` INTEGER NULL,
    `finalGrade` INTEGER NULL,
    `subjectId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `viewed` BOOLEAN NOT NULL DEFAULT false,
    `viewedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Timetables` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `program` VARCHAR(191) NOT NULL,
    `semester` VARCHAR(191) NOT NULL,
    `degreeId` INTEGER NULL,

    UNIQUE INDEX `Timetables_program_semester_degreeId_key`(`program`, `semester`, `degreeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TimetableEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timetableId` INTEGER NOT NULL,
    `day` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `TimetableEntry_timetableId_day_time_key`(`timetableId`, `day`, `time`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UserSubjects` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UserSubjects_AB_unique`(`A`, `B`),
    INDEX `_UserSubjects_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UserTaughtSubjects` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UserTaughtSubjects_AB_unique`(`A`, `B`),
    INDEX `_UserTaughtSubjects_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UserNotifications` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UserNotifications_AB_unique`(`A`, `B`),
    INDEX `_UserNotifications_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_rolesId_fkey` FOREIGN KEY (`rolesId`) REFERENCES `Roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subject` ADD CONSTRAINT `Subject_degreeId_fkey` FOREIGN KEY (`degreeId`) REFERENCES `Degree`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grades` ADD CONSTRAINT `Grades_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grades` ADD CONSTRAINT `Grades_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Timetables` ADD CONSTRAINT `Timetables_degreeId_fkey` FOREIGN KEY (`degreeId`) REFERENCES `Degree`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimetableEntry` ADD CONSTRAINT `TimetableEntry_timetableId_fkey` FOREIGN KEY (`timetableId`) REFERENCES `Timetables`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserSubjects` ADD CONSTRAINT `_UserSubjects_A_fkey` FOREIGN KEY (`A`) REFERENCES `Subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserSubjects` ADD CONSTRAINT `_UserSubjects_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserTaughtSubjects` ADD CONSTRAINT `_UserTaughtSubjects_A_fkey` FOREIGN KEY (`A`) REFERENCES `Subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserTaughtSubjects` ADD CONSTRAINT `_UserTaughtSubjects_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserNotifications` ADD CONSTRAINT `_UserNotifications_A_fkey` FOREIGN KEY (`A`) REFERENCES `Notifications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserNotifications` ADD CONSTRAINT `_UserNotifications_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
