import { Injectable, Logger } from '@nestjs/common';
import { ComponentType } from '../../../modules/component/entities/component-type.entity';
import { ComponentTypeService } from '../../../modules/component/services/component-type.service';
import { ComponentTypeEnum } from '../../../modules/component/component.enum';

@Injectable()
export class ComponentTypeSeedService {
  private readonly logger: Logger = new Logger(ComponentTypeSeedService.name);
  constructor(private readonly componentTypeService: ComponentTypeService) {}

  async run() {
    const countComponentTypes = await this.componentTypeService.count();
    if (countComponentTypes === 0) {
      const componentTypes = Object.values(ComponentTypeEnum).map(
        (componentType) => {
          return { name: componentType };
        },
      ) as ComponentType[];

      await this.componentTypeService.bulkCreate(componentTypes);
      this.logger.verbose('Component type seeded successfully');
    }
  }
}
