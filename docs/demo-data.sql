
USE BookMyDoc;

-- Remove any previous temporary table from this session
DROP TEMPORARY TABLE IF EXISTS seed_doctors;

-- Temporary table containing the sample doctor details
CREATE TEMPORARY TABLE seed_doctors (
    username VARCHAR(100),
    email VARCHAR(150),
    clinic_name VARCHAR(150),
    clinic_address VARCHAR(255),
    specialization VARCHAR(100),
    consultation_fee DECIMAL(10,2)
);

-- Insert seven sample doctors
INSERT INTO seed_doctors VALUES
                             ('Allwin Alexandar',
                              'allwinalexandar@gmail.com',
                              'Porur Medical Centre',
                              'Porur, Chennai',
                              'General Medicine',
                              400),

                             ('Pradeep',
                              'pradeep@gmail.com',
                              'Saidapet Family Clinic',
                              'Saidapet, Chennai',
                              'Orthopedics',
                              600),

                             ('Rahul Raj',
                              'rahulraj@gmail.com',
                              'Nandhanam Heart Clinic',
                              'Nandhanam, Chennai',
                              'Cardiology',
                              800),

                             ('Vilasni',
                              'vilasni@gmail.com',
                              'Velacherry Skin Clinic',
                              'Velacherry, Chennai',
                              'Dermatology',
                              500),

                             ('Vignesh',
                              'vignesh@gmail.com',
                              'Katpadi Child Care',
                              'Katpadi, Vellore',
                              'Pediatrics',
                              450),

                             ('Roshan',
                              'roshan@gmail.com',
                              'Anna Nagar Neuro Clinic',
                              'Anna Nagar, Chennai',
                              'Neurology',
                              800),

                             ('Santhosh Sai',
                              'santhoshsai@gmail.com',
                              'Ayannabakkam Dental Care',
                              'Ayannabakkam, Chennai',
                              'Dentistry',
                              400);


START TRANSACTION;

-- Create doctor login accounts in the users table
-- Shared demo password: Doctor@123
-- Password hash supplied from the existing local seed script
INSERT INTO users
(username, email, `role`, password, created_at)
SELECT
    d.username,
    d.email,
    'DOCTOR',
    '$2y$12$j40QIdMhcwla6Sp/n9s3IuMfA6sMpTcZf2hFQFOIU2ND2q/J.BMhy',
    NOW()
FROM seed_doctors d
WHERE NOT EXISTS (
    SELECT 1
    FROM users u
    WHERE u.email = d.email
);

-- Create corresponding doctor profiles
INSERT INTO doctor_profiles
(user_id, clinic_name, clinic_address, specialization, consultation_fee)
SELECT
    u.u_id,
    d.clinic_name,
    d.clinic_address,
    d.specialization,
    d.consultation_fee
FROM seed_doctors d
         JOIN users u
              ON u.email = d.email
WHERE u.`role` = 'DOCTOR'
  AND NOT EXISTS (
    SELECT 1
    FROM doctor_profiles dp
    WHERE dp.user_id = u.u_id
);

COMMIT;

-- Verify the seeded doctor accounts
SELECT
    u.u_id,
    u.username,
    u.email,
    u.`role`,
    dp.clinic_name,
    dp.clinic_address,
    dp.specialization,
    dp.consultation_fee
FROM users u
         JOIN doctor_profiles dp
              ON u.u_id = dp.user_id
WHERE u.`role` = 'DOCTOR';

-- Remove the temporary table
DROP TEMPORARY TABLE IF EXISTS seed_doctors;
