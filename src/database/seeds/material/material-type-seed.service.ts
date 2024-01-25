import { Injectable, Logger } from '@nestjs/common';
import { MaterialTypeEnum } from '../../../modules/material/material.enum';
import { MaterialType } from '../../../modules/material/entities/material-type.entity';
import { MaterialTypeService } from '../../../modules/material/services/material-type.service';

@Injectable()
export class MaterialTypeSeedService {
  private readonly logger: Logger = new Logger(MaterialTypeSeedService.name);
  constructor(private readonly materialTypeService: MaterialTypeService) {}

  async run() {
    const countMaterialTypes = await this.materialTypeService.count();
    if (countMaterialTypes === 0) {
      const materialTypes = Object.values(MaterialTypeEnum).map(
        (materialType) => {
          return { name: materialType };
        },
      ) as MaterialType[];

      await this.materialTypeService.bulkCreate(materialTypes);
      this.logger.verbose('Material type seeded successfully');
    }
  }
}
