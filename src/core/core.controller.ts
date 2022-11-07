import {
  Get,
  Res,
  Query,
  Param,
  Post,
  Body,
  Put,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { CoreService } from './core.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { In } from 'typeorm';

export abstract class CoreController<T1 extends CoreService<any>> {
  constructor(protected service: T1) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Body() dto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto, @Res() response) {
    return this.save(dto, response);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  index(@Res() response, @Query() query?) {
    return this.findAll(response, query);
  }

  @Get('select-item')
  async getSelectItem( @Res() response, @Query() query? ): Promise<{ label: string; value: number }[]> {
    this.parseQuery(query);

    return this.service.getSelectItem(query)
      .then((res) => response.status(200).send(res))
      .catch((err) => response.status(500).send(err.message));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  show(@Param() params, @Res() response) {
    return this.service
      .findById(params.id)
      .then((res) => response.status(200).send(res))
      .catch((e) => response.status(500).send(e.message));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  destroy(@Param() params, @Res() response) {
    return this.service
      .delete(params.id)
      .then((res) => {
        const status = res.affected > 0 ? 204 : 404;

        response.status(status).send();
      })
      .catch((e) => response.status(500).send(e.message));
  }

  protected save(@Body() dto, @Res() response) {
    return this.service
      .save(dto)
      .then((res) => response.status(200).send(res))
      .catch((e) => {
        if (e.response?.message) {
          response.status(e.status ?? 500).send(e);
        } else {
          response.status(500).send(e.message);
        }
      });
  }

  protected findAll(@Res() response, @Query() query?) {
    const params = JSON.parse(JSON.stringify(query));

    return this.service
      .findAll(params)
      .then((res) => response.status(200).send(res))
      .catch((e) => response.status(500).send(e.message));
  }

  protected parseQuery(query): void {
    for (const [key, value] of Object.entries(query)) {
      if (typeof value === 'string') {
        const parsedValue = JSON.parse(value);

        if (Array.isArray(parsedValue)) {
          query[key] = In(parsedValue);
        } else {
          query[key] = parsedValue;
        }
      }
    }
  }
}
