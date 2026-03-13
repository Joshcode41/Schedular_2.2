import bcrypt from 'bcrypt';
import pool from './connection';

export async function initializeDatabase() {
  try {
    // Drop existing tables if they exist (in reverse dependency order)
    await pool.query(`DROP TABLE IF EXISTS feedback;`);
    await pool.query(`DROP TABLE IF EXISTS appointments;`);
    await pool.query(`DROP TABLE IF EXISTS technicians;`);
    await pool.query(`DROP TABLE IF EXISTS service_centres;`);
    await pool.query(`DROP TABLE IF EXISTS users;`);

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(50) NOT NULL CHECK (role IN ('customer', 'technician', 'admin')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create service centres table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS service_centres (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        city VARCHAR(100),
        phone VARCHAR(20),
        email VARCHAR(255),
        working_hours VARCHAR(255),
        manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
        services TEXT DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create technicians table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS technicians (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(20),
        service_centre_id UUID REFERENCES service_centres(id) ON DELETE SET NULL,
        specializations TEXT DEFAULT '[]',
        available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create appointments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
        service_centre_id UUID NOT NULL REFERENCES service_centres(id) ON DELETE CASCADE,
        appointment_date TIMESTAMP NOT NULL,
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
        description TEXT,
        service_type VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create feedback table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
        customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for common queries
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_technicians_email ON technicians(email);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_technicians_service_centre_id ON technicians(service_centre_id);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_technicians_available ON technicians(available);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_appointments_customer_id ON appointments(customer_id);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_appointments_technician_id ON appointments(technician_id);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_appointments_service_centre_id ON appointments(service_centre_id);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_appointments_appointment_date ON appointments(appointment_date);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_service_centres_city ON service_centres(city);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_feedback_appointment_id ON feedback(appointment_id);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_feedback_customer_id ON feedback(customer_id);`);

    console.log('✅ Database initialized successfully!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Seed initial data
export async function seedDatabase() {
  try {
    // Check if data already exists
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    if (usersCount.rows[0].count > 0) {
      console.log('ℹ️  Database already seeded');
      return;
    }

    // Hash the demo admin password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Insert demo admin user with hashed password
    await pool.query(`
      INSERT INTO users (email, password, name, phone, role)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      'admin@scheduler.com',
      hashedPassword,
      'System Administrator',
      '+254712345678',
      'admin'
    ]);

    // Insert demo customer user with hashed password
    const customerPassword = await bcrypt.hash('password123', 10);
    await pool.query(`
      INSERT INTO users (email, password, name, phone, role)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      'customer@example.com',
      customerPassword,
      'John Doe',
      '+254712345678',
      'customer'
    ]);

    // Insert demo technician user with hashed password
    const techPassword = await bcrypt.hash('password123', 10);
    await pool.query(`
      INSERT INTO users (email, password, name, phone, role)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      'tech@example.com',
      techPassword,
      'Jane Smith',
      '+254712345679',
      'technician'
    ]);

    // Insert demo service centre
    await pool.query(`
      INSERT INTO service_centres (name, location, phone, email)
      VALUES ($1, $2, $3, $4)
    `, [
      'Main Service Centre',
      'Nairobi, Kenya',
      '+254723456789',
      'main@service.com'
    ]);

    console.log('✅ Database seeded with initial data!');
  } catch (error) {
    console.error('⚠️  Database seeding warning:', error);
    // Don't throw - allow app to continue even if seeding fails
  }
}
