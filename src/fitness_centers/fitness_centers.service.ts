import { Injectable } from '@nestjs/common';
import { MysqlService } from 'src/mysql/mysql.service';

@Injectable()
export class FitnessCentersService {
  constructor(private readonly mysqlService: MysqlService) {}

  async getFitnessCenter(data: { lat: number; lng: number }) {
    const result = await this.mysqlService.query(
      `SELECT fc.*, fpt.* 
      FROM
      FITNESS_CENTERS fc
      LEFT JOIN FITNESS_PRICES_TABLE fpt
      ON
      fc.id = fpt.fitness_center_id
      WHERE
      SQRT(POW(lat - ?, 2) + POW(lng - ?, 2)) * 111.12 <= ?
      `,
      [data.lat, data.lng, 5],
    );
    return result;
  }

  async getFitnessPriceByFilter(params: any) {
    const newParam = {
      minPrice: parseInt(params.minPrice) * 10000,
      maxPrice: parseInt(params.maxPrice) * 10000,
      minMonth: parseInt(params.minMonth),
      maxMonth: parseInt(params.maxMonth),
    };
    const result = await this.mysqlService.query(
      `SELECT fpt.*, fc.*
        FROM FITNESS_PRICES_TABLE fpt
        LEFT JOIN 
        FITNESS_CENTERS fc
        ON fpt.fitness_center_id = fc.id
        WHERE 
        fpt.price >= ?
        AND fpt.price <= ?
        AND fpt.month >= ?
        AND fpt.month <= ?
        ORDER BY 
        fpt.month ASC,
        fpt.price ASC;`,
      [
        newParam.minPrice,
        newParam.maxPrice,
        newParam.minMonth,
        newParam.maxMonth,
      ],
    );
    return result;
  }
}
