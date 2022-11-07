import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

import { ContadoresHomeService } from './contadores-home.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ContadoresHomeQueryDto } from './contadores-home-query.dto';

@Controller('contadores-home')
export class ContadoresHomeController {
  constructor(protected service: ContadoresHomeService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiQuery({ name: 'cliente_id', type: 'number' })
  index(@Res() response, @Query() query?: ContadoresHomeQueryDto) {
    const params = JSON.parse(JSON.stringify(query));

    return this.service
      .findAll(response, params)
      .then((res) => response.status(200).send(res[0]))
      .catch((e) => response.status(500).send(e.message));
  }
}
