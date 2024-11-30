//Decorador para public, se usara en las rutas publicas

import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('isPublic', true);
