import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { User } from '../entities/user.entity';
import { Role } from '../decorators/roles.decorator';

export const createAdminUser = async (
  userRepository: Repository<User>,
  config: ConfigService,
) => {
  try {
    const existingAdmin = await userRepository.findOne({
      where: { role: Role.ADMIN },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(
        config.get<string>('ADMIN_PASSWORD'),
        10,
      );

      const adminUser = userRepository.create({
        name: config.get<string>('ADMIN_USERNAME'),
        password: hashedPassword,
        role: Role.ADMIN,
      });

      await userRepository.save(adminUser);
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};
