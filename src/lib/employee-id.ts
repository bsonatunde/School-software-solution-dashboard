import { getDatabase } from '@/lib/mongodb';

export interface EmployeeIdGenerator {
  generateEmployeeId(type: 'teacher' | 'staff' | 'employee', customPrefix?: string): Promise<string>;
  isEmployeeIdUnique(employeeId: string): Promise<boolean>;
  validateEmployeeId(employeeId: string): boolean;
}

/**
 * Generate employee ID for different types of employees
 * Format: PSS/TCH/001, PSS/STF/001, PSS/EMP/001
 */
export async function generateEmployeeId(
  type: 'teacher' | 'staff' | 'employee',
  customPrefix?: string
): Promise<string> {
  const db = await getDatabase();
  const currentYear = new Date().getFullYear();
  
  // Define prefixes for different employee types
  const prefixes = {
    teacher: 'PSS/TCH',
    staff: 'PSS/STF',
    employee: 'PSS/EMP'
  };

  const prefix = customPrefix || prefixes[type];
  
  // Get count based on type
  let count = 0;
  
  switch (type) {
    case 'teacher':
      count = await db.collection('teachers').countDocuments();
      break;
    case 'staff':
      count = await db.collection('staff').countDocuments();
      break;
    case 'employee':
      // For general employees, check both teachers and staff
      const teacherCount = await db.collection('teachers').countDocuments();
      const staffCount = await db.collection('staff').countDocuments();
      count = teacherCount + staffCount;
      break;
  }

  return `${prefix}/${String(count + 1).padStart(3, '0')}`;
}

/**
 * Check if employee ID is unique across all collections
 */
export async function isEmployeeIdUnique(employeeId: string): Promise<boolean> {
  const db = await getDatabase();
  
  // Check in teachers collection
  const teacherExists = await db.collection('teachers').findOne({ employeeId });
  if (teacherExists) return false;
  
  // Check in staff collection
  const staffExists = await db.collection('staff').findOne({ employeeId });
  if (staffExists) return false;
  
  return true;
}

/**
 * Validate employee ID format
 * Expected format: PSS/[TCH|STF|EMP]/[001-999]
 */
export function validateEmployeeId(employeeId: string): boolean {
  const pattern = /^PSS\/(TCH|STF|EMP)\/\d{3}$/;
  return pattern.test(employeeId);
}

/**
 * Generate a unique employee ID with conflict resolution
 */
export async function generateUniqueEmployeeId(
  type: 'teacher' | 'staff' | 'employee',
  customPrefix?: string,
  maxAttempts: number = 10
): Promise<string> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const employeeId = await generateEmployeeId(type, customPrefix);
    
    if (await isEmployeeIdUnique(employeeId)) {
      return employeeId;
    }
    
    // If not unique, try with a different approach
    const db = await getDatabase();
    const timestamp = Date.now().toString().slice(-3);
    const prefixes = {
      teacher: 'PSS/TCH',
      staff: 'PSS/STF',
      employee: 'PSS/EMP'
    };
    
    const prefix = customPrefix || prefixes[type];
    const fallbackId = `${prefix}/${timestamp}`;
    
    if (await isEmployeeIdUnique(fallbackId)) {
      return fallbackId;
    }
  }
  
  throw new Error(`Failed to generate unique employee ID after ${maxAttempts} attempts`);
}

/**
 * Get next available employee ID number for a given prefix
 */
export async function getNextEmployeeIdNumber(prefix: string): Promise<number> {
  const db = await getDatabase();
  
  // Get all employee IDs with the given prefix from all collections
  const collections = ['teachers', 'staff'];
  let maxNumber = 0;
  
  for (const collectionName of collections) {
    const employees = await db.collection(collectionName)
      .find({ employeeId: { $regex: `^${prefix.replace('/', '\\/')}` } })
      .toArray();
    
    for (const employee of employees) {
      const match = employee.employeeId.match(/\/(\d+)$/);
      if (match) {
        const number = parseInt(match[1], 10);
        maxNumber = Math.max(maxNumber, number);
      }
    }
  }
  
  return maxNumber + 1;
}

/**
 * Employee ID management class
 */
export class EmployeeIdManager implements EmployeeIdGenerator {
  async generateEmployeeId(
    type: 'teacher' | 'staff' | 'employee',
    customPrefix?: string
  ): Promise<string> {
    return generateUniqueEmployeeId(type, customPrefix);
  }

  async isEmployeeIdUnique(employeeId: string): Promise<boolean> {
    return isEmployeeIdUnique(employeeId);
  }

  validateEmployeeId(employeeId: string): boolean {
    return validateEmployeeId(employeeId);
  }

  /**
   * Bulk validate employee IDs
   */
  async validateBulkEmployeeIds(employeeIds: string[]): Promise<{
    valid: string[];
    invalid: string[];
    duplicates: string[];
  }> {
    const valid: string[] = [];
    const invalid: string[] = [];
    const duplicates: string[] = [];
    
    for (const id of employeeIds) {
      // Check format
      if (!this.validateEmployeeId(id)) {
        invalid.push(id);
        continue;
      }
      
      // Check uniqueness
      if (!(await this.isEmployeeIdUnique(id))) {
        duplicates.push(id);
        continue;
      }
      
      valid.push(id);
    }
    
    return { valid, invalid, duplicates };
  }

  /**
   * Get employee by ID across all collections
   */
  async getEmployeeById(employeeId: string): Promise<any | null> {
    const db = await getDatabase();
    
    // Check teachers first
    const teacher = await db.collection('teachers').findOne({ employeeId });
    if (teacher) {
      return { ...teacher, type: 'teacher' };
    }
    
    // Check staff
    const staff = await db.collection('staff').findOne({ employeeId });
    if (staff) {
      return { ...staff, type: 'staff' };
    }
    
    return null;
  }

  /**
   * Transfer employee ID to another person (with audit trail)
   */
  async transferEmployeeId(
    oldEmployeeId: string,
    newEmployeeId: string,
    reason: string
  ): Promise<{ success: boolean; message: string }> {
    const db = await getDatabase();
    
    try {
      // Find the employee
      const employee = await this.getEmployeeById(oldEmployeeId);
      if (!employee) {
        return { success: false, message: 'Employee not found' };
      }
      
      // Check if new ID is available
      if (!(await this.isEmployeeIdUnique(newEmployeeId))) {
        return { success: false, message: 'New employee ID already exists' };
      }
      
      // Update the employee record
      const collection = employee.type === 'teacher' ? 'teachers' : 'staff';
      await db.collection(collection).updateOne(
        { employeeId: oldEmployeeId },
        {
          $set: {
            employeeId: newEmployeeId,
            updatedAt: new Date().toISOString()
          },
          $push: {
            auditTrail: {
              action: 'employee_id_transfer',
              oldValue: oldEmployeeId,
              newValue: newEmployeeId,
              reason,
              timestamp: new Date().toISOString()
            }
          }
        } as any
      );
      
      return { success: true, message: 'Employee ID transferred successfully' };
    } catch (error) {
      console.error('Error transferring employee ID:', error);
      return { success: false, message: 'Failed to transfer employee ID' };
    }
  }
}

// Export default instance
export const employeeIdManager = new EmployeeIdManager();
