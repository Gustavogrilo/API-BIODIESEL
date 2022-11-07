import { Get, Query, Res, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BaseReportService } from 'src/core/relatorio/base-report.service';

export abstract class BaseReportController<T extends BaseReportService> {
  constructor(protected service: T) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  protected show(@Res() response, @Query() query?) {
    const parametros = JSON.parse(JSON.stringify(query));

    return this.service.get(parametros, response);
  }
}
