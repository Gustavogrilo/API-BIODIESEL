import {
  Body,
  Controller,
  Patch,
  Post,
  Put,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CoreController } from 'src/core';
import { DapService } from 'src/domain/dap/dap.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DapDto } from './dap.dto';

@Controller('dap')
export class DapController extends CoreController<DapService> {
  constructor(protected service: DapService) {
    super(service);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  insert(@Body() dto: DapDto, @Res() response) {
    return this.save(dto, response);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: DapDto, @Res() response) {
    return this.save(dto, response);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @UseGuards(JwtAuthGuard)
  patch(@Body() dto: DapDto, @Res() response) {
    return this.save(dto, response);
  }
}
